export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Link {
  id: string;
  user_id: string;
  title: string;
  url: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}
