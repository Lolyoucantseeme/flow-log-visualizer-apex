import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useEdgesState,
  useNodesState,
  Node,
  Edge,
  ConnectionLineType,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

import { LogData, LogNode as LogNodeType } from "@/types";
import LogFlowNode from "./LogFlowNode";
import { StatsPanel } from "./StatsPanel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const nodeTypes = {
  logNode: LogFlowNode,
};

interface LogFlowVisualizerProps {
  logData: LogData;
}

// Main component that renders the flow diagram
const FlowDiagram = ({ logData }: LogFlowVisualizerProps) => {
  const [selectedNode, setSelectedNode] = useState<LogNodeType | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [fit, setFit] = useState(true);

  // Create tree-like structure with hierarchical layout - Fixed to avoid variable initialization issues
  const calculateNodePositions = useCallback((
    nodes: LogNodeType[], 
    parentId: string | null = null,
    level = 0,
    startXOffset = 0
  ): { nodes: Node[]; endXOffset: number } => {
    const childNodes = nodes.filter(n => 
      (parentId === null && !n.parentId) || 
      n.parentId === parentId
    );
    
    let resultNodes: Node[] = [];
    let currentXOffset = startXOffset;
    
    // Process each child node
    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i];
      
      // Calculate positions for this node's children first
      const childResult = calculateNodePositions(
        nodes, 
        node.id, 
        level + 1, 
        currentXOffset
      );
      
      // Get the width that was used by children
      const childrenWidth = childResult.endXOffset - currentXOffset;
      
      // The width of this node
      const nodeWidth = 250;
      
      // Position this node
      // If it has children, center it over its children; otherwise, place at current offset
      const position = {
        x: childrenWidth > 0 
          ? currentXOffset + (childrenWidth - nodeWidth) / 2 
          : currentXOffset,
        y: level * 200
      };
      
      // Add this node to the result
      resultNodes.push({
        id: node.id,
        type: "logNode",
        position,
        data: { 
          node,
          onStatsClick: handleNodeClick
        },
      });
      
      // Add child nodes to the result
      resultNodes = [...resultNodes, ...childResult.nodes];
      
      // Update the offset for the next sibling
      // If this node has children, use the space after its last child
      // Otherwise, move past this node's width plus a margin
      currentXOffset = childrenWidth > 0 
        ? childResult.endXOffset
        : currentXOffset + nodeWidth + 50;
    }
    
    return { nodes: resultNodes, endXOffset: currentXOffset };
  }, []);

  // Convert our log data to ReactFlow nodes and edges
  const initialNodes: Node[] = useMemo(() => {
    if (!logData || !logData.nodes || logData.nodes.length === 0) {
      return [];
    }
    return calculateNodePositions(logData.nodes).nodes;
  }, [logData.nodes, calculateNodePositions]);

  const initialEdges: Edge[] = useMemo(() => {
    if (!logData || !logData.edges) {
      return [];
    }
    return logData.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: "smoothstep",
      animated: true,
      label: edge.label,
      style: { stroke: "#b1b1b7", strokeWidth: 2 },
    }));
  }, [logData.edges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleNodeClick = useCallback((node: LogNodeType) => {
    setSelectedNode(node);
    setDetailsDialogOpen(true);
  }, []);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        fitView={fit}
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#ccc" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const nodeData = node.data?.node as LogNodeType;
            if (!nodeData) return "#eee";
            
            if (nodeData.status === "start") return "#22c55e";
            if (nodeData.status === "end") return "#ef4444";
            if (nodeData.status === "success") return "#22c55e";
            if (nodeData.status === "error") return "#ef4444";
            return "#f59e0b";
          }}
          maskColor="#f8fafc"
        />
        
        <Panel position="top-left" className="p-2">
          <Button onClick={() => setFit(!fit)} variant="outline" className="bg-white">
            {fit ? "Disable Auto-fit" : "Enable Auto-fit"}
          </Button>
        </Panel>
        
        <StatsPanel stats={logData.stats} onStatsClick={(statKey) => {
          // Add functionality to highlight nodes based on the stat clicked
          console.log("Stat clicked:", statKey);
        }} />
      </ReactFlow>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedNode?.label || "Node Details"}
            </DialogTitle>
          </DialogHeader>
          
          {selectedNode && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm"><span className="font-medium">SOQL Queries:</span> {selectedNode.stats.soql}</div>
                    <div className="text-sm"><span className="font-medium">SOQL Rows:</span> {selectedNode.stats.soqlRows}</div>
                    <div className="text-sm"><span className="font-medium">Method Time:</span> {selectedNode.stats.methodTime} ms</div>
                    {selectedNode.stats.totalMethod && (
                      <div className="text-sm"><span className="font-medium">Total Methods:</span> {selectedNode.stats.totalMethod}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {selectedNode.soqlQuery && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">SOQL Query</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                      {selectedNode.soqlQuery}
                    </pre>
                  </CardContent>
                </Card>
              )}
              
              {selectedNode.details && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">{selectedNode.details}</div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

// Wrapper component that provides the ReactFlow context
const LogFlowVisualizer = ({ logData }: LogFlowVisualizerProps) => {
  return (
    <div className="w-full h-full bg-gray-50">
      <ReactFlowProvider>
        <FlowDiagram logData={logData} />
      </ReactFlowProvider>
    </div>
  );
};

export default LogFlowVisualizer;
