import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MongoConnection } from '../lib/types';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, CheckCircle, XCircle, Database } from 'lucide-react';

export default function ConnectionManager() {
  const [connections, setConnections] = useState<MongoConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    connection_string: '',
    database_name: '',
    tags: '',
    color: '#2563eb',
  });

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('list-connections');
      if (error) throw error;
      setConnections(data?.data || []);
    } catch (error: any) {
      toast.error('Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.functions.invoke('add-connection', {
        body: {
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        },
      });
      if (error) throw error;
      toast.success('Connection added successfully');
      setShowForm(false);
      setFormData({ name: '', connection_string: '', database_name: '', tags: '', color: '#2563eb' });
      loadConnections();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add connection');
    }
  };

  const testConnection = async (connectionString: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('test-connection', {
        body: { connection_string: connectionString },
      });
      if (error) throw error;
      toast.success('Connection successful!');
    } catch (error: any) {
      toast.error('Connection failed: ' + error.message);
    }
  };

  const deleteConnection = async (id: string) => {
    if (!confirm('Delete this connection?')) return;
    try {
      await supabase.functions.invoke('delete-connection', { body: { connection_id: id } });
      toast.success('Connection deleted');
      loadConnections();
    } catch (error: any) {
      toast.error('Failed to delete connection');
    }
  };

  if (loading) {
    return <div className="text-center py-12"><div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Connection Manager</h2>
          <p className="text-muted-foreground mt-1">Manage your MongoDB connections</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          <Plus size={20} />
          Add Connection
        </button>
      </div>

      {showForm && (
        <div className="bg-card p-6 rounded-lg border border-border mb-6">
          <h3 className="text-xl font-semibold mb-4">New MongoDB Connection</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Connection Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-input bg-background"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Connection String</label>
              <input
                type="text"
                value={formData.connection_string}
                onChange={(e) => setFormData({ ...formData, connection_string: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-input bg-background font-mono text-sm"
                placeholder="mongodb+srv://user:pass@cluster.mongodb.net/"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Database Name (optional)</label>
              <input
                type="text"
                value={formData.database_name}
                onChange={(e) => setFormData({ ...formData, database_name: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-input bg-background"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-input bg-background"
                  placeholder="production, analytics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-10 rounded-md border border-input"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
                Save Connection
              </button>
              <button
                type="button"
                onClick={() => testConnection(formData.connection_string)}
                className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90"
              >
                Test Connection
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connections.map((conn) => (
          <div
            key={conn.id}
            className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: conn.color + '20' }}
                >
                  <Database size={24} style={{ color: conn.color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{conn.name}</h3>
                  <p className="text-xs text-muted-foreground">{conn.database_name || 'All databases'}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => deleteConnection(conn.id)} className="p-1 hover:bg-error/10 rounded text-error">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              {conn.connection_status === 'connected' ? (
                <CheckCircle size={16} className="text-success" />
              ) : (
                <XCircle size={16} className="text-muted-foreground" />
              )}
              <span className="text-sm text-muted-foreground capitalize">{conn.connection_status}</span>
            </div>

            {conn.tags && conn.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {conn.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-accent text-xs rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {connections.length === 0 && !showForm && (
        <div className="text-center py-12 text-muted-foreground">
          <Database size={48} className="mx-auto mb-4 opacity-50" />
          <p>No connections yet. Add your first MongoDB connection to get started.</p>
        </div>
      )}
    </div>
  );
}
