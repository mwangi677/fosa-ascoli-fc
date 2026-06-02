const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'fosa-dev-secret-change-in-production'

function requireAuth(req, res, next) {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Missing authentication token',
        })
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET)
        req.admin = payload
        next()
    } catch {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        })
    }
}

module.exports = { requireAuth, JWT_SECRET }
