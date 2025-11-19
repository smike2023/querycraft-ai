import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { QueryHistory as QueryHistoryType, Analytics } from '../lib/types';
import toast from 'react-hot-toast';
import { History, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function QueryHistory() {
  const [history, setHistory] = useState<QueryHistoryType[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all');

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      const historyParams = filter !== 'all' ? `?success=${filter === 'success'}` : '';
      const { data: historyData } = await supabase.functions.invoke('get-history' + historyParams);
      const { data: analyticsData } = await supabase.functions.invoke('get-analytics');
      
      setHistory(historyData?.data || []);
      setAnalytics(analyticsData?.data || null);
    } catch (error: any) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12"><div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Query History & Analytics</h2>
        <p className="text-muted-foreground mt-1">Track and analyze query performance</p>
      </div>

      {analytics && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Queries</span>
              <History size={20} className="text-primary" />
            </div>
            <div className="text-3xl font-bold">{analytics.totalQueries}</div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <CheckCircle size={20} className="text-success" />
            </div>
            <div className="text-3xl font-bold">{analytics.successRate.toFixed(1)}%</div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Avg Time</span>
              <Clock size={20} className="text-warning" />
            </div>
            <div className="text-3xl font-bold">{analytics.avgExecutionTime}ms</div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Slow Queries</span>
              <AlertTriangle size={20} className="text-error" />
            </div>
            <div className="text-3xl font-bold">{analytics.slowQueries.length}</div>
          </div>
        </div>
      )}

      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Recent Queries</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md text-sm ${filter === 'all' ? 'bg-primary text-white' : 'bg-muted'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('success')}
              className={`px-3 py-1 rounded-md text-sm ${filter === 'success' ? 'bg-success text-white' : 'bg-muted'}`}
            >
              Success
            </button>
            <button
              onClick={() => setFilter('failed')}
              className={`px-3 py-1 rounded-md text-sm ${filter === 'failed' ? 'bg-error text-white' : 'bg-muted'}`}
            >
              Failed
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {history.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-muted rounded-md">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {item.success ? (
                    <CheckCircle size={16} className="text-success" />
                  ) : (
                    <XCircle size={16} className="text-error" />
                  )}
                  <span className="font-medium">{item.collection_name || 'N/A'}</span>
                  {item.execution_time_ms && (
                    <span className="text-xs text-muted-foreground">{item.execution_time_ms}ms</span>
                  )}
                </div>
                {item.error_message && (
                  <p className="text-sm text-error">{item.error_message}</p>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(item.execution_date).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {history.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <History size={48} className="mx-auto mb-4 opacity-50" />
            <p>No query history yet. Execute some queries to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
