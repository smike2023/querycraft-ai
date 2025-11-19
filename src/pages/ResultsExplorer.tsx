import { useState } from 'react';
import { Download, Grid, List } from 'lucide-react';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';

export default function ResultsExplorer() {
  const [view, setView] = useState<'table' | 'json'>('json');
  const [sampleData] = useState([
    { _id: '1', name: 'John Doe', email: 'john@example.com', age: 30, status: 'active' },
    { _id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 25, status: 'active' },
    { _id: '3', name: 'Bob Johnson', email: 'bob@example.com', age: 35, status: 'inactive' },
  ]);

  const exportToJSON = () => {
    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'results.json';
    a.click();
    toast.success('Exported to JSON');
  };

  const exportToCSV = () => {
    const headers = Object.keys(sampleData[0]);
    const csv = [
      headers.join(','),
      ...sampleData.map(row => headers.map(h => row[h as keyof typeof row]).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'results.csv';
    a.click();
    toast.success('Exported to CSV');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Query Results Explorer</h2>
          <p className="text-muted-foreground mt-1">View, filter, and export query results</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('table')}
            className={`p-2 rounded-md ${view === 'table' ? 'bg-primary text-white' : 'bg-muted'}`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setView('json')}
            className={`p-2 rounded-md ${view === 'json' ? 'bg-primary text-white' : 'bg-muted'}`}
          >
            <List size={20} />
          </button>
          <button
            onClick={exportToJSON}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            <Download size={20} />
            JSON
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90"
          >
            <Download size={20} />
            CSV
          </button>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Results ({sampleData.length} documents)</h3>
          <p className="text-sm text-muted-foreground">
            Results from your most recent query execution. Export or view in different formats.
          </p>
        </div>

        {view === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {Object.keys(sampleData[0]).map((key) => (
                    <th key={key} className="text-left p-3 font-medium">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleData.map((row, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/50">
                    {Object.values(row).map((value, vidx) => (
                      <td key={vidx} className="p-3">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-border rounded-md overflow-hidden">
            <Editor
              height="500px"
              defaultLanguage="json"
              value={JSON.stringify(sampleData, null, 2)}
              theme="vs-dark"
              options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
