# QueryCraft AI: NOSQL Edition - Usage Guide

## Live Application
**URL**: https://43svzzk1c7u7.space.minimax.io

## What is QueryCraft AI?

QueryCraft AI is a professional-grade MongoDB development platform designed for developers, data analysts, and database administrators. It provides a comprehensive suite of tools for MongoDB database management, query development, and performance analytics, all powered by AI assistance.

## Key Features

### 1. Connection Manager
Securely manage multiple MongoDB connections with:
- Connection testing before saving
- Encrypted connection string storage
- Color-coded and tagged connections
- Support for MongoDB Atlas, self-hosted MongoDB, and DocumentDB

### 2. MongoDB Query Builder
Visual interface for building find() queries:
- Filter builder with JSON syntax highlighting
- Field projection selector
- Sort configuration
- Pagination controls (limit/skip)
- AI-powered query suggestions from natural language
- Real-time query execution with performance metrics
- Automatic query history tracking

### 3. Aggregation Pipeline Builder
Build complex aggregation pipelines:
- Monaco Editor for pipeline authoring
- Stage-by-stage pipeline construction
- AI-powered pipeline optimization suggestions
- Execution time tracking
- Support for all MongoDB aggregation operators

### 4. Template Library
Pre-built query templates for common use cases:
- 10 curated templates across categories:
  - Analytics & Reporting
  - Data Cleaning
  - E-commerce
  - Log Analysis
  - Performance Tuning
- Search and filter by category/difficulty
- One-click template deployment

### 5. Query History & Analytics
Track and analyze query performance:
- Complete query execution history
- Performance metrics dashboard
  - Total queries executed
  - Success rate percentage
  - Average execution time
  - Slow query identification
- Filter by success/failure status
- Export history to CSV/JSON

### 6. Query Results Explorer
Advanced result viewing and export:
- Tabular view with sortable columns
- JSON tree view with syntax highlighting
- Export to JSON, CSV formats
- Result statistics and metadata
- Search and filter capabilities

## Getting Started

### Step 1: Create an Account
1. Visit https://43svzzk1c7u7.space.minimax.io
2. Click "Sign Up" on the authentication page
3. Enter your email and password (min 6 characters)
4. Verify your email (check your inbox)
5. Sign in with your credentials

**Test Account** (for evaluation):
- Email: lylyuneq@minimax.com
- Password: pjAetf849D

### Step 2: Set Up MongoDB Connection

#### Option A: MongoDB Atlas (Recommended)
1. Go to mongodb.com/cloud/atlas
2. Create a free cluster (512MB free tier)
3. Create a database user:
   - Username: e.g., `querycraft`
   - Password: Strong password
4. Whitelist IP addresses:
   - Click "Network Access"
   - Add "0.0.0.0/0" (or specific IPs)
5. Get connection string:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

