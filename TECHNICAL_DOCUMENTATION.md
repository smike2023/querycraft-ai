# QueryCraft AI - Technical Documentation

## Architecture Overview

### Technology Stack

**Frontend**:
- React 18.3 with TypeScript
- Vite 6.0 (build tool)
- Tailwind CSS 3.4 (styling)
- Monaco Editor (code editing)
- Lucide React (icons)
- React Hot Toast (notifications)
- Supabase JS Client (API integration)

**Backend**:
- Supabase Edge Functions (Deno runtime)
- Supabase PostgreSQL (application data)
- Supabase Auth (JWT authentication)
- Supabase Storage (file exports)
- MongoDB Driver (npm:mongodb@6.3)
- OpenAI API (AI query suggestions)

**External Services**:
- MongoDB Atlas (user databases - managed by users)
- OpenAI GPT-4 (query generation)

## Database Schema (Supabase PostgreSQL)

### profiles
```sql
- id: uuid (primary key, references auth.users)
- email: text (unique, not null)
- username: text (unique)
- first_name: text
- last_name: text
- avatar_url: text
- role: text (free|premium|enterprise|admin)
- preferences: jsonb (theme, default_database, auto_save, query_timeout)
- created_at: timestamptz
- updated_at: timestamptz
```

### mongo_connections
```sql
- id: uuid (primary key)
- user_id: uuid (references profiles)
- name: text (not null)
- connection_string: text (encrypted, not null)
- database_type: text (default: 'mongodb')
- host: text
- port: integer
- database_name: text
- connection_status: text (connected|disconnected|error)
- last_connected: timestamptz
- tags: text[]
- color: text
- created_at: timestamptz
- updated_at: timestamptz
```

### queries
```sql
- id: uuid (primary key)
- user_id: uuid (references profiles)
- connection_id: uuid (references mongo_connections)
- collection_name: text
- title: text (not null)
- description: text
- query_type: text (find|aggregate|update|insert|delete)
- query_data: jsonb
- aggregation_pipeline: jsonb
- tags: text[]
- favorite: boolean (default: false)
- is_template: boolean (default: false)
- last_executed: timestamptz
- created_at: timestamptz
- updated_at: timestamptz
```

### query_templates
```sql
- id: uuid (primary key)
- creator_id: uuid (references profiles)
- title: text (not null)
- description: text
- category: text (analytics|reporting|data_cleaning|migration|performance|...)
- difficulty: text (beginner|intermediate|advanced|expert)
- query_template: jsonb
- aggregation_template: jsonb
- tags: text[]
- downloads: integer (default: 0)
- rating: numeric(3,2) (0-5)
- is_public: boolean (default: false)
- created_at: timestamptz
```

### query_history
```sql
- id: uuid (primary key)
- user_id: uuid (references profiles)
- query_id: uuid (references queries)
- connection_id: uuid (references mongo_connections)
- collection_name: text
- query_text: text
- execution_date: timestamptz (default: now())
- execution_time_ms: integer
- documents_returned: integer
- documents_scanned: integer
- success: boolean (default: true)
- error_message: text
```

## Row-Level Security (RLS) Policies

All tables have RLS enabled with user-based access control:

**Pattern**:
```sql
-- SELECT: Users can view own records
CREATE POLICY "policy_name" ON table_name
  FOR SELECT USING (auth.uid() = user_id);

-- INSERT: Users can create own records
CREATE POLICY "policy_name" ON table_name
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update own records
CREATE POLICY "policy_name" ON table_name
  FOR UPDATE USING (auth.uid() = user_id);

-- DELETE: Users can delete own records
CREATE POLICY "policy_name" ON table_name
  FOR DELETE USING (auth.uid() = user_id);
```

**Special Case** (query_templates):
```sql
-- Public templates viewable by everyone
CREATE POLICY "Public templates viewable" ON query_templates
  FOR SELECT USING (is_public = true OR auth.uid() = creator_id);
```

## Edge Functions (23 Functions)

### Authentication & Profile
1. **get-profile**: Fetch user profile from Supabase
2. **update-profile**: Update user profile fields
3. **update-preferences**: Update user preferences (theme, settings)

### Connection Management
4. **add-connection**: Create new MongoDB connection (encrypts connection string)
5. **test-connection**: Verify MongoDB connection validity
6. **list-connections**: Get all user connections
7. **get-connection**: Get single connection details
8. **update-connection**: Modify connection properties
9. **delete-connection**: Remove connection
10. **list-databases**: List databases from MongoDB connection
11. **list-collections**: List collections from database

### Query Execution
12. **execute-query**: Execute MongoDB find() query
13. **execute-aggregation**: Execute aggregation pipeline
14. **save-query**: Save query to database
15. **get-queries**: Retrieve user's saved queries
16. **delete-query**: Delete saved query
17. **get-ai-suggestion**: Generate query from natural language (OpenAI)

### Templates
18. **get-templates**: List public query templates
19. **get-template**: Get single template details
20. **use-template**: Deploy template to query builder

### History & Analytics
21. **save-history**: Record query execution to history
22. **get-history**: Retrieve query execution history
23. **get-analytics**: Calculate performance analytics

## Edge Function Implementation Details

### Standard Structure
```typescript
Deno.serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  };

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Get auth token
    const authHeader = req.headers.get('authorization');
    const token = authHeader.replace('Bearer ', '');

    // Verify user
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': serviceRoleKey
      }
    });

    const userData = await userResponse.json();

    // Business logic here

    return new Response(JSON.stringify({ data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: { message: error.message } }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
```

