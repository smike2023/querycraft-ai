import { createClient } from '@supabase/supabase-js';
import type { 
  Profile, ProfileInsert, ProfileUpdate,
  MongoConnection, MongoConnectionInsert, MongoConnectionUpdate,
  SavedQuery, SavedQueryInsert, SavedQueryUpdate,
  QueryTemplate, QueryTemplateInsert, QueryTemplateUpdate
} from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Profile functions
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
};

export const createProfile = async (profile: ProfileInsert): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating profile:', error);
    return null;
  }
  return data;
};

export const updateProfile = async (userId: string, updates: ProfileUpdate): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }
  return data;
};

// Connection functions
export const getConnections = async (userId: string): Promise<MongoConnection[]> => {
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching connections:', error);
    return [];
  }
  return data || [];
};

export const saveConnection = async (connection: MongoConnectionInsert): Promise<MongoConnection | null> => {
  const { data, error } = await supabase
    .from('connections')
    .insert(connection)
    .select()
    .single();
  
  if (error) {
    console.error('Error saving connection:', error);
    return null;
  }
  return data;
};

export const updateConnection = async (connectionId: string, updates: MongoConnectionUpdate): Promise<MongoConnection | null> => {
  const { data, error } = await supabase
    .from('connections')
    .update(updates)
    .eq('id', connectionId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating connection:', error);
    return null;
  }
  return data;
};

export const deleteConnection = async (connectionId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('connections')
    .delete()
    .eq('id', connectionId);
  
  if (error) {
    console.error('Error deleting connection:', error);
    return false;
  }
  return true;
};

export const testConnection = async (connectionString: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // This is a mock implementation - in a real app you'd test the MongoDB connection
    // For now, we'll just validate the connection string format
    if (!connectionString.includes('mongodb://') && !connectionString.includes('mongodb+srv://')) {
      return { success: false, error: 'Invalid MongoDB connection string format' };
    }
    
    // Simulate a successful test
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Query functions
export const getQueries = async (userId: string): Promise<SavedQuery[]> => {
  const { data, error } = await supabase
    .from('queries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching queries:', error);
    return [];
  }
  return data || [];
};

export const saveQuery = async (query: SavedQueryInsert): Promise<SavedQuery | null> => {
  const { data, error } = await supabase
    .from('queries')
    .insert(query)
    .select()
    .single();
  
  if (error) {
    console.error('Error saving query:', error);
    return null;
  }
  return data;
};

export const updateQuery = async (queryId: string, updates: SavedQueryUpdate): Promise<SavedQuery | null> => {
  const { data, error } = await supabase
    .from('queries')
    .update(updates)
    .eq('id', queryId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating query:', error);
    return null;
  }
  return data;
};

export const deleteQuery = async (queryId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('queries')
    .delete()
    .eq('id', queryId);
  
  if (error) {
    console.error('Error deleting query:', error);
    return false;
  }
  return true;
};

// Query template functions
export const getQueryTemplates = async (userId: string, includePublic = false): Promise<QueryTemplate[]> => {
  let query = supabase
    .from('query_templates')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (includePublic) {
    query = query.or(`user_id.eq.${userId},is_public.eq.true`);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching query templates:', error);
    return [];
  }
  return data || [];
};

export const saveQueryTemplate = async (template: QueryTemplateInsert): Promise<QueryTemplate | null> => {
  const { data, error } = await supabase
    .from('query_templates')
    .insert(template)
    .select()
    .single();
  
  if (error) {
    console.error('Error saving query template:', error);
    return null;
  }
  return data;
};

export const updateQueryTemplate = async (templateId: string, updates: QueryTemplateUpdate): Promise<QueryTemplate | null> => {
  const { data, error } = await supabase
    .from('query_templates')
    .update(updates)
    .eq('id', templateId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating query template:', error);
    return null;
  }
  return data;
};

export const deleteQueryTemplate = async (templateId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('query_templates')
    .delete()
    .eq('id', templateId);
  
  if (error) {
    console.error('Error deleting query template:', error);
    return false;
  }
  return true;
};

// Query execution functions
export const executeQuery = async (connectionId: string, queryText: string): Promise<{ data: any[]; error?: string }> => {
  try {
    // This is a mock implementation - in a real app you'd execute against MongoDB
    const mockData = [
      { id: '1', name: 'Sample Document 1', value: 100 },
      { id: '2', name: 'Sample Document 2', value: 200 },
      { id: '3', name: 'Sample Document 3', value: 300 },
    ];
    
    return { data: mockData };
  } catch (error) {
    return { 
      data: [], 
      error: error instanceof Error ? error.message : 'Query execution failed' 
    };
  }
};

export const executeAggregation = async (connectionId: string, pipeline: any): Promise<{ data: any[]; error?: string }> => {
  try {
    // This is a mock implementation - in a real app you'd execute aggregation against MongoDB
    const mockData = [
      { stage: 'match', count: 150 },
      { stage: 'group', count: 120 },
      { stage: 'sort', count: 100 },
    ];
    
    return { data: mockData };
  } catch (error) {
    return { 
      data: [], 
      error: error instanceof Error ? error.message : 'Aggregation execution failed' 
    };
  }
};