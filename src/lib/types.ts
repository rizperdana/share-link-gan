export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  theme?: string;
  social_links?: Record<string, string>;
  hide_branding?: boolean;
  custom_footer_text?: string | null;
  custom_footer_url?: string | null;
  is_sensitive?: boolean;
  enable_subscribers?: boolean;
  qris_image_url?: string | null;
  donation_link?: string | null;
  bg_image_url?: string | null;
  font_heading?: string | null;
  font_body?: string | null;
  created_at: string;
}

export interface Link {
  id: string;
  user_id: string;
  title: string;
  url: string;
  icon: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  scheduled_start?: string | null;
  scheduled_end?: string | null;
  tags?: string[];
  is_private?: boolean;
  private_pin?: string | null;
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  profile_id: string;
  link_id?: string | null;
  event_type: "page_view" | "link_click";
  referrer?: string | null;
  country?: string | null;
  device?: string | null;
  created_at: string;
}

export interface Subscriber {
  id: string;
  profile_id: string;
  email: string;
  is_confirmed: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  profile_id: string;
  title: string;
  body?: string | null;
  image_url?: string | null;
  link_id?: string | null;
  is_published: boolean;
  scheduled_start?: string | null;
  scheduled_end?: string | null;
  tags?: string[];
  is_private?: boolean;
  private_pin?: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  profile_id: string;
  title: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  checkout_link?: string | null;
  whatsapp_number?: string | null;
  category?: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}
