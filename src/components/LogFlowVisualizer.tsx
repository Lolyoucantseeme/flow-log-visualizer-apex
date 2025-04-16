
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

  // Create tree-like structure with hierarchical layout
  const calculateNodePositions = (
    nodes: LogNodeType[], 
    parentId: string | null = null,
    level = 0,
    xOffset = 0
  ): { nodes: Node[]; xOffset: number } => {
    const childNodes = nodes.filter(n => 
      (parentId === null && !n.parentId) || 
      n.parentId === parentId
    );
    
    let currentXOffset = xOffset;
    let resultNodes: Node[] = [];
    
    childNodes.forEach((node, index) => {
      const childResult = calculateNodePositions(
        nodes, 
        node.id, 
        level + 1, 
        currentXOffset
      );
      
      // Position this node
      const width = 250;
      const position = {
        x: childResult.xOffset > currentXOffset 
          ? (childResult.xOffset - width) / 2 + currentXOffset
          : currentXOffset,
        y: level * 200
      };
      
      resultNodes.push({
        id: node.id,
        type: "logNode",
        position,
        data: { 
          node,
          onStatsClick: handleNodeClick
        },
      });
      
      // Add child nodes
      resultNodes = [...resultNodes, ...childResult.nodes];
      
      // Update offset for next sibling
      currentXOffset = Math.max(childResult.xOffset, currentXOffset + width + 50);
    });
    
    return { nodes: resultNodes, xOffset: currentXOffset };
  };

  // Convert our log data to ReactFlow nodes and edges
  const initialNodes: Node[] = useMemo(() => {
    return calculateNodePositions(logData.nodes).nodes;
  }, [logData.nodes]);

  const initialEdges: Edge[] = useMemo(() => {
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
