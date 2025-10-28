export interface Project {
  id: number; // Changed to number since the backend uses numeric IDs
  name: string;
  description?: string;
  color: string;
  start_date?: string;
  end_date?: string;
  status: 'active' | 'completed' | 'archived'; // Updated to match frontend status values
  created_by: number;
  created_by_name?: string;
  member_count?: number;
  task_count?: number;
  event_count?: number;
  created_at: string;
  updated_at: string;
}