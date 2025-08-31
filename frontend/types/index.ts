export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: "todo" | "done";
  responsible: number;
  created_at: string;
  updated_at: string;
}
