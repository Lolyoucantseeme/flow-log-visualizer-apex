
import { LogData } from "@/types";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface StatsPanelProps {
  stats: LogData["stats"];
}

export function StatsPanel({ stats }: StatsPanelProps) {
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
          <StatCard label="Total Flow Time" value={`${stats.totalTime} milliseconds`} />
          <StatCard label="Total SOQL Used" value={stats.totalSoql.toString()} />
          <StatCard label="Total Function Called" value={stats.totalFunctionCalled.toString()} />
          <StatCard label="Total Records Fetched" value={stats.totalRecordsFetched.toString()} />
          <StatCard label="Recursion Found" value={stats.recursionFound.toString()} />
        </div>
        
        <div className="p-3 bg-slate-500 text-white text-center">
          <Button variant="outline" size="sm" className="text-white border-white hover:bg-slate-600">
            Hide Report
          </Button>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="p-4 bg-slate-500 text-white text-right">
      <div className="flex justify-between items-center">
        <span>{label}:</span>
        <span className="font-bold">{value}</span>
      </div>
    </div>
  );
}
