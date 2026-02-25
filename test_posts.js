require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data: posts } = await supabase.from('posts').select('*');
  console.log('Posts:', posts);
  const { data: subscribers } = await supabase.from('subscribers').select('*');
  console.log('Subscribers:', subscribers);
}
test();
