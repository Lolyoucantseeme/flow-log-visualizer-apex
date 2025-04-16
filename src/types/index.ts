
export interface LogNode {
  id: string;
  type: "function" | "trigger" | "beforeUpdate" | "afterUpdate" | "dml";
  status: "success" | "error" | "warning" | "start" | "end";
  label: string;
  details?: string;
  soqlQuery?: string;
  stats: {
    soql: number;
    soqlRows: number;
    methodTime: number;
    totalMethod?: number;
  };
  parentId?: string;
}

export interface LogEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
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
