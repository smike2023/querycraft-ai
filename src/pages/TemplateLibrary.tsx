import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { QueryTemplate } from '../lib/types';
import toast from 'react-hot-toast';
import { Download, Search, Filter } from 'lucide-react';

export default function TemplateLibrary() {
  const [templates, setTemplates] = useState<QueryTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<QueryTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, search, categoryFilter, difficultyFilter]);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-templates');
      if (error) throw error;
      setTemplates(data?.data || []);
    } catch (error: any) {
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (search) {
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((t) => t.category === categoryFilter);
    }

    if (difficultyFilter) {
      filtered = filtered.filter((t) => t.difficulty === difficultyFilter);
    }

    setFilteredTemplates(filtered);
  };

  const useTemplate = async (template: QueryTemplate) => {
    try {
      const { data, error } = await supabase.functions.invoke('use-template', {
        body: { template_id: template.id },
      });
      if (error) throw error;
      toast.success('Template deployed! Check Query Builder or Aggregation Builder.');
    } catch (error: any) {
      toast.error('Failed to use template');
    }
  };

  if (loading) {
    return <div className="text-center py-12"><div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Template Library</h2>
        <p className="text-muted-foreground mt-1">Pre-built query templates for common use cases</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 rounded-md border border-input bg-background"
        >
          <option value="">All Categories</option>
          <option value="analytics">Analytics</option>
          <option value="reporting">Reporting</option>
          <option value="data_cleaning">Data Cleaning</option>
          <option value="migration">Migration</option>
          <option value="performance">Performance</option>
          <option value="ecommerce">E-commerce</option>
          <option value="logs">Logs</option>
        </select>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="px-4 py-2 rounded-md border border-input bg-background"
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">{template.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md capitalize">
                {template.category}
              </span>
              <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-md capitalize">
                {template.difficulty}
              </span>
            </div>

            {template.tags && template.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-accent text-xs rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
              <span>{template.downloads} downloads</span>
              <span>{template.rating.toFixed(1)} / 5.0</span>
            </div>

            <button
              onClick={() => useTemplate(template)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              <Download size={16} />
              Use Template
            </button>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No templates found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
