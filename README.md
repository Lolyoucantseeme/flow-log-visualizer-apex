
# Apex Flow Log Visualizer

A beautiful web application for visualizing Apex execution logs in a flow diagram format, providing clear insights into function execution paths, SQL usage, and performance statistics.

## Features

- **Interactive Flow Visualization**: Visualize the execution path of Apex logs with color-coded nodes and animated connections
- **Execution Statistics**: View detailed statistics about SOQL queries, execution time, and function calls
- **File Upload**: Easily upload Apex log files for visualization
- **Responsive Design**: Works on desktop and mobile devices
- **Interactive Controls**: Pan, zoom, and navigate through complex execution flows
- **Detail Cards**: View detailed information about each execution step

## Usage

1. **Upload a Log File**: Drag and drop an Apex log file onto the uploader, or click to select a file
2. **View the Flow**: The application will parse the log and display the execution flow
3. **Interact with the Diagram**: 
   - Zoom in/out with mouse wheel or pinch gestures
   - Pan by dragging in empty areas
   - Click on nodes to view detailed information
   - Use the controls in the bottom right to adjust the view

## Development

This project is built with:

- React + TypeScript
- ReactFlow for flow visualization
- Tailwind CSS for styling
- shadcn/ui for UI components

## Future Enhancements

- Advanced log parsing capabilities
- Support for different log formats
- Export functionality for diagrams
- Performance analysis tools
- Comparison between different log executions
- Dark mode support
