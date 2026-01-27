export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          goals_10: string[] | null;
          goals_5: string[] | null;
          top_3: string[] | null;
          day_end_time: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          goals_10?: string[] | null;
          goals_5?: string[] | null;
          top_3?: string[] | null;
          day_end_time?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          goals_10?: string[] | null;
          goals_5?: string[] | null;
          top_3?: string[] | null;
          day_end_time?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          task_name: string;
          tag: string | null;
          start_time: string;
          end_time: string | null;
          is_manual: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          task_name: string;
          tag?: string | null;
          start_time: string;
          end_time?: string | null;
          is_manual?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          task_name?: string;
          tag?: string | null;
          start_time?: string;
          end_time?: string | null;
          is_manual?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];
export type InsertProfile = Database['public']['Tables']['profiles']['Insert'];
export type InsertTask = Database['public']['Tables']['tasks']['Insert'];
