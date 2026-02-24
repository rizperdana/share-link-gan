const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debug() {
  console.log('Querying auth.users...');
  const { data: users, error: authError } = await supabaseAdmin.auth.admin.listUsers();
  if (authError) {
    console.error('authError', authError);
    return;
  }

  if (users.users.length === 0) {
    console.log('No users found in auth.users.');
  }

  for (const u of users.users) {
    console.log(`\nUser: ${u.email} (ID: ${u.id})`);

    // Check if profile exists
    const { data: profile } = await supabaseAdmin.from('profiles').select('*').eq('id', u.id).single();
    if (profile) {
      console.log('  Profile EXISTS:', profile);
    } else {
      console.log('  Profile DOES NOT EXIST. Trying insert...');
      // simulate the insert
      const newProfile = {
        id: u.id,
        username: 'user_' + Math.floor(Math.random() * 10000),
        display_name: 'Test Display Name',
        avatar_url: '',
      };

      const { error: insertError } = await supabaseAdmin.from('profiles').insert(newProfile);
      if (insertError) {
        console.error('  INSERT FAILED:', insertError);
        console.error('  Stringified:', JSON.stringify(insertError));
      } else {
        console.log('  INSERT SUCCESS.');
      }
    }
  }
}

debug();
