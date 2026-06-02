const bcrypt = require('bcryptjs')
const { supabase } = require('../supabase')

async function findAdminByUsername(username) {
    const { data, error } = await supabase
        .from('admins')
        .select('id, username, password_hash')
        .eq('username', username)
        .maybeSingle()

    if (error) {
        throw error
    }

    return data
}

async function verifyAdminCredentials(username, password) {
    const admin = await findAdminByUsername(username)

    if (!admin) {
        return false
    }

    return bcrypt.compare(password, admin.password_hash)
}

async function ensureDefaultAdmin() {
    const defaultUsername = process.env.ADMIN_USERNAME || 'admin'
    const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123'

    const existing = await findAdminByUsername(defaultUsername)

    if (existing) {
        console.log(`Admin user "${defaultUsername}" already exists in Supabase`)
        return
    }

    const password_hash = await bcrypt.hash(defaultPassword, 10)

    const { error } = await supabase.from('admins').insert([
        { username: defaultUsername, password_hash },
    ])

    if (error) {
        console.error('Could not seed default admin:', error.message)
        console.error('Run server/sql/admins.sql in Supabase, then set SUPABASE_SERVICE_ROLE_KEY in server/.env')
        return
    }

    console.log(`Seeded default admin "${defaultUsername}" in Supabase`)
}

async function updateAdminAccount(currentUsername, newUsername, newPassword) {
    const password_hash = await bcrypt.hash(newPassword, 10)

    const { error } = await supabase
        .from('admins')
        .update({
            username: newUsername,
            password_hash,
            updated_at: new Date().toISOString(),
        })
        .eq('username', currentUsername)

    if (error) {
        throw error
    }

    return { username: newUsername }
}

module.exports = {
    findAdminByUsername,
    verifyAdminCredentials,
    ensureDefaultAdmin,
    updateAdminAccount,
}