**Example Connection String**:
```
mongodb+srv://querycraft:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

#### Option B: Self-Hosted MongoDB
```
mongodb://username:password@localhost:27017/
```

#### Option C: AWS DocumentDB
```
mongodb://username:password@docdb-cluster.us-east-1.docdb.amazonaws.com:27017/?tls=true&replicaSet=rs0&readPreference=secondaryPreferred
```

### Step 3: Add Connection in QueryCraft AI
1. Navigate to "Connection Manager" (first tool in sidebar)
2. Click "Add Connection"
3. Fill in the form:
   - **Connection Name**: e.g., "Production MongoDB"
   - **Connection String**: Paste your MongoDB connection string
   - **Database Name**: (optional) Default database name
   - **Tags**: e.g., "production, analytics"
   - **Color**: Choose a color for visual identification
4. Click "Test Connection" to verify
5. Click "Save Connection"

### Step 4: Explore Tools

#### Query Builder
1. Select connection, database, and collection
2. Build your query using JSON syntax:
   - **Filter**: `{"status": "active"}`
   - **Projection**: `{"name": 1, "email": 1}`
   - **Sort**: `{"created_at": -1}`
   - **Limit**: `100`
3. Click "Execute Query"
4. View results in the results panel
5. Use "AI Suggest" for natural language queries

#### Aggregation Builder
1. Select connection, database, and collection
2. Write your aggregation pipeline as JSON array:
```json
[
  {"$match": {"status": "active"}},
  {"$group": {"_id": "$category", "count": {"$sum": 1}}},
  {"$sort": {"count": -1}}
]
```
3. Click "Execute Pipeline"
4. View results with stage information

#### Template Library
1. Browse available templates
2. Filter by category (Analytics, Reporting, etc.)
3. Filter by difficulty (Beginner, Intermediate, Advanced)
4. Click "Use Template" to deploy to Query/Aggregation Builder
5. Customize template parameters for your use case

## AI-Powered Features

### Natural Language to MongoDB Query
The AI assistant can convert plain English to MongoDB queries:

**Example Prompts**:
- "Find all users who registered in the last 30 days"
- "Get the top 10 products by sales count"
- "Show me users with email ending in @gmail.com"
- "Count documents by status and sort by count"

**How to Use**:
1. Click "AI Suggest" button
2. Enter your natural language description
3. AI generates the query automatically
4. Review and execute the generated query

## Query Performance Best Practices

1. **Use Indexes**: Ensure your queries use indexed fields
2. **Limit Results**: Always use `.limit()` for large collections
3. **Projection**: Only fetch fields you need
4. **Aggregation Optimization**: Order stages for efficiency
   - Put `$match` early to reduce documents
   - Use `$project` to reduce field size
5. **Monitor Slow Queries**: Check Query History for queries >1000ms

## Security Features

- **Encrypted Connection Strings**: All MongoDB connection strings are encrypted before storage
- **Row-Level Security (RLS)**: Your queries and connections are only visible to you
- **JWT Authentication**: Secure session management with Supabase Auth
- **No Plaintext Storage**: Credentials never stored in plaintext

## Troubleshooting

### Connection Issues
**Error**: "Connection failed"
- Verify connection string format
- Check database credentials
- Ensure IP whitelist includes your IP (MongoDB Atlas)
- Test network connectivity

### Query Execution Failures
**Error**: "Query execution failed"
- Verify collection exists
- Check query syntax (valid JSON)
- Ensure sufficient permissions
- Review error message in Query History

### AI Suggestions Not Working
- Verify OpenAI API key is configured (backend)
- Check natural language prompt clarity
- Review generated query before execution

## Data Export

### Export Query Results
1. Execute query in Query Builder or Aggregation Builder
2. Navigate to Results Explorer
3. Click "JSON" to download as JSON file
4. Click "CSV" to download as CSV file

### Export Query History
1. Go to Query History
2. All history is automatically tracked
3. Use filters to narrow down results
4. Export programmatically via API (future feature)

## Keyboard Shortcuts

- **Ctrl/Cmd + Enter**: Execute query (in editor)
- **Ctrl/Cmd + S**: Save query (when available)
- **Ctrl/Cmd + K**: Toggle sidebar
- **Esc**: Close modals/dialogs

## Support & Feedback

For questions, issues, or feature requests:
- **Technical Issues**: Check console for error messages
- **MongoDB Help**: docs.mongodb.com
- **Query Syntax**: mongodb.com/docs/manual/tutorial/query-documents/

## Tips for Success

1. **Start with Templates**: Use pre-built templates as learning resources
2. **Monitor Performance**: Regularly check Query History analytics
3. **Use AI Wisely**: AI suggestions are starting points, always review
4. **Organize Connections**: Use tags and colors for easy identification
5. **Test Queries**: Start with small limits, then scale up

## Advanced Use Cases

### Data Migration
1. Use Template: "Export All Active Users"
2. Modify projection for needed fields
3. Execute and export results
4. Import to target database

### Performance Analysis
1. Execute queries during peak hours
2. Check Query History analytics
3. Identify slow queries (>1000ms)
4. Optimize using indexes and query restructuring

### Reporting
1. Build aggregation for metrics
2. Execute daily/weekly
3. Export results to CSV
4. Import to BI tools (Tableau, Power BI)

## Limitations (MVP Version)

- **MongoDB Only**: Currently supports MongoDB/DocumentDB only
- **Read Operations**: Write operations (insert/update/delete) coming soon
- **Single User**: Multi-user collaboration features in development
- **Chart Visualization**: Coming in next version

## Roadmap

**Coming Soon**:
- Real-time query execution monitoring
- Collaborative query sharing
- Visual query builder (drag-and-drop)
- Advanced data visualization with charts
- MongoDB Atlas integration for cluster management
- Scheduled query execution
- Webhook notifications for query completion

---

**Enjoy building with QueryCraft AI!** 🚀
