import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MongoConnection } from '../lib/types';
import toast from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import { Play, Plus, Trash2, Sparkles } from 'lucide-react';

export default function AggregationBuilder() {
  const [connections, setConnections] = useState<MongoConnection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState('');
  const [databases, setDatabases] = useState<any[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [pipeline, setPipeline] = useState('[]');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    const { data } = await supabase.functions.invoke('list-connections');
    setConnections(data?.data || []);
  };

  const loadDatabases = async (connectionId: string) => {
    const { data } = await supabase.functions.invoke('list-databases', {
      body: { connection_id: connectionId },
    });
    setDatabases(data?.data || []);
  };

  const loadCollections = async (connectionId: string, databaseName: string) => {
    const { data } = await supabase.functions.invoke('list-collections', {
      body: { connection_id: connectionId, database_name: databaseName },
    });
    setCollections(data?.data || []);
  };

  const handleConnectionChange = (id: string) => {
    setSelectedConnection(id);
    setSelectedDatabase('');
    setSelectedCollection('');
    if (id) loadDatabases(id);
  };

  const handleDatabaseChange = (name: string) => {
    setSelectedDatabase(name);
    setSelectedCollection('');
    if (name && selectedConnection) loadCollections(selectedConnection, name);
  };

  const executeAggregation = async () => {
    if (!selectedConnection || !selectedDatabase || !selectedCollection) {
      toast.error('Please select connection, database, and collection');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('execute-aggregation', {
        body: {
          connection_id: selectedConnection,
          database_name: selectedDatabase,
          collection_name: selectedCollection,
          pipeline: JSON.parse(pipeline),
        },
      });

      if (error) throw error;
      setResults(data.data);
      toast.success(`Aggregation executed in ${data.data.execution_time_ms}ms`);
    } catch (error: any) {
      toast.error(error.message || 'Aggregation execution failed');
    } finally {
      setLoading(false);
    }
  };

  const getAISuggestion = async () => {
    const prompt = window.prompt('Describe your aggregation in plain English:');
    if (!prompt) return;

    try {
      const { data, error } = await supabase.functions.invoke('get-ai-suggestion', {
        body: { prompt, query_type: 'aggregation' },
      });
      if (error) throw error;
      setPipeline(JSON.stringify(data.data.suggestion, null, 2));
      toast.success('AI suggestion applied!');
    } catch (error: any) {
      toast.error('AI suggestion failed: ' + error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Aggregation Pipeline Builder</h2>
          <p className="text-muted-foreground mt-1">Build and execute complex aggregation pipelines</p>
        </div>
        <button
          onClick={getAISuggestion}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <Sparkles size={20} />
          AI Suggest
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <select
          value={selectedConnection}
          onChange={(e) => handleConnectionChange(e.target.value)}
          className="px-4 py-2 rounded-md border border-input bg-background"
        >
          <option value="">Select Connection</option>
          {connections.map((conn) => (
            <option key={conn.id} value={conn.id}>{conn.name}</option>
          ))}
        </select>
        <select
          value={selectedDatabase}
          onChange={(e) => handleDatabaseChange(e.target.value)}
          className="px-4 py-2 rounded-md border border-input bg-background"
          disabled={!selectedConnection}
        >
          <option value="">Select Database</option>
          {databases.map((db) => (
            <option key={db.name} value={db.name}>{db.name}</option>
          ))}
        </select>
        <select
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
          className="px-4 py-2 rounded-md border border-input bg-background"
          disabled={!selectedDatabase}
        >
          <option value="">Select Collection</option>
          {collections.map((coll) => (
            <option key={coll.name} value={coll.name}>{coll.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Aggregation Pipeline (JSON Array)</label>
        <div className="border border-border rounded-md overflow-hidden">
          <Editor
            height="300px"
            defaultLanguage="json"
            value={pipeline}
            onChange={(value) => setPipeline(value || '[]')}
            theme="vs-dark"
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={executeAggregation}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          <Play size={20} />
          {loading ? 'Executing...' : 'Execute Pipeline'}
        </button>
      </div>

      {results && (
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Results ({results.count} documents, {results.pipeline_stages} stages)</h3>
            <span className="text-sm text-muted-foreground">Execution time: {results.execution_time_ms}ms</span>
          </div>
          <div className="border border-border rounded-md overflow-hidden">
            <Editor
              height="400px"
              defaultLanguage="json"
              value={JSON.stringify(results.results, null, 2)}
              theme="vs-dark"
              options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
