
export interface LogNode {
  id: string;
  type: "function" | "trigger" | "beforeUpdate" | "afterUpdate";
  status: "success" | "error" | "warning";
  label: string;
  details?: string;
  stats: {
    soql: number;
    soqlRows: number;
    methodTime: number;
  };
}

export interface LogEdge {
  id: string;
  source: string;
  target: string;
}

export interface LogData {
  nodes: LogNode[];
  edges: LogEdge[];
  stats: {
    totalTime: number;
    totalSoql: number;
    totalFunctionCalled: number;
    totalRecordsFetched: number;
    recursionFound: number;
  };
}
