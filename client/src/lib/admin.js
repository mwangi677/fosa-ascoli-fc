import { adminRequest, publicGet } from './api'
import {
    loadClubStats,
    loadHomepageMatches,
    loadHomepageNews,
    loadHomepagePlayers,
} from './homepage'

function safeImageUrl(url) {
    if (!url || String(url).startsWith('blob:')) {
        return ''
    }

    return url
}

function formatNewsDate(dateValue) {
    if (!dateValue) return ''

    const date = new Date(dateValue + 'T12:00:00')

    if (Number.isNaN(date.getTime())) {
        return dateValue
    }

    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

export function showSection(sectionId) {
    const sections = document.querySelectorAll('.dashboard-section')

    sections.forEach((section) => {
        section.style.display = 'none'
    })

    const activeSection = document.getElementById(sectionId)

    if (activeSection) {
        activeSection.style.display = 'block'
    }
}

function clearPlayerForm() {
    document.getElementById('playerName').value = ''
    document.getElementById('playerPosition').value = ''
    document.getElementById('playerGoals').value = ''
    document.getElementById('playerAssists').value = ''
    document.getElementById('playerComment').value = ''
    document.getElementById('playerPhoto').value = ''
}

async function addPlayer() {
    const name = document.getElementById('playerName').value
    const position = document.getElementById('playerPosition').value
    const goals = document.getElementById('playerGoals').value
    const assists = document.getElementById('playerAssists').value
    const comment = document.getElementById('playerComment').value
    const photoFile = document.getElementById('playerPhoto').files[0]

    if (name === '' || position === '') {
        alert('Please fill all fields')
        return
    }

    if (!photoFile) {
        alert('Please choose a player photo')
        return
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('position', position)
    formData.append('goals', goals)
    formData.append('assists', assists)
    formData.append('comment', comment)
    formData.append('photo', photoFile)

    try {
        await adminRequest('/players', { method: 'POST', body: formData })
        alert('Player added successfully!')
        clearPlayerForm()
        displayPlayers()
        loadHomepagePlayers()
    } catch (error) {
        console.log(error)
        alert(error.message || 'Failed to add player')
    }
}

async function displayPlayers() {
    const container = document.getElementById('adminPlayersContainer')

    if (!container) return

    container.innerHTML = ''

    let data

    try {
        data = await publicGet('/players')
    } catch (error) {
        console.log(error)
        return
    }

    data.forEach((player) => {
        container.innerHTML += `

            <div class="player-card">

                <img
                src="${player.photo}"
                class="player-image">

                <h3>${player.name}</h3>

                <p>
                Position:
                ${player.position}
                </p>

                <p>
                Goals:
                ${player.goals}
                </p>

                <p>
                Assists:
                ${player.assists}
                </p>

                <p class="player-comment">
                ${player.comment}
                </p>

                <div class="player-actions">

                    <button
                    class="edit-btn"
                    onclick="editPlayer(${player.id})">

                        Edit

                    </button>

                    <button
                    class="delete-btn"
                    onclick="deletePlayer(${player.id})">

                        Delete

                    </button>

                </div>

            </div>

        `
    })
}

async function editPlayer(id) {
    const newGoals = prompt('Enter new goals')
    const newAssists = prompt('Enter new assists')

    try {
        await adminRequest(`/players/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ goals: newGoals, assists: newAssists }),
        })
        alert('Player updated successfully')
        displayPlayers()
        loadHomepagePlayers()
    } catch (error) {
        console.log(error)
        alert(error.message || 'Update failed')
    }
}

async function deletePlayer(id) {
    try {
        await adminRequest(`/players/${id}`, { method: 'DELETE' })
        alert('Player deleted successfully')
        displayPlayers()
        loadHomepagePlayers()
    } catch (error) {
        console.log(error)
        alert(error.message || 'Delete failed')
    }
}

async function addNews() {
    const title = document.getElementById('newsTitle').value.trim()
    const newsDate = document.getElementById('newsDate').value
    const excerpt = document.getElementById('newsExcerpt').value.trim()
    const content = document.getElementById('newsContent').value.trim()
    const photoFile = document.getElementById('newsPhoto').files[0]

    if (title === '' || excerpt === '' || newsDate === '') {
        alert('Please enter a title, date, and summary')
        return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('newsDate', newsDate)
    formData.append('excerpt', excerpt)
    formData.append('content', content)
    if (photoFile) {
        formData.append('photo', photoFile)
    }

    try {
        await adminRequest('/news', { method: 'POST', body: formData })
        alert('News published successfully!')
        clearNewsForm()
        displayNews()
        loadHomepageNews()
    } catch (error) {
        console.log(error)
        alert(error.message || 'Failed to publish news')
    }
}

async function displayNews() {
    const container = document.getElementById('adminNewsContainer')

    if (!container) return

    container.innerHTML = ''

    let data

    try {
        data = await publicGet('/news')
    } catch (error) {
        console.log(error)
        return
    }

    if (!data.length) {
        container.innerHTML = '<p class="news-empty">No news articles yet.</p>'
        return
    }

    data.forEach((item) => {
        const imageBlock = item.photo
            ? `<img src="${item.photo}" alt="" class="news-card-image">`
            : `<div class="news-card-image news-card-image--placeholder">Club News</div>`

        container.innerHTML += `

            <article class="news-card">

                ${imageBlock}

                <div class="news-card-body">
                    <time class="news-card-date">${formatNewsDate(item.news_date)}</time>
                    <h3 class="news-card-title">${item.title}</h3>
                    <p class="news-card-excerpt">${item.excerpt}</p>
                    ${item.content ? `<p class="news-card-content">${item.content}</p>` : ''}

                    <button
                    type="button"
                    class="delete-btn news-delete-btn"
                    onclick="deleteNews(${item.id})">
                        Delete Article
                    </button>
                </div>

            </article>

        `
    })
}

async function deleteNews(id) {
    if (!confirm('Delete this news article?')) {
        return
    }

    try {
        await adminRequest(`/news/${id}`, { method: 'DELETE' })
        alert('News deleted successfully')
        displayNews()
        loadHomepageNews()
    } catch (error) {
        console.log(error)
        alert(error.message || 'Error deleting news')
    }
}

function clearNewsForm() {
    const title = document.getElementById('newsTitle')
    const newsDate = document.getElementById('newsDate')
    const excerpt = document.getElementById('newsExcerpt')
    const content = document.getElementById('newsContent')
    const photo = document.getElementById('newsPhoto')

    if (title) title.value = ''
    if (newsDate) newsDate.value = ''
    if (excerpt) excerpt.value = ''
    if (content) content.value = ''
    if (photo) photo.value = ''
}

async function addMatch() {
    const homeTeam = document.getElementById('homeTeam').value
    const awayTeam = document.getElementById('awayTeam').value
    const matchDate = document.getElementById('matchDate').value
    const matchTime = document.getElementById('matchTime').value
    const homeLogoFile = document.getElementById('homeLogo').files[0]
    const awayLogoFile = document.getElementById('awayLogo').files[0]

    if (!homeLogoFile || !awayLogoFile) {
        alert('Please choose logos for both teams')
        return
    }

    const formData = new FormData()
    formData.append('homeTeam', homeTeam)
    formData.append('awayTeam', awayTeam)
    formData.append('matchDate', matchDate)
    formData.append('matchTime', matchTime)
    formData.append('homeLogo', homeLogoFile)
    formData.append('awayLogo', awayLogoFile)

    try {
        await adminRequest('/matches', { method: 'POST', body: formData })
        alert('Match added successfully!')
        displayMatches()
        loadHomepageMatches()
        clearMatchForm()
    } catch (error) {
        console.log(error)
        alert(error.message || 'Error adding match')
    }
}

async function displayMatches() {
    const container = document.getElementById('matchesContainer')

    if (!container) return

    container.innerHTML = ''

    let data

    try {
        data = await publicGet('/matches')
    } catch (error) {
        console.log(error)
        return
    }

    data.forEach((match) => {
        const homeLogo = safeImageUrl(match.homeLogo)
        const awayLogo = safeImageUrl(match.awayLogo)

        const homeLogoImg = homeLogo
            ? `<img src="${homeLogo}" alt="${match.homeTeam}" class="team-logo">`
            : ''

        const awayLogoImg = awayLogo
            ? `<img src="${awayLogo}" alt="${match.awayTeam}" class="team-logo">`
            : ''

        container.innerHTML += `

            <div class="player-card">

                <div class="match-logos">

                    ${homeLogoImg}

                    <h3>
                    ${match.homeTeam}
                    VS
                    ${match.awayTeam}
                    </h3>

                    ${awayLogoImg}

                </div>

                <p>
                Date:
                ${match.matchDate}
                </p>

                <p>
                Time:
                ${match.matchTime}
                </p>

                <button
                class="delete-btn"
                onclick="deleteMatch(${match.id})">

                    Delete

                </button>

            </div>

        `
    })
}

async function deleteMatch(id) {
    try {
        await adminRequest(`/matches/${id}`, { method: 'DELETE' })
        alert('Match deleted successfully')
        displayMatches()
        loadHomepageMatches()
    } catch (error) {
        console.log(error)
        alert(error.message || 'Error deleting match')
    }
}

function clearMatchForm() {
    document.getElementById('homeTeam').value = ''
    document.getElementById('awayTeam').value = ''
    document.getElementById('matchDate').value = ''
    document.getElementById('homeLogo').value = ''
    document.getElementById('awayLogo').value = ''
}

async function updateStats() {
    const matchesPlayed = document.getElementById('matchesPlayed').value
    const matchesWon = document.getElementById('matchesWon').value
    const goalsScored = document.getElementById('goalsScored').value

    try {
        await adminRequest('/stats', {
            method: 'PATCH',
            body: JSON.stringify({ matchesPlayed, matchesWon, goalsScored }),
        })
        alert('Stats updated successfully')
        loadClubStats()
    } catch (error) {
        console.log(error)
        alert(error.message || 'Error updating stats')
    }
}

async function loadAdminAccount() {
    const usernameInput = document.getElementById('newAdminUsername')

    if (!usernameInput) return

    try {
        const result = await adminRequest('/account')
        usernameInput.placeholder = `Current: ${result.data.username}`
    } catch (error) {
        console.log(error)
    }
}

async function updateAdmin() {
    const newUsername = document.getElementById('newAdminUsername').value.trim()
    const newPassword = document.getElementById('newAdminPassword').value

    if (!newUsername || !newPassword) {
        alert('Enter a new username and password')
        return
    }

    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters')
        return
    }

    try {
        await adminRequest('/account', {
            method: 'PATCH',
            body: JSON.stringify({ newUsername, newPassword }),
        })

        alert('Admin updated in Supabase. Please log in again with your new credentials.')

        localStorage.removeItem('adminToken')
        window.location.href = '/login'
    } catch (error) {
        console.log(error)
        alert(error.message || 'Failed to update admin account')
    }
}

export function initAdminPage(navigate) {
    window.showSection = showSection
    window.addPlayer = addPlayer
    window.editPlayer = editPlayer
    window.deletePlayer = deletePlayer
    window.addNews = addNews
    window.deleteNews = deleteNews
    window.addMatch = addMatch
    window.deleteMatch = deleteMatch
    window.updateStats = updateStats
    window.updateAdmin = updateAdmin

    window.logout = function logout() {
        localStorage.removeItem('adminToken')
        navigate('/login')
    }

    if (document.getElementById('playersSection')) {
        showSection('playersSection')
    }

    displayPlayers()
    displayMatches()
    displayNews()
    loadAdminAccount()

    return () => {
        delete window.showSection
        delete window.addPlayer
        delete window.editPlayer
        delete window.deletePlayer
        delete window.addNews
        delete window.deleteNews
        delete window.addMatch
        delete window.deleteMatch
        delete window.updateStats
        delete window.updateAdmin
        delete window.logout
    }
}
