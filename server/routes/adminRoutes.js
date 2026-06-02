const express = require('express')
const multer = require('multer')
const { supabase } = require('../supabase')
const { requireAuth } = require('../middleware/requireAuth')
const { uploadToStorage } = require('../utils/storage')
const {
    findAdminByUsername,
    updateAdminAccount,
} = require('../services/admins')

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.use(requireAuth)

router.get('/account', async (req, res) => {
    try {
        const admin = await findAdminByUsername(req.admin.username)

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin account not found',
            })
        }

        res.json({
            success: true,
            data: { username: admin.username },
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
})

router.patch('/account', async (req, res) => {
    const { newUsername, newPassword } = req.body

    if (!newUsername || !newPassword) {
        return res.status(400).json({
            success: false,
            message: 'New username and password are required',
        })
    }

    if (newPassword.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters',
        })
    }

    try {
        const updated = await updateAdminAccount(
            req.admin.username,
            newUsername.trim(),
            newPassword
        )

        res.json({
            success: true,
            message: 'Admin account updated. Please log in again.',
            data: updated,
        })
    } catch (error) {
        console.log(error)

        if (error.code === '23505') {
            return res.status(409).json({
                success: false,
                message: 'That username is already taken',
            })
        }

        res.status(500).json({ success: false, message: error.message })
    }
})

router.post('/players', upload.single('photo'), async (req, res) => {
    try {
        const { name, position, goals, assists, comment } = req.body

        if (!name || !position) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required fields',
            })
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Player photo is required',
            })
        }

        const photo = await uploadToStorage(req.file, 'player')

        const { error } = await supabase.from('players').insert([
            { name, position, goals, assists, comment, photo },
        ])

        if (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: error.message })
        }

        res.json({ success: true, message: 'Player added successfully!' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Image upload failed' })
    }
})

router.patch('/players/:id', async (req, res) => {
    const { goals, assists } = req.body
    const { error } = await supabase
        .from('players')
        .update({ goals, assists })
        .eq('id', req.params.id)

    if (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }

    res.json({ success: true, message: 'Player updated successfully' })
})

router.delete('/players/:id', async (req, res) => {
    const { error } = await supabase.from('players').delete().eq('id', req.params.id)

    if (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }

    res.json({ success: true, message: 'Player deleted successfully' })
})

router.post('/news', upload.single('photo'), async (req, res) => {
    try {
        const { title, newsDate, excerpt, content } = req.body

        if (!title || !excerpt || !newsDate) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a title, date, and summary',
            })
        }

        let photo = null

        if (req.file) {
            photo = await uploadToStorage(req.file, 'news')
        }

        const { error } = await supabase.from('news').insert([
            {
                title,
                excerpt,
                content,
                news_date: newsDate,
                photo,
            },
        ])

        if (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: error.message })
        }

        res.json({ success: true, message: 'News published successfully!' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Image upload failed' })
    }
})

router.delete('/news/:id', async (req, res) => {
    const { error } = await supabase.from('news').delete().eq('id', req.params.id)

    if (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }

    res.json({ success: true, message: 'News deleted successfully' })
})

router.post(
    '/matches',
    upload.fields([
        { name: 'homeLogo', maxCount: 1 },
        { name: 'awayLogo', maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const { homeTeam, awayTeam, matchDate, matchTime } = req.body
            const homeFile = req.files?.homeLogo?.[0]
            const awayFile = req.files?.awayLogo?.[0]

            if (!homeTeam || !awayTeam || !homeFile || !awayFile) {
                return res.status(400).json({
                    success: false,
                    message: 'Please fill all fields and choose both logos',
                })
            }

            const homeLogo = await uploadToStorage(homeFile, 'home')
            const awayLogo = await uploadToStorage(awayFile, 'away')

            const { error } = await supabase.from('matches').insert([
                { homeTeam, awayTeam, matchDate, matchTime, homeLogo, awayLogo },
            ])

            if (error) {
                console.log(error)
                return res.status(500).json({ success: false, message: error.message })
            }

            res.json({ success: true, message: 'Match added successfully!' })
        } catch (err) {
            console.log(err)
            res.status(500).json({ success: false, message: 'Logo upload failed' })
        }
    }
)

router.delete('/matches/:id', async (req, res) => {
    const { error } = await supabase.from('matches').delete().eq('id', req.params.id)

    if (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }

    res.json({ success: true, message: 'Match deleted successfully' })
})

router.get('/standings', async (req, res) => {
    const { data, error } = await supabase
        .from('standings')
        .select('*')
        .order('position', { ascending: true })

    if (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }

    res.json({ success: true, data })
})

router.post('/standings', async (req, res) => {
    const { position, name, played, wins, draws, losses, goalsFor, goalsAgainst, goalDifference, points, highlight } = req.body

    if (!name || position === undefined) {
        return res.status(400).json({ success: false, message: 'Team name and position are required' })
    }

    const { error } = await supabase.from('standings').insert([{
        position, name,
        played: played || 0, wins: wins || 0, draws: draws || 0, losses: losses || 0,
        goalsFor: goalsFor || 0, goalsAgainst: goalsAgainst || 0,
        goalDifference: goalDifference || 0, points: points || 0,
        highlight: highlight || false,
    }])

    if (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }

    res.json({ success: true, message: 'Team added to standings!' })
})

router.patch('/standings/:id', async (req, res) => {
    const { position, name, played, wins, draws, losses, goalsFor, goalsAgainst, goalDifference, points, highlight } = req.body

    const { error } = await supabase
        .from('standings')
        .update({ position, name, played, wins, draws, losses, goalsFor, goalsAgainst, goalDifference, points, highlight })
        .eq('id', req.params.id)

    if (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }

    res.json({ success: true, message: 'Standing updated!' })
})

router.delete('/standings/:id', async (req, res) => {
    const { error } = await supabase.from('standings').delete().eq('id', req.params.id)

    if (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }

    res.json({ success: true, message: 'Team removed from standings' })
})

router.patch('/stats', async (req, res) => {
    const { matchesPlayed, matchesWon, goalsScored } = req.body

    const { error } = await supabase
        .from('stats')
        .update({ matchesPlayed, matchesWon, goalsScored })
        .eq('id', 1)

    if (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }

    res.json({ success: true, message: 'Stats updated successfully' })
})

module.exports = router
