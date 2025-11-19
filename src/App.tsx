import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './lib/AuthContext';
import AuthPage from './pages/AuthPage';
import { Database, Layers, FileText, History, BarChart3, Search, Menu, X, Sun, Moon, LogOut, Settings, ArrowRightLeft, ArrowLeftRight } from 'lucide-react';
import ConnectionManager from './pages/ConnectionManager';
import QueryBuilder from './pages/QueryBuilder';
import AggregationBuilder from './pages/AggregationBuilder';
import TemplateLibrary from './pages/TemplateLibrary';
import QueryHistory from './pages/QueryHistory';
import ResultsExplorer from './pages/ResultsExplorer';
import NosqlToSqlConverter from './pages/NosqlToSqlConverter';
import SqlToNosqlConverter from './pages/SqlToNosqlConverter';

function AppContent() {
  const { user, profile, signOut, loading } = useAuth();
  const [currentTool, setCurrentTool] = useState('connections');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (profile?.preferences?.theme) {
      setTheme(profile.preferences.theme);
    }
  }, [profile]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const tools = [
    { id: 'connections', name: 'Connection Manager', icon: Database },
    { id: 'query', name: 'Query Builder', icon: Search },
    { id: 'aggregation', name: 'Aggregation Pipeline', icon: Layers },
    { id: 'templates', name: 'Template Library', icon: FileText },
    { id: 'history', name: 'Query History', icon: History },
    { id: 'results', name: 'Results Explorer', icon: BarChart3 },
    { id: 'converter', name: 'NOSQL to SQL Converter', icon: ArrowRightLeft },
    { id: 'sql-converter', name: 'SQL to NOSQL Converter', icon: ArrowLeftRight },
  ];

  const renderTool = () => {
    switch (currentTool) {
      case 'connections':
        return <ConnectionManager />;
      case 'query':
        return <QueryBuilder />;
      case 'aggregation':
        return <AggregationBuilder />;
      case 'templates':
        return <TemplateLibrary />;
      case 'history':
        return <QueryHistory />;
      case 'results':
        return <ResultsExplorer />;
      case 'converter':
        return <NosqlToSqlConverter />;
      case 'sql-converter':
        return <SqlToNosqlConverter />;
      default:
        return <ConnectionManager />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-accent rounded-md">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-bold text-primary">QueryCraft AI</h1>
            <span className="text-xs text-muted-foreground">NOSQL Edition</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-accent rounded-md"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="px-3 py-1.5 bg-accent rounded-md text-sm">
              {profile?.email || user.email}
            </div>
            <button onClick={signOut} className="p-2 hover:bg-accent rounded-md text-error">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 border-r border-border bg-card h-[calc(100vh-57px)] sticky top-[57px]">
            <nav className="p-4 space-y-1">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setCurrentTool(tool.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                      currentTool === tool.id
                        ? 'bg-primary text-white'
                        : 'hover:bg-accent text-foreground'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tool.name}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderTool()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
