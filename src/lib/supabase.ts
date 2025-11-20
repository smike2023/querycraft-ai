import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jtbtyxhmfqtpddojjlvz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration missing. Check your environment variables.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  } catch (error) {
    return { user: null, error };
  }
};

// Database helper functions
export const insertData = async (table: string, data: any) => {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select();
    return { result, error };
  } catch (error) {
    return { result: null, error };
  }
};

export const updateData = async (table: string, id: string, data: any) => {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select();
    return { result, error };
  } catch (error) {
    return { result: null, error };
  }
};

export const deleteData = async (table: string, id: string) => {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    return { error };
  } catch (error) {
    return { error };
  }
};

export const getData = async (table: string, select = '*', filters?: Record<string, any>) => {
  try {
    let query = supabase.from(table).select(select);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    const { data, error } = await query;
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};