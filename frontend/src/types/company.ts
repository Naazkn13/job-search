export interface Company {
  id: string;
  name: string;
  priority: number;
  location: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}
