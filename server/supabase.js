require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error(
        'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in server/.env — use keys from your KuroTv project.'
    )
    process.exit(1)
}

const supabaseKey = supabaseServiceKey || supabaseAnonKey

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = { supabase, supabaseUrl, supabaseAnonKey }
