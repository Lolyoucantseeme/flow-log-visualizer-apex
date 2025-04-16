
import { useState } from "react";
import { LogData } from "@/types";
import { LogFileUploader } from "@/components/LogFileUploader";
import LogFlowVisualizer from "@/components/LogFlowVisualizer";

const Index = () => {
  const [logData, setLogData] = useState<LogData | null>(null);

  const handleLogDataLoaded = (data: LogData) => {
    setLogData(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Apex Flow Log Visualizer</h1>
          {logData && (
            <button 
              onClick={() => setLogData(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Upload Different Log
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {!logData ? (
          <div className="py-12">
            <LogFileUploader onLogDataLoaded={handleLogDataLoaded} />
          </div>
        ) : (
          <div className="h-[calc(100vh-130px)]">
            <LogFlowVisualizer logData={logData} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
