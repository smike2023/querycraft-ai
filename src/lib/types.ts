// Types for QueryCraft AI application

export interface ConnectionConfig {
  host: string;
  port: number;
  database: string;
  username?: string;
  password?: string;
  uri?: string;
}

export interface QueryResult {
  data: any[];
  executionTime: number;
  rowCount: number;
  columns: string[];
}

export interface QueryHistory {
  id: string;
  query: string;
  result?: QueryResult;
  timestamp: Date;
  executionTime?: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'aggregation' | 'projection' | 'join' | 'filter' | 'custom';
  query: string;
  parameters?: Record<string, any>;
}

export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export type QueryType = 'find' | 'aggregate' | 'insert' | 'update' | 'delete';

export interface QueryBuilderState {
  queryType: QueryType;
  collection: string;
  filter: Record<string, any>;
  projection: Record<string, any>;
  sort: Record<string, number>;
  limit: number;
  skip: number;
}