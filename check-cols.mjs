import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { db: { schema: 'public' } }
);

async function migrate() {
  // Use the REST API to call the SQL editor
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });

  // Alternative: use supabase-js to insert a test value and let it fail gracefully
  // The columns need to be added via Supabase dashboard SQL editor
  console.log("Please run the following SQL in your Supabase dashboard SQL Editor:");
  console.log("---");
  console.log("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bg_image_url TEXT;");
  console.log("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS font_heading TEXT;");
  console.log("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS font_body TEXT;");
  console.log("---");
}

migrate();
