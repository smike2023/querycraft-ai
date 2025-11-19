import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MongoConnection } from '../lib/types';
import toast from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import { Play, Save, Sparkles, Database } from 'lucide-react';

export default function QueryBuilder() {
  const [connections, setConnections] = useState<MongoConnection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState('');
  const [databases, setDatabases] = useState<any[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [filter, setFilter] = useState('{}');
  const [projection, setProjection] = useState('');
  const [sort, setSort] = useState('');
  const [limit, setLimit] = useState('100');
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
    setDatabases([]);
    setCollections([]);
    if (id) loadDatabases(id);
  };

  const handleDatabaseChange = (name: string) => {
    setSelectedDatabase(name);
    setSelectedCollection('');
    setCollections([]);
    if (name && selectedConnection) loadCollections(selectedConnection, name);
  };

  const executeQuery = async () => {
    if (!selectedConnection || !selectedDatabase || !selectedCollection) {
      toast.error('Please select connection, database, and collection');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('execute-query', {
        body: {
          connection_id: selectedConnection,
          database_name: selectedDatabase,
          collection_name: selectedCollection,
          filter: JSON.parse(filter || '{}'),
          projection: projection ? JSON.parse(projection) : undefined,
          sort: sort ? JSON.parse(sort) : undefined,
          limit: parseInt(limit),
        },
      });

      if (error) throw error;
      setResults(data.data);
      toast.success(`Query executed in ${data.data.execution_time_ms}ms`);

      // Save to history
      await supabase.functions.invoke('save-history', {
        body: {
          connection_id: selectedConnection,
          collection_name: selectedCollection,
          execution_time_ms: data.data.execution_time_ms,
          documents_returned: data.data.count,
          success: true,
          query_text: filter,
        },
      });
    } catch (error: any) {
      toast.error(error.message || 'Query execution failed');
      await supabase.functions.invoke('save-history', {
        body: {
          connection_id: selectedConnection,
          collection_name: selectedCollection,
          success: false,
          error_message: error.message,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const getAISuggestion = async () => {
    const prompt = window.prompt('Describe your query in plain English:');
    if (!prompt) return;

    try {
      const { data, error } = await supabase.functions.invoke('get-ai-suggestion', {
        body: { prompt, query_type: 'find' },
      });
      if (error) throw error;
      
      if (data.data.suggestion.filter) {
        setFilter(JSON.stringify(data.data.suggestion.filter, null, 2));
      }
      if (data.data.suggestion.projection) {
        setProjection(JSON.stringify(data.data.suggestion.projection, null, 2));
      }
      if (data.data.suggestion.sort) {
        setSort(JSON.stringify(data.data.suggestion.sort, null, 2));
      }
      if (data.data.suggestion.limit) {
        setLimit(data.data.suggestion.limit.toString());
      }
      toast.success('AI suggestion applied!');
    } catch (error: any) {
      toast.error('AI suggestion failed: ' + error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">MongoDB Query Builder</h2>
          <p className="text-muted-foreground mt-1">Build and execute find() queries with visual interface</p>
        </div>
        <button
          onClick={getAISuggestion}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <Sparkles size={20} />
          AI Suggest
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
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
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          placeholder="Limit"
          className="px-4 py-2 rounded-md border border-input bg-background"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Filter</label>
          <div className="border border-border rounded-md overflow-hidden">
            <Editor
              height="150px"
              defaultLanguage="json"
              value={filter}
              onChange={(value) => setFilter(value || '{}')}
              theme="vs-dark"
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Projection (optional)</label>
          <div className="border border-border rounded-md overflow-hidden">
            <Editor
              height="150px"
              defaultLanguage="json"
              value={projection}
              onChange={(value) => setProjection(value || '')}
              theme="vs-dark"
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Sort (optional)</label>
          <div className="border border-border rounded-md overflow-hidden">
            <Editor
              height="150px"
              defaultLanguage="json"
              value={sort}
              onChange={(value) => setSort(value || '')}
              theme="vs-dark"
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={executeQuery}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          <Play size={20} />
          {loading ? 'Executing...' : 'Execute Query'}
        </button>
      </div>

      {results && (
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Results ({results.count} documents)</h3>
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
