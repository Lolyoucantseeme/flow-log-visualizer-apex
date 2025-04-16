
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileIcon, AlertCircle } from "lucide-react";
import { LogData } from "@/types";
import { sampleLogData } from "@/data/sampleLogData";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { readFileAsText, parseApexLog } from "@/utils/logParser";

interface LogFileUploaderProps {
  onLogDataLoaded: (data: LogData) => void;
}

export function LogFileUploader({ onLogDataLoaded }: LogFileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, we would parse the log file here
      // const logContent = await readFileAsText(file);
      // const parsedData = parseApexLog(logContent);
      // onLogDataLoaded(parsedData);
      
      // For now, we'll just use the sample data
      setTimeout(() => {
        setIsLoading(false);
        onLogDataLoaded(sampleLogData);
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      setError(`Failed to process log file: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleUseSampleData = () => {
    setError(null);
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      onLogDataLoaded(sampleLogData);
    }, 500);
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Apex Log Visualizer</CardTitle>
        <CardDescription>
          Upload your Apex log file to visualize the execution flow
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? "border-primary bg-primary/10" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Drag & Drop your log file here</h3>
          <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
          
          <Input
            type="file"
            accept=".log,.txt"
            onChange={handleFileChange}
            className="hidden"
            id="log-file-input"
          />
          <Button asChild variant="outline">
            <label htmlFor="log-file-input" className="cursor-pointer">
              Browse Files
            </label>
          </Button>
          
          {file && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-2">
              <FileIcon className="h-6 w-6 text-blue-500" />
              <div className="text-left flex-1 text-sm truncate">{file.name}</div>
              <Button 
                onClick={handleUpload} 
                size="sm"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Visualize"}
              </Button>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button 
              variant="link" 
              onClick={handleUseSampleData}
              disabled={isLoading}
            >
              {isLoading ? "Loading sample..." : "Or use sample data to see a demo"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
