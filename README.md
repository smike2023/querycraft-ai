# QueryCraft AI: NOSQL Edition

<div align="center">

![QueryCraft AI Banner](https://img.shields.io/badge/QueryCraft-AI%20Powered-blue?style=for-the-badge)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Powered-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

**A Professional-Grade MongoDB Development Platform with AI-Powered Features**

[Live Demo](https://vjs1g2xban9t.space.minimax.io) • [Documentation](#documentation) • [Features](#features) • [Setup](#setup)

</div>

---

## 🚀 Overview

QueryCraft AI is a comprehensive, full-stack MongoDB development toolkit that combines the power of AI with professional-grade database management tools. Built for developers who work with both SQL and NoSQL databases, it provides intelligent query conversion, visual builders, and real-time analytics.

### ✨ Key Highlights

- **8 Professional Tools** for complete MongoDB workflow
- **AI-Powered** query generation and conversion (OpenAI GPT-4)
- **Bidirectional Conversion** between SQL ↔ MongoDB
- **Visual Query Builders** with Monaco Editor integration
- **Dark/Light Themes** with persistent preferences
- **Secure Authentication** with Supabase Auth
- **Real-time Analytics** and query history tracking

---

## 🛠️ Features

### 1. **Connection Manager**
- Securely store and manage multiple MongoDB connections
- AES-256 encryption for connection strings
- Test connections before saving
- Quick connection switching

### 2. **Query Builder**
- Visual MongoDB query construction
- Auto-complete and syntax highlighting
- AI-powered query suggestions
- Execute queries and view results in real-time

### 3. **Aggregation Pipeline Builder**
- Drag-and-drop pipeline stage creation
- Support for all MongoDB aggregation operators
- Visual pipeline flow
- Stage-by-stage result preview

### 4. **Template Library**
- 10+ pre-built query templates
- Create and share custom templates
- Category-based organization
- One-click template insertion

### 5. **Query History & Analytics**
- Automatic query tracking
- Performance metrics and execution times
- Search and filter history
- Re-run previous queries

### 6. **Results Explorer**
- Beautiful JSON visualization
- Export results (JSON, CSV)
- Pagination for large datasets
- Collapsible document structure

### 7. **NOSQL to SQL Converter**
- Convert MongoDB queries to SQL equivalents
- Supports find, aggregate, insert, update, delete
- AI-powered conversion explanations
- Side-by-side code comparison

### 8. **SQL to NOSQL Converter** 🆕
- Convert SQL queries to MongoDB equivalents
- **Multiple conversion strategies** (embedded, referenced, denormalized)
- **Trade-off analysis** for each approach
- **Schema design suggestions** for optimal MongoDB patterns
- Perfect for database migration planning

---

## 🏗️ Tech Stack

### Frontend
- **React 18.3** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Monaco Editor** - VSCode-powered code editor
- **Radix UI** - Accessible component primitives

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database for app data
  - Edge Functions (TypeScript/Deno) for serverless logic
  - Built-in authentication (JWT)
  - Row-Level Security (RLS) policies
  - Storage for query exports

### AI Integration
- **OpenAI GPT-4** - Natural language query generation and conversion

### Database
- **Supabase PostgreSQL** - App data (users, connections, history)
- **MongoDB** - NOSQL operations (user's databases)

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account
- OpenAI API key
- MongoDB instance (for testing connections)

### 1. Clone the Repository

```bash
git clone https://github.com/smike2023/querycraft-ai.git
cd querycraft-ai
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration (for Edge Functions)
OPENAI_API_KEY=your_openai_api_key
```

### 4. Database Setup

#### Option A: Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your_project_id

# Apply migrations
supabase db push
```

#### Option B: Manual Setup
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration files in `supabase/migrations/` in order

### 5. Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy connection-manager
supabase functions deploy query-executor
supabase functions deploy ai-query-generator
# ... deploy all 25 functions

# Set environment variables
supabase secrets set OPENAI_API_KEY=your_key_here
```

### 6. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:5173` to see the application!

### 7. Build for Production

```bash
pnpm build
```

---

## 📚 Documentation

- **[USAGE_GUIDE.md](USAGE_GUIDE.md)** - Comprehensive user guide for all 8 tools
- **[TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md)** - Developer documentation and architecture
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Project overview and technical decisions
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines

---

## 🎯 Use Cases

### For Developers
- **Learn MongoDB** - Visual tools help understand NOSQL concepts
- **Database Migration** - Convert between SQL and NOSQL with AI guidance
- **Quick Prototyping** - Test queries without writing code
- **Query Optimization** - Analyze and improve query performance

### For Teams
- **Shared Templates** - Standardize common queries across team
- **Query History** - Track and audit database operations
- **Multiple Connections** - Manage dev, staging, and production databases

### For Students
- **Interactive Learning** - Hands-on MongoDB education
- **Side-by-Side Comparison** - Understand SQL vs NOSQL differences
- **AI Explanations** - Learn best practices from AI suggestions

---

## 🔒 Security

- **AES-256 Encryption** for MongoDB connection strings
- **JWT Authentication** with Supabase Auth
- **Row-Level Security** policies on all tables
- **Environment Variables** for sensitive configuration
- **Secure Edge Functions** with authentication checks

---

## 🚢 Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
pnpm build

# Deploy
netlify deploy --prod --dir=dist
```

### Self-Hosted
Build the project and serve the `dist/` folder with any static file server.

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 API
- **Supabase** for excellent backend infrastructure
- **MongoDB** for the powerful NOSQL database
- **Radix UI** for accessible components
- **Monaco Editor** for the VSCode experience

---

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/smike2023/querycraft-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/smike2023/querycraft-ai/discussions)

---

<div align="center">

**Built with ❤️ by the QueryCraft AI Team**

[⭐ Star this repo](https://github.com/smike2023/querycraft-ai) if you find it useful!

</div>
# Environment variables updated - Fri Nov 21 06:39:46 CST 2025
# Supabase configuration updated - Fri Nov 21 06:59:23 CST 2025
