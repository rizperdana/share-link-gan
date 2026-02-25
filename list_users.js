const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function listUsers() {
  const { data: users, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error('Error fetching users. Admin key may not be set:', error.message);
    // If admin key isn't set, we can't list users. Instead, try to insert a new test user if possible, but actually we can just insert into profiles DB and read standard emails.
    const { data: profiles, error: profileErr } = await supabase.from('profiles').select('username').limit(5);
    console.log('Profiles:', profiles);
  } else {
    console.log('Users:', users.users.map(u => ({ email: u.email })));
  }
}

listUsers();
