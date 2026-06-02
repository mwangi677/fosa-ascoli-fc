/**
 * Probe standings table schema.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function main() {
  // Try to select (will error if table doesn't exist)
  const { data, error } = await supabase.from('standings').select('*').limit(3)
  if (error && error.code === 'PGRST205') {
    console.log('Table does NOT exist. Run full-schema.sql in Supabase SQL Editor.')
    console.log('URL: https://supabase.com/dashboard/project/erhtjyopjsculfmnttxl/sql/new')
  } else if (error) {
    console.log('Error:', error.message)
    console.log('Code:', error.code)
    console.log('Details:', error.details)
  } else {
    console.log('Table exists with columns:', Object.keys(data[0] || {}).join(', '))
    console.log('Sample row:', JSON.stringify(data[0], null, 2))
    console.log('Row count:', data.length)
  }
}

main()
