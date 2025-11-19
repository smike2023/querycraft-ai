import { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import { ArrowRight, Copy, Sparkles, FileCode, Info } from 'lucide-react';

export default function NosqlToSqlConverter() {
  const [mongoQuery, setMongoQuery] = useState(`{
  "find": "users",
  "filter": {
    "age": { "$gt": 25 },
    "status": "active"
  },
  "projection": {
    "name": 1,
    "email": 1,
    "age": 1
  },
  "sort": { "created_at": -1 },
  "limit": 10
}`);
  
  const [sqlOutput, setSqlOutput] = useState('');
  const [explanation, setExplanation] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [queryType, setQueryType] = useState('find');

  const exampleQueries = {
    find: `{
  "find": "users",
  "filter": {
    "age": { "$gt": 25 },
    "status": "active"
  },
  "projection": {
    "name": 1,
    "email": 1,
    "age": 1
  },
  "sort": { "created_at": -1 },
  "limit": 10
}`,
    aggregate: `[
  {
    "$match": { "status": "active" }
  },
  {
    "$group": {
      "_id": "$category",
      "count": { "$sum": 1 },
      "avgPrice": { "$avg": "$price" }
    }
  },
  {
    "$sort": { "count": -1 }
  },
  {
    "$limit": 5
  }
]`,
    insert: `{
  "insert": "users",
  "document": {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "status": "active"
  }
}`,
    update: `{
  "update": "users",
  "filter": { "email": "john@example.com" },
  "update": {
    "$set": { "status": "inactive", "updated_at": "2025-11-19" }
  }
}`,
    delete: `{
  "delete": "users",
  "filter": {
    "status": "inactive",
    "last_login": { "$lt": "2024-01-01" }
  }
}`,
    lookup: `[
  {
    "$lookup": {
      "from": "orders",
      "localField": "_id",
      "foreignField": "user_id",
      "as": "user_orders"
    }
  },
  {
    "$match": { "user_orders": { "$ne": [] } }
  },
  {
    "$project": {
      "name": 1,
      "email": 1,
      "order_count": { "$size": "$user_orders" }
    }
  }
]`
  };

  const handleConvert = async () => {
    if (!mongoQuery.trim()) {
      toast.error('Please enter a MongoDB query');
      return;
    }

    setLoading(true);
    setSqlOutput('');
    setExplanation('');
    setNotes([]);

    try {
      const { data, error } = await supabase.functions.invoke('nosql-to-sql-converter', {
        body: {
          mongodb_query: mongoQuery,
          query_type: queryType
        }
      });

      if (error) throw error;

      if (data?.data) {
        setSqlOutput(data.data.sql);
        setExplanation(data.data.explanation);
        setNotes(data.data.notes || []);
        toast.success('Conversion successful!');
      } else {
        throw new Error('No conversion result received');
      }

    } catch (error: any) {
      toast.error(error.message || 'Conversion failed');
      console.error('Conversion error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySQL = () => {
    if (sqlOutput) {
      navigator.clipboard.writeText(sqlOutput);
      toast.success('SQL copied to clipboard!');
    }
  };

  const loadExample = (type: string) => {
    setQueryType(type);
    setMongoQuery(exampleQueries[type as keyof typeof exampleQueries]);
    setSqlOutput('');
    setExplanation('');
    setNotes([]);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">NOSQL to SQL Converter</h2>
        <p className="text-muted-foreground mt-1">
          Convert MongoDB queries to equivalent SQL statements with AI-powered explanations
        </p>
      </div>

      {/* Quick Examples */}
      <div className="mb-6 flex flex-wrap gap-2">
        <span className="text-sm font-medium self-center">Quick Examples:</span>
        <button
          onClick={() => loadExample('find')}
          className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm hover:bg-primary/20"
        >
          Find Query
        </button>
        <button
          onClick={() => loadExample('aggregate')}
          className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm hover:bg-primary/20"
        >
          Aggregation
        </button>
        <button
          onClick={() => loadExample('insert')}
          className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm hover:bg-primary/20"
        >
          Insert
        </button>
        <button
          onClick={() => loadExample('update')}
          className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm hover:bg-primary/20"
        >
          Update
        </button>
        <button
          onClick={() => loadExample('delete')}
          className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm hover:bg-primary/20"
        >
          Delete
        </button>
        <button
          onClick={() => loadExample('lookup')}
          className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm hover:bg-primary/20"
        >
          Lookup (JOIN)
        </button>
      </div>

      {/* Main Conversion Interface */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* MongoDB Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">MongoDB Query (JSON)</label>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileCode size={14} />
              <span>MongoDB</span>
            </div>
          </div>
          <div className="border border-border rounded-md overflow-hidden">
            <Editor
              height="400px"
              defaultLanguage="json"
              value={mongoQuery}
              onChange={(value) => setMongoQuery(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on'
              }}
            />
          </div>
        </div>

        {/* SQL Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">SQL Equivalent</label>
            <button
              onClick={handleCopySQL}
              disabled={!sqlOutput}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-secondary text-white rounded-md hover:bg-secondary/90 disabled:opacity-50"
            >
              <Copy size={14} />
              Copy SQL
            </button>
          </div>
          <div className="border border-border rounded-md overflow-hidden">
            <Editor
              height="400px"
              defaultLanguage="sql"
              value={sqlOutput || '-- SQL output will appear here after conversion'}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on'
              }}
            />
          </div>
        </div>
      </div>

      {/* Convert Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleConvert}
          disabled={loading}
          className="flex items-center gap-3 px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium text-lg"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Converting...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Convert to SQL
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>

      {/* AI Explanation */}
      {explanation && (
        <div className="bg-card p-6 rounded-lg border border-border mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Info size={20} className="text-primary" />
            <h3 className="text-lg font-semibold">AI Explanation</h3>
          </div>
          <p className="text-foreground whitespace-pre-wrap">{explanation}</p>
        </div>
      )}

      {/* Important Notes */}
      {notes && notes.length > 0 && (
        <div className="bg-warning/10 border border-warning/30 p-4 rounded-lg">
          <h4 className="font-semibold text-warning mb-2">Important Notes:</h4>
          <ul className="list-disc list-inside space-y-1">
            {notes.map((note, idx) => (
              <li key={idx} className="text-sm text-foreground">{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 bg-muted/50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">How to Use</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>Enter or paste your MongoDB query in JSON format in the left panel</li>
          <li>Select a query type from the quick examples or write your own</li>
          <li>Click "Convert to SQL" to generate the equivalent SQL statement</li>
          <li>Review the SQL output and AI explanation</li>
          <li>Copy the SQL to use in your SQL database</li>
        </ol>

        <div className="mt-4 p-4 bg-background rounded-md">
          <h4 className="font-medium mb-2 text-sm">Supported MongoDB Operations:</h4>
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div>Find queries</div>
            <div>Aggregation pipelines</div>
            <div>Insert operations</div>
            <div>Update operations</div>
            <div>Delete operations</div>
            <div>$match, $group, $sort</div>
            <div>$project, $limit, $skip</div>
            <div>$lookup (JOINs)</div>
            <div>$unwind operations</div>
          </div>
        </div>
      </div>
    </div>
  );
}
