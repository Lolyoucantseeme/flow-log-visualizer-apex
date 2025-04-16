
import { LogData } from "@/types";

// Sample log data to demonstrate the visualization
export const sampleLogData: LogData = {
  nodes: [
    {
      id: "node-1",
      type: "function",
      status: "success",
      label: "Function:TRIGGERS",
      details: "",
      stats: {
        soql: 0,
        soqlRows: 0,
        methodTime: 0
      }
    },
    {
      id: "node-2",
      type: "beforeUpdate",
      status: "success",
      label: "ContactTrigger on Contact On BeforeUpdate",
      details: "",
      stats: {
        soql: 0,
        soqlRows: 0,
        methodTime: 0
      }
    },
    {
      id: "node-3",
      type: "beforeUpdate",
      status: "error",
      label: "ContactTrigger on Contact On BeforeUpdate",
      details: "",
      stats: {
        soql: 0,
        soqlRows: 0,
        methodTime: 0
      }
    },
    {
      id: "node-4",
      type: "function",
      status: "success",
      label: "Function:DuplicateDetector",
      details: "",
      stats: {
        soql: 0,
        soqlRows: 0,
        methodTime: 0
      }
    },
    {
      id: "node-5",
      type: "function",
      status: "error",
      label: "Code: DuplicateDetector",
      details: "",
      stats: {
        soql: 0,
        soqlRows: 0,
        methodTime: 0
      }
    },
    {
      id: "node-6",
      type: "afterUpdate",
      status: "success",
      label: "ContactTrigger on Contact On AfterUpdate",
      details: "",
      stats: {
        soql: 2,
        soqlRows: 2,
        methodTime: 0
      }
    }
  ],
  edges: [
    {
      id: "edge-1-2",
      source: "node-1",
      target: "node-2"
    },
    {
      id: "edge-2-3",
      source: "node-2",
      target: "node-3"
    },
    {
      id: "edge-3-4",
      source: "node-3",
      target: "node-4"
    },
    {
      id: "edge-4-5",
      source: "node-4",
      target: "node-5"
    },
    {
      id: "edge-5-6",
      source: "node-5",
      target: "node-6"
    }
  ],
  stats: {
    totalTime: 0,
    totalSoql: 6,
    totalFunctionCalled: 16,
    totalRecordsFetched: 2,
    recursionFound: 0
  }
};
