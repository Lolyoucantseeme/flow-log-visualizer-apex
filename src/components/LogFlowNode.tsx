
import { memo } from "react";
import { Handle, Position } from "reactflow";
import { LogNode as LogNodeType } from "@/types";

const statusColorMap = {
  success: "bg-green-600",
  error: "bg-red-600",
  warning: "bg-amber-600",
};

const typeToLabel = {
  function: "Function",
  trigger: "Trigger",
  beforeUpdate: "BeforeUpdate",
  afterUpdate: "AfterUpdate",
};

interface LogNodeProps {
  data: {
    node: LogNodeType;
  };
  selected: boolean;
}

const LogFlowNode = ({ data, selected }: LogNodeProps) => {
  const { node } = data;
  const statusColor = statusColorMap[node.status] || "bg-gray-600";

  return (
    <div className={`px-0 py-0 shadow-md rounded-md border-2 ${selected ? "border-blue-400" : "border-transparent"}`}>
      <div className={`${statusColor} text-white font-medium px-4 py-2 text-center rounded-t-sm`}>
        {typeToLabel[node.type] || "Function"}
      </div>
      <div className="bg-white p-3 rounded-b-sm">
        <div className="font-semibold text-gray-800">{node.label}</div>
        {node.details && <div className="text-sm text-gray-600 mt-1">{node.details}</div>}
        
        <div className="mt-2 text-xs space-y-1 bg-gray-50 p-2 rounded">
          <div className="flex gap-1">
            <span className="text-blue-600">{node.stats.soql}</span> SOQL | <span>{node.stats.soqlRows}</span> SOQL Rows
          </div>
          <div className="flex gap-1">
            <span className="text-blue-600">{node.stats.methodTime}</span> milliseconds Taken
          </div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 border-2 border-gray-400 bg-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 border-2 border-gray-400 bg-white"
      />
    </div>
  );
};

export default memo(LogFlowNode);