### MongoDB Integration
```typescript
import { MongoClient } from "npm:mongodb@6.3";

// Connection
const client = new MongoClient(connectionString, {
  serverSelectionTimeoutMS: 10000,
});

await client.connect();
const db = client.db(databaseName);
const collection = db.collection(collectionName);

// Execute query
const results = await collection.find(filter).toArray();

await client.close();
```

### OpenAI Integration
```typescript
import OpenAI from "npm:openai@4.28";

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') });

const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ],
  temperature: 0.3,
});

const suggestion = completion.choices[0]?.message?.content;
```

## Frontend Architecture

### Component Structure
```
src/
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── types.ts            # TypeScript interfaces
│   └── AuthContext.tsx     # Authentication context
├── components/             # Reusable components
├── pages/
│   ├── AuthPage.tsx        # Login/signup
│   ├── ConnectionManager.tsx
│   ├── QueryBuilder.tsx
│   ├── AggregationBuilder.tsx
│   ├── TemplateLibrary.tsx
│   ├── QueryHistory.tsx
│   └── ResultsExplorer.tsx
├── App.tsx                 # Main application
└── index.css               # Global styles
```

### State Management
- **Authentication**: React Context (`AuthContext`)
- **Local State**: React useState for component state
- **Server State**: Direct Supabase function invocation (no caching layer)

### Routing
Single Page Application (SPA) with client-side routing:
- No URL changes for tool navigation
- State-based view rendering
- Deep linking not implemented (MVP scope)

## API Integration

### Supabase Function Invocation
```typescript
import { supabase } from '../lib/supabase';

const { data, error } = await supabase.functions.invoke('function-name', {
  body: { param1: 'value1', param2: 'value2' }
});

if (error) {
  // Handle error
}

// Use data.data (wrapped response)
const result = data?.data;
```

### Error Handling
```typescript
try {
  const { data, error } = await supabase.functions.invoke('execute-query', {
    body: queryParams
  });

  if (error) throw error;

  // Success path
  setResults(data.data);
  toast.success('Query executed successfully');
} catch (error: any) {
  // Error path
  toast.error(error.message || 'Operation failed');
  console.error('Error:', error);
}
```

## Security Considerations

### Connection String Encryption
```typescript
// Encryption (simple base64 for MVP)
const encrypted = btoa(connectionString);

// Decryption
const decrypted = atob(encrypted);

// Production: Use proper encryption (AES-256, crypto-js)
```

### RLS Enforcement
- All Supabase table operations are protected by RLS
- Edge functions use service_role key but RLS still checks original caller
- No direct database access from frontend

### Authentication Flow
1. User signs in via Supabase Auth
2. JWT token issued
3. Token included in all API requests
4. Edge functions verify token
5. RLS policies enforce user isolation

## Performance Optimizations

### Query Execution
- Timeout protection (default: 10s)
- Result limit enforcement (default: 100 docs)
- Connection pooling in Edge Functions
- Execution time tracking

### Frontend
- Code splitting (Vite lazy loading)
- Monaco Editor async loading
- Debounced search/filter operations
- Optimistic UI updates where applicable

## Deployment

### Build Process
```bash
cd querycraft-ai
pnpm install
pnpm run build
```

### Deployment Target
- Platform: Vercel/Netlify compatible (static build)
- Output: `dist/` directory
- Environment: Production-optimized bundle

### Environment Variables (Edge Functions)
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
OPENAI_API_KEY=sk-xxx
```

## Monitoring & Debugging

### Error Tracking
- Frontend: Browser console + toast notifications
- Backend: Edge function logs (Supabase dashboard)
- Database: Supabase logs

### Performance Monitoring
- Query execution time (tracked in query_history)
- Analytics dashboard (Query History tool)
- Slow query identification (>1000ms)

## Testing

### Manual Testing Checklist
- [ ] Authentication (sign up, sign in, sign out)
- [ ] Connection management (add, test, delete)
- [ ] Query execution (find queries)
- [ ] Aggregation execution
- [ ] Template deployment
- [ ] AI query generation
- [ ] History tracking
- [ ] Theme toggle
- [ ] Responsive design

### Edge Function Testing
Use Supabase CLI or curl:
```bash
curl -X POST https://xxx.supabase.co/functions/v1/test-connection \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"connection_string": "mongodb+srv://..."}'
```

## Future Enhancements

### Technical Debt
- [ ] Implement proper encryption for connection strings (AES-256)
- [ ] Add query result caching
- [ ] Implement pagination for large result sets
- [ ] Add WebSocket support for real-time updates

### Feature Additions
- [ ] Visual query builder (drag-and-drop)
- [ ] Query collaboration (share queries)
- [ ] Scheduled query execution
- [ ] Data visualization (charts)
- [ ] Export to multiple formats (Excel, PDF)
- [ ] MongoDB Atlas integration

## Troubleshooting Guide

### Common Issues

**Issue**: Edge function timeout
- **Cause**: Query taking >10s
- **Solution**: Optimize query, add indexes, reduce result set

**Issue**: Connection failed
- **Cause**: Invalid connection string, network issues, IP whitelist
- **Solution**: Verify credentials, check network, update IP whitelist

**Issue**: AI suggestion not working
- **Cause**: OpenAI API key missing/invalid
- **Solution**: Check environment variable configuration

**Issue**: RLS policy violation
- **Cause**: Attempting to access other user's data
- **Solution**: Verify authentication token, check RLS policies

## Support Resources

- **MongoDB Docs**: https://docs.mongodb.com
- **Supabase Docs**: https://supabase.com/docs
- **OpenAI API**: https://platform.openai.com/docs
- **Deno Manual**: https://deno.land/manual

---

**Built with excellence** 🚀
