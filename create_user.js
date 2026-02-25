const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function createTestUser() {
  const email = 'browser.test@example.com';
  const password = 'Password123!';

  // Create user
  const { data: user, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (error) {
    if (error.message.includes('already registered')) {
      console.log('User already exists. Updating password.');
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers.users.find(u => u.email === email);
      if (existingUser) {
        await supabase.auth.admin.updateUserById(existingUser.id, { password });
        console.log('Password updated. Credentials:', { email, password });
      }
    } else {
      console.error('Error creating user:', error);
    }
  } else {
    // Also create profile
    await supabase.from('profiles').upsert({ id: user.user.id, username: 'browser_test_' + Date.now(), display_name: 'Browser Test' });
    console.log('User created successfully. Credentials:', { email, password });
  }
}

createTestUser();
