require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: users } = await supabase.auth.admin.listUsers();
  const testUser = users.users.find(u => u.email === 'browser.test@example.com');
  if (!testUser) return console.log('user not found');

  // create some fake tracking data
  const events = [];
  const days = [0, 1, 2, 3, 4, 5, 6]; // last 7 days

  for (let i = 0; i < 50; i++) {
    const dayOffset = days[Math.floor(Math.random() * days.length)];
    const date = new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000).toISOString();

    events.push({
      profile_id: testUser.id,
      event_type: i % 3 === 0 ? 'link_click' : 'page_view',
      device: ['mobile', 'desktop', 'tablet'][Math.floor(Math.random() * 3)],
      referrer: ['https://twitter.com', 'https://google.com', 'Direct'][Math.floor(Math.random() * 3)],
      created_at: date
    });
  }

  const { error } = await supabase.from('analytics_events').insert(events);
  console.log('Inserted test analytics:', error ? error.message : 'Success');
}
run();
