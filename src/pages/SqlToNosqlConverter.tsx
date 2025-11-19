import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Sparkles, Copy, Info, FileCode, ArrowRight, Database } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface MongoDBApproach {
  title: string;
  code: string;
  pros: string[];
  cons: string[];
  use_case: string;
}

interface ConversionData {
  primary_mongodb: string;
  approaches: MongoDBApproach[];
  explanation: string;
  notes: string[];
  schema_suggestions?: string;
}

export default function SqlToNosqlConverter() {
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryType, setQueryType] = useState('select');
  const [mongodbCode, setMongodbCode] = useState('');
  const [approaches, setApproaches] = useState<MongoDBApproach[]>([]);
  const [explanation, setExplanation] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [schemaSuggestions, setSchemaSuggestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedApproach, setSelectedApproach] = useState<number | null>(null);

  // Quick example SQL queries
  const examples: Record<string, string> = {
    select: `-- Simple SELECT with WHERE clause
SELECT * FROM users 
WHERE age > 25 AND status = 'active'
ORDER BY created_at DESC
LIMIT 10;`,
    
    join: `-- JOIN query with multiple tables
SELECT 
  orders.id,
  orders.total,
  customers.name,
  customers.email
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id
WHERE orders.status = 'completed'
ORDER BY orders.created_at DESC;`,
    
    aggregate: `-- GROUP BY with aggregation
SELECT 
  category,
  COUNT(*) as product_count,
  AVG(price) as avg_price,
  MAX(price) as max_price
FROM products
WHERE status = 'active'
GROUP BY category
HAVING COUNT(*) > 5
ORDER BY product_count DESC;`,
    
    insert: `-- INSERT statement
INSERT INTO users (name, email, age, status, created_at)
VALUES ('John Doe', 'john@example.com', 30, 'active', NOW());`,
    
    update: `-- UPDATE with conditions
UPDATE products
SET 
  price = price * 1.1,
  updated_at = NOW()
WHERE category = 'electronics' 
  AND stock > 0;`,
    
    delete: `-- DELETE with conditions
DELETE FROM orders
WHERE status = 'cancelled'
  AND created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);`,
    
    complex_join: `-- Complex JOIN with subquery
SELECT 
  u.name,
  u.email,
  COUNT(o.id) as total_orders,
  SUM(o.total) as total_spent,
  AVG(o.total) as avg_order_value
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 3
ORDER BY total_spent DESC;`
  };

  const convertToMongoDB = async () => {
    if (!sqlQuery.trim()) {
      toast.error('Please enter a SQL query');
      return;
    }

    setLoading(true);
    setMongodbCode('');
    setExplanation('');
    setApproaches([]);
    setNotes([]);
    setSchemaSuggestions('');
    setSelectedApproach(null);

    try {
      const { data, error } = await supabase.functions.invoke('sql-to-nosql-converter', {
        body: {
          sql_query: sqlQuery,
          query_type: queryType
        }
      });

      if (error) throw error;

      if (data?.data) {
        const conversionData: ConversionData = data.data;
        setMongodbCode(conversionData.primary_mongodb);
        setExplanation(conversionData.explanation);
        setApproaches(conversionData.approaches || []);
        setNotes(conversionData.notes || []);
        setSchemaSuggestions(conversionData.schema_suggestions || '');
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const loadExample = (type: string) => {
    setQueryType(type);
    setSqlQuery(examples[type]);
    setMongodbCode('');
    setExplanation('');
    setApproaches([]);
    setNotes([]);
    setSchemaSuggestions('');
    setSelectedApproach(null);
  };

  const selectApproach = (index: number) => {
    setSelectedApproach(index);
    setMongodbCode(approaches[index].code);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold">SQL to NOSQL Converter</h2>
        <p className="text-muted-foreground mt-1">
          Convert SQL queries to MongoDB equivalents with AI-powered multiple approach suggestions
        </p>
      </div>

      {/* Quick Examples */}
      <div className="mb-6 flex flex-wrap gap-2">
        <span className="text-sm font-medium self-center">Quick Examples:</span>
        <button
          onClick={() => loadExample('select')}
          className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm hover:bg-primary/20"
        >
          SELECT Query
        </button>
        <button
          onClick={() => loadExample('join')}
          className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm hover:bg-primary/20"
        >
          JOIN Query
        </button>
        <button
          onClick={() => loadExample('aggregate')}
          className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm hover:bg-primary/20"
        >
          GROUP BY / Aggregation
        </button>
        <button
          onClick={() => loadExample('insert')}
          className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm hover:bg-primary/20"
        >
          INSERT
        </button>
        <button
          onClick={() => loadExample('update')}
          className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm hover:bg-primary/20"
        >
          UPDATE
        </button>
        <button
          onClick={() => loadExample('delete')}
          className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm hover:bg-primary/20"
        >
          DELETE
        </button>
        <button
          onClick={() => loadExample('complex_join')}
          className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm hover:bg-primary/20"
        >
          Complex JOIN
        </button>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* SQL Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">SQL Query</label>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Database size={14} />
              <span>SQL</span>
            </div>
          </div>
          <div className="border border-border rounded-md overflow-hidden">
            <Editor
              height="450px"
              defaultLanguage="sql"
              value={sqlQuery}
              onChange={(value) => setSqlQuery(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
          </div>
        </div>

        {/* MongoDB Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">MongoDB Equivalent</label>
            <button
              onClick={() => copyToClipboard(mongodbCode)}
              disabled={!mongodbCode}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-secondary text-white rounded-md hover:bg-secondary/90 disabled:opacity-50"
            >
              <Copy size={14} />
              Copy MongoDB
            </button>
          </div>
          <div className="border border-border rounded-md overflow-hidden">
            <Editor
              height="450px"
              defaultLanguage="javascript"
              value={mongodbCode || '// MongoDB code will appear here after conversion'}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
          </div>
        </div>
      </div>

      {/* Convert Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={convertToMongoDB}
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
              Convert to MongoDB
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>

      {/* Multiple Approaches Section */}
      {approaches.length > 0 && (
        <div className="bg-card p-6 rounded-lg border border-border mb-4">
          <h3 className="text-lg font-semibold mb-4">Multiple Conversion Approaches</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose the approach that best fits your use case. Click to view the code.
          </p>
          <div className="grid gap-4">
            {approaches.map((approach, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedApproach === index
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => selectApproach(index)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-md">{approach.title}</h4>
                  {selectedApproach === index && (
                    <span className="text-xs bg-primary text-white px-2 py-1 rounded">
                      Selected
                    </span>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
                      Pros:
                    </p>
                    <ul className="text-xs space-y-1">
                      {approach.pros.map((pro, i) => (
                        <li key={i} className="text-muted-foreground">+ {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">
                      Cons:
                    </p>
                    <ul className="text-xs space-y-1">
                      {approach.cons.map((con, i) => (
                        <li key={i} className="text-muted-foreground">- {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs font-medium mb-1">When to use:</p>
                  <p className="text-xs text-muted-foreground">{approach.use_case}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* Schema Suggestions */}
      {schemaSuggestions && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Schema Design Suggestions
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-400 whitespace-pre-wrap">
            {schemaSuggestions}
          </p>
        </div>
      )}

      {/* Important Notes */}
      {notes.length > 0 && (
        <div className="bg-warning/10 border border-warning/30 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-warning mb-2">Important Considerations:</h4>
          <ul className="list-disc list-inside space-y-1">
            {notes.map((note, index) => (
              <li key={index} className="text-sm text-foreground">
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Usage Guide */}
      <div className="mt-8 bg-muted/50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">How to Use</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>Enter or paste your SQL query in the left panel</li>
          <li>Select a query type from quick examples or write your own</li>
          <li>Click "Convert to MongoDB" to generate equivalent MongoDB code</li>
          <li>Review multiple approaches (when available) and select the best fit</li>
          <li>Read the AI explanation and trade-off analysis</li>
          <li>Consider schema design suggestions for optimal MongoDB structure</li>
          <li>Copy the MongoDB code to use in your application</li>
        </ol>

        <div className="mt-4 p-4 bg-background rounded-md">
          <h4 className="font-medium mb-2 text-sm">Key Conversion Patterns:</h4>
          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-1">SQL Patterns:</p>
              <ul className="space-y-1">
                <li>SELECT → find() or aggregate()</li>
                <li>WHERE → query filters</li>
                <li>JOIN → $lookup or embedded docs</li>
                <li>GROUP BY → $group pipeline</li>
                <li>ORDER BY → sort()</li>
                <li>LIMIT → limit()</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">MongoDB Approaches:</p>
              <ul className="space-y-1">
                <li>Embedded Documents (denormalized)</li>
                <li>Referenced Collections ($lookup)</li>
                <li>Aggregation Pipelines</li>
                <li>Incremental Updates</li>
                <li>Application-level Joins</li>
                <li>Hybrid Strategies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
