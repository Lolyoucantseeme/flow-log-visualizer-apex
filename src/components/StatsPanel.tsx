
import { LogData } from "@/types";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface StatsPanelProps {
  stats: LogData["stats"];
  onStatsClick?: (statKey: string) => void;
}

export function StatsPanel({ stats, onStatsClick }: StatsPanelProps) {
  const [hidden, setHidden] = useState(false);

  if (hidden) {
    return (
      <div className="absolute top-4 right-4 z-10">
        <Button onClick={() => setHidden(false)} variant="default">
          Show Data Cards
        </Button>
      </div>
    );
  }

  const handleStatClick = (statKey: string) => {
    if (onStatsClick) {
      onStatsClick(statKey);
    }
  };

  return (
    <div className="absolute top-4 right-4 w-80 z-10">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="p-4 bg-slate-600 text-white flex justify-between items-center">
          <h3 className="text-lg font-semibold">Flow Statistics</h3>
          <Button onClick={() => setHidden(true)} variant="outline" size="sm" className="text-white border-white hover:bg-slate-700">
            Hide Data Cards
          </Button>
        </div>
        
        <div className="divide-y divide-gray-200">
          <StatCard 
            label="Total Flow Time" 
            value={`${stats.totalTime} milliseconds`} 
            onClick={() => handleStatClick('totalTime')} 
          />
          <StatCard 
            label="Total SOQL Used" 
            value={stats.totalSoql.toString()} 
            onClick={() => handleStatClick('totalSoql')} 
          />
          <StatCard 
            label="Total Function Called" 
            value={stats.totalFunctionCalled.toString()} 
            onClick={() => handleStatClick('totalFunctionCalled')} 
          />
          <StatCard 
            label="Total Records Fetched" 
            value={stats.totalRecordsFetched.toString()} 
            onClick={() => handleStatClick('totalRecordsFetched')} 
          />
          <StatCard 
            label="Recursion Found" 
            value={stats.recursionFound.toString()} 
            onClick={() => handleStatClick('recursionFound')} 
          />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  onClick?: () => void;
}

function StatCard({ label, value, onClick }: StatCardProps) {
  return (
    <div 
      className="p-4 bg-slate-500 text-white text-right hover:bg-slate-600 transition-colors cursor-pointer" 
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <span>{label}:</span>
        <span className="font-bold">{value}</span>
      </div>
    </div>
  );
}
