/**
 * One-time Supabase setup from the command line.
 *
 * Requires server/.env with SUPABASE_SERVICE_ROLE_KEY (and optional DATABASE_URL).
 *
 * Usage: npm run setup:supabase
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function runSqlWithPg() {
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
        return false
    }

    let pg

    try {
        pg = require('pg')
    } catch {
        console.log('Install pg for DDL via DATABASE_URL: npm install pg --save-dev')
        return false
    }

    const sql = fs.readFileSync(
        path.join(__dirname, '..', 'sql', 'admins.sql'),
        'utf8'
    )

    const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } })

    await client.connect()
    await client.query(sql)
    await client.end()

    console.log('admins table created via DATABASE_URL')
    return true
}

async function seedAdmin(supabase) {
    const username = process.env.ADMIN_USERNAME || 'admin'
    const password = process.env.ADMIN_PASSWORD || 'admin123'

    const { data: existing } = await supabase
        .from('admins')
        .select('id')
        .eq('username', username)
        .maybeSingle()

    if (existing) {
        console.log(`Admin "${username}" already exists`)
        return
    }

    const password_hash = await bcrypt.hash(password, 10)

    const { error } = await supabase.from('admins').insert([
        { username, password_hash },
    ])

    if (error) {
        throw error
    }

    console.log(`Seeded admin "${username}" (password from ADMIN_PASSWORD in .env)`)
}

async function main() {
    if (!supabaseUrl || !serviceKey) {
        console.error(`
Missing Supabase keys in server/.env

1. Open your KuroTv project in Supabase
2. Project Settings → API
3. Copy Project URL, anon key, and service_role key into server/.env

Then run SQL once: server/sql/full-schema.sql (SQL Editor)
Create Storage bucket: player-images (public)

Optional DATABASE_URL for automatic table creation:
   npm run setup:supabase
`)
        process.exit(1)
    }

    const supabase = createClient(supabaseUrl, serviceKey)

    const { error: probeError } = await supabase.from('admins').select('id').limit(1)

    if (probeError && probeError.code === 'PGRST205') {
        console.log('admins table not found — creating...')

        const created = await runSqlWithPg()

        if (!created) {
            console.error(`
Could not create table automatically.

Run this in KuroTv → SQL Editor:
  server/sql/full-schema.sql

Or add DATABASE_URL to server/.env and run: npm run setup:supabase
`)
            process.exit(1)
        }
    } else if (probeError) {
        console.error('Supabase error:', probeError.message)
        process.exit(1)
    } else {
        console.log('admins table OK')
    }

    await seedAdmin(supabase)
    console.log('\nSetup complete. Restart the server: npm start')
}

main().catch((err) => {
    console.error(err.message)
    process.exit(1)
})
