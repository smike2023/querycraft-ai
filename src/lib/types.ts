import { Database } from './database.types';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      connections: {
        Row: {
          id: string
          user_id: string
          name: string
          connection_string: string
          database_name: string
          status: string
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          connection_string: string
          database_name: string
          status?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          connection_string?: string
          database_name?: string
          status?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      queries: {
        Row: {
          id: string
          user_id: string
          name: string
          connection_id: string
          query_type: string
          query_text: string
          parameters: Json | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          connection_id: string
          query_type: string
          query_text: string
          parameters?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          connection_id?: string
          query_type?: string
          query_text?: string
          parameters?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      query_templates: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          query_type: string
          template_text: string
          parameters: Json | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description: string
          query_type: string
          template_text: string
          parameters?: Json | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          query_type?: string
          template_text?: string
          parameters?: Json | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type MongoConnection = Database['public']['Tables']['connections']['Row']
export type MongoConnectionInsert = Database['public']['Tables']['connections']['Insert']
export type MongoConnectionUpdate = Database['public']['Tables']['connections']['Update']

export type SavedQuery = Database['public']['Tables']['queries']['Row']
export type SavedQueryInsert = Database['public']['Tables']['queries']['Insert']
export type SavedQueryUpdate = Database['public']['Tables']['queries']['Update']

export type QueryTemplate = Database['public']['Tables']['query_templates']['Row']
export type QueryTemplateInsert = Database['public']['Tables']['query_templates']['Insert']
export type QueryTemplateUpdate = Database['public']['Tables']['query_templates']['Update']

export interface AggregationPipeline {
  stages: Array<{
    stage: string
    config: any
  }>
}

export interface QueryHistoryEntry {
  id: string
  query: string
  executionTime: number
  resultCount: number
  timestamp: string
}

export interface ConnectionConfig {
  host: string
  port: number
  username?: string
  password?: string
  database: string
  ssl?: boolean
}

export interface QueryResult {
  data: any[]
  metadata: {
    executionTime: number
    resultCount: number
    fields: string[]
  }
}

export interface NoSQLQuery {
  find?: {
    collection: string
    filter?: Record<string, any>
    projection?: Record<string, any>
    sort?: Record<string, number>
    limit?: number
  }
  aggregate?: {
    collection: string
    pipeline: AggregationPipeline
  }
}

export interface SQLQuery {
  query: string
  params?: Record<string, any>
}