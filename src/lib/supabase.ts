import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      environments: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      test_types: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      environment_reservations: {
        Row: {
          id: string;
          environment_id: string;
          user_id: string;
          environment_name: string;
          start_date: string;
          end_date: string;
          sbcli_branch: string | null;
          sbcli_commit: string | null;
          ultra_branch: string | null;
          ultra_commit: string | null;
          status: 'empty' | 'deployed' | 'running' | 'completed';
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          environment_id: string;
          user_id: string;
          environment_name: string;
          start_date: string;
          end_date: string;
          sbcli_branch?: string | null;
          sbcli_commit?: string | null;
          ultra_branch?: string | null;
          ultra_commit?: string | null;
          status?: 'empty' | 'deployed' | 'running' | 'completed';
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          environment_id?: string;
          user_id?: string;
          environment_name?: string;
          start_date?: string;
          end_date?: string;
          sbcli_branch?: string | null;
          sbcli_commit?: string | null;
          ultra_branch?: string | null;
          ultra_commit?: string | null;
          status?: 'empty' | 'deployed' | 'running' | 'completed';
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      test_runs: {
        Row: {
          id: string;
          test_type_id: string;
          environment_id: string;
          jira_ticket: string | null;
          status: 'started' | 'completed' | 'failed';
          started_at: string | null;
          completed_at: string | null;
          completion_comment: string | null;
          completion_jira_ticket: string | null;
          created_at: string | null;
          updated_at: string | null;
          github_branch_frontend: string | null;
          github_branch_backend: string | null;
          github_commit_tag_frontend: string | null;
          github_commit_tag_backend: string | null;
        };
        Insert: {
          id?: string;
          test_type_id: string;
          environment_id: string;
          jira_ticket?: string | null;
          status?: 'started' | 'completed' | 'failed';
          started_at?: string | null;
          completed_at?: string | null;
          completion_comment?: string | null;
          completion_jira_ticket?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          github_branch_frontend?: string | null;
          github_branch_backend?: string | null;
          github_commit_tag_frontend?: string | null;
          github_commit_tag_backend?: string | null;
        };
        Update: {
          id?: string;
          test_type_id?: string;
          environment_id?: string;
          jira_ticket?: string | null;
          status?: 'started' | 'completed' | 'failed';
          started_at?: string | null;
          completed_at?: string | null;
          completion_comment?: string | null;
          completion_jira_ticket?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          github_branch_frontend?: string | null;
          github_branch_backend?: string | null;
          github_commit_tag_frontend?: string | null;
          github_commit_tag_backend?: string | null;
        };
      };
    };
  };
};