
import { useCallback, useMemo, useState } from "react";
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
} from "reactflow";
import "reactflow/dist/style.css";

import { LogData, LogNode as LogNodeType } from "@/types";
import LogFlowNode from "./LogFlowNode";
import { StatsPanel } from "./StatsPanel";
import { Button } from "@/components/ui/button";

const nodeTypes = {
  logNode: LogFlowNode,
};

interface LogFlowVisualizerProps {
  logData: LogData;
}

const LogFlowVisualizer = ({ logData }: LogFlowVisualizerProps) => {
  // Convert our log data to ReactFlow nodes and edges
  const initialNodes: Node[] = useMemo(() => {
    return logData.nodes.map((node, index) => ({
      id: node.id,
      type: "logNode",
      position: { x: 250, y: index * 200 },
      data: { node },
    }));
  }, [logData.nodes]);

  const initialEdges: Edge[] = useMemo(() => {
    return logData.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: "smoothstep",
      animated: true,
      style: { stroke: "#b1b1b7", strokeWidth: 2 },
    }));
  }, [logData.edges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [fit, setFit] = useState(true);

  return (
    <div className="w-full h-full bg-gray-50">
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
        
        <StatsPanel stats={logData.stats} />
      </ReactFlow>
    </div>
  );
};

export default LogFlowVisualizer;
