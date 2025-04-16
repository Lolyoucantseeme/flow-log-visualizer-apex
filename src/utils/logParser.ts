
import { LogData, LogNode, LogEdge } from "@/types";

/**
 * Parses a raw Apex log file into structured LogData
 */
export function parseApexLog(logContent: string): LogData {
  console.log("Log content to parse:", logContent.slice(0, 100) + "...");
  
  // In a real implementation, this would parse the actual log format
  // For demonstration purposes, we'll create a sample tree structure
  
  const nodes: LogNode[] = [];
  const edges: LogEdge[] = [];
  
  // Sample structure based on the provided image
  // In a real implementation, this would parse the log content
  
  // First level - AfterUpdate
  const node1: LogNode = {
    id: "1",
    type: "afterUpdate",
    status: "start",
    label: "ContactTrigger on Contact On AfterUpdate",
    stats: {
      soql: 2,
      soqlRows: 2,
      methodTime: 0,
      totalMethod: 3
    },
    soqlQuery: "SELECT Id, Name FROM Contact WHERE Id IN :contactIds"
  };
  
  // DML Operation
  const node2: LogNode = {
    id: "2",
    type: "dml",
    status: "success",
    label: "1 Records Updated on Account",
    parentId: "1",
    stats: {
      soql: 0,
      soqlRows: 0,
      methodTime: 0,
      totalMethod: 0
    }
  };
  
  // Function start
  const node3: LogNode = {
    id: "3",
    type: "function",
    status: "start",
    label: "Function:DuplicateDetector",
    parentId: "2",
    stats: {
      soql: 0,
      soqlRows: 0,
      methodTime: 0,
      totalMethod: 0
    }
  };
  
  // Function end
  const node4: LogNode = {
    id: "4",
    type: "function",
    status: "end",
    label: "Code: DuplicateDetector",
    parentId: "3",
    stats: {
      soql: 0,
      soqlRows: 0,
      methodTime: 0,
      totalMethod: 0
    },
    soqlQuery: "SELECT Id FROM Account WHERE Name = :accountName LIMIT 1"
  };
  
  // Second AfterUpdate start
  const node5: LogNode = {
    id: "5",
    type: "afterUpdate",
    status: "start",
    label: "AccountTriggerTest on Account On AfterUpdate",
    parentId: "4",
    stats: {
      soql: 3,
      soqlRows: 0,
      methodTime: 0,
      totalMethod: 8
    }
  };
  
  // Second AfterUpdate end
  const node6: LogNode = {
    id: "6",
    type: "afterUpdate",
    status: "end",
    label: "AccountTriggerTest on Account On AfterUpdate",
    parentId: "5",
    stats: {
      soql: 0,
      soqlRows: 0,
      methodTime: 0,
      totalMethod: 0
    }
  };
  
  // Third AfterUpdate
  const node7: LogNode = {
    id: "7",
    type: "afterUpdate",
    status: "start",
    label: "PlatformEventPublish on Account On AfterUpdate",
    parentId: "6",
    stats: {
      soql: 0,
      soqlRows: 0,
      methodTime: 0,
      totalMethod: 0
    }
  };
  
  // DML at the end
  const node8: LogNode = {
    id: "8",
    type: "dml",
    status: "success",
    label: "1 Records Inserted on Employee_On_Boarding__e",
    parentId: "7",
    stats: {
      soql: 0,
      soqlRows: 0,
      methodTime: 0,
      totalMethod: 0
    }
  };
  
  nodes.push(node1, node2, node3, node4, node5, node6, node7, node8);
  
  // Create edges between nodes based on parent relationships
  nodes.forEach((node, index) => {
    if (index > 0) {
      const prevNode = nodes[index - 1];
      edges.push({
        id: `e${prevNode.id}-${node.id}`,
        source: prevNode.id,
        target: node.id,
        label: node.type === 'dml' ? `${node.label.split(' ')[0]} Records` : undefined
      });
    }
  });
  
  // Sample statistics based on the created nodes
  const totalSoql = nodes.reduce((sum, node) => sum + node.stats.soql, 0);
  const totalRecordsFetched = nodes.reduce((sum, node) => sum + node.stats.soqlRows, 0);
  
  return {
    nodes,
    edges,
    stats: {
      totalTime: 150,
      totalSoql,
      totalFunctionCalled: nodes.filter(n => n.type === 'function').length,
      totalRecordsFetched,
      recursionFound: 0
    }
  };
}

/**
 * Utility to read a file as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}
