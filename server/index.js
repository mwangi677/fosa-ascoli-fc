require('dotenv').config()

const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('./middleware/requireAuth')
const publicRoutes = require('./routes/publicRoutes')
const adminRoutes = require('./routes/adminRoutes')
const {
    verifyAdminCredentials,
    ensureDefaultAdmin,
} = require('./services/admins')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Fosa Ascoli FC Backend is running! (Supabase + JWT)')
})

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required',
        })
    }

    try {
        const valid = await verifyAdminCredentials(username, password)

        if (!valid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password',
            })
        }

        const token = jwt.sign(
            { username, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '8h' }
        )

        res.json({
            success: true,
            message: 'Login successful',
            token,
        })
    } catch (error) {
        console.error('Login error:', error.message)
        res.status(500).json({
            success: false,
            message:
                'Login service unavailable. Run server/sql/admins.sql and set SUPABASE_SERVICE_ROLE_KEY.',
        })
    }
})

app.get('/api/auth/verify', (req, res) => {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null

    if (!token) {
        return res.status(401).json({ success: false, message: 'No token' })
    }

    try {
        jwt.verify(token, JWT_SECRET)
        res.json({ success: true })
    } catch {
        res.status(401).json({ success: false, message: 'Invalid token' })
    }
})

app.use('/api', publicRoutes)
app.use('/api/admin', adminRoutes)

const server = app.listen(PORT)

server.on('listening', async () => {
    console.log(`Server is running on port ${PORT}`)
    console.log(`Test: http://localhost:${PORT}/`)
    console.log('Data: Supabase | Auth: JWT + admins table')
    await ensureDefaultAdmin()
})

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`)
        console.error('Stop the old server (Ctrl+C), then run npm start again.')
    } else {
        console.error('Server failed to start:', err.message)
    }
    process.exit(1)
})
