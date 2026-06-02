/**
 * Seed standings table with test data.
 * Run: node scripts/seed-standings.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const teams = [
  { position: 1, name: 'Gor Mahia', played: 26, wins: 18, draws: 6, losses: 2, goalsFor: 52, goalsAgainst: 18, goalDifference: 34, points: 60, highlight: false },
  { position: 2, name: 'Tusker FC', played: 26, wins: 16, draws: 7, losses: 3, goalsFor: 44, goalsAgainst: 20, goalDifference: 24, points: 55, highlight: false },
  { position: 3, name: 'Fosa Ascoli FC', played: 26, wins: 16, draws: 5, losses: 5, goalsFor: 48, goalsAgainst: 22, goalDifference: 26, points: 53, highlight: true },
  { position: 4, name: 'AFC Leopards', played: 26, wins: 14, draws: 8, losses: 4, goalsFor: 40, goalsAgainst: 24, goalDifference: 16, points: 50, highlight: false },
  { position: 5, name: 'KCB FC', played: 26, wins: 13, draws: 7, losses: 6, goalsFor: 38, goalsAgainst: 28, goalDifference: 10, points: 46, highlight: false },
  { position: 6, name: 'Bandari FC', played: 26, wins: 12, draws: 6, losses: 8, goalsFor: 35, goalsAgainst: 30, goalDifference: 5, points: 42, highlight: false },
  { position: 7, name: 'Kakamega Homeboyz', played: 26, wins: 11, draws: 8, losses: 7, goalsFor: 32, goalsAgainst: 29, goalDifference: 3, points: 41, highlight: false },
  { position: 8, name: 'Kenya Police FC', played: 26, wins: 11, draws: 7, losses: 8, goalsFor: 34, goalsAgainst: 31, goalDifference: 3, points: 40, highlight: false },
]

async function main() {
  if (!supabaseUrl || !serviceKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in server/.env')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  // Check if standings table exists
  const { error: probe } = await supabase.from('standings').select('id').limit(1)
  if (probe && probe.code === 'PGRST205') {
    console.error('standings table does not exist! Run full-schema.sql in Supabase SQL Editor first.')
    console.error('Go to: https://supabase.com/dashboard/project/erhtjyopjsculfmnttxl/sql/new')
    process.exit(1)
  }
  if (probe) {
    console.error('Supabase error:', probe.message)
    process.exit(1)
  }

  // Clear existing
  const { data: existing } = await supabase.from('standings').select('id')
  if (existing && existing.length > 0) {
    console.log(`Clearing ${existing.length} existing rows...`)
    await supabase.from('standings').delete().neq('id', 0)
  }

  // Try seeding with full columns
  const { error: insertErr } = await supabase.from('standings').insert(teams)
  if (insertErr) {
    console.log('Full insert failed, trying minimal columns (migration may not be run yet)...')
    // Try with just position + name
    const minimal = teams.map(t => ({ position: t.position, name: t.name }))
    const { error: minErr } = await supabase.from('standings').insert(minimal)
    if (minErr) {
      console.error('Minimal insert also failed:', minErr.message)
      process.exit(1)
    }
    console.log(`Seeded ${minimal.length} teams with position + name only.`)
    console.log('')
    console.log('Run the migration SQL (see supabase/migrations/) to add stat columns,')
    console.log('then re-run this script to seed full data.')
  } else {
    console.log(`Seeded ${teams.length} teams into standings table!`)
  }

  console.log('')
  console.log('Now start the server and test:')
  console.log('  cd server')
  console.log('  npm start')
  console.log('  curl http://localhost:5000/api/standings')
}

main().catch(err => { console.error(err); process.exit(1) })
