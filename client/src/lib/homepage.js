import { publicGet } from './api'

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

export async function loadHomepagePlayers() {
    const homepagePlayers = document.getElementById('homepagePlayers')

    if (!homepagePlayers) return

    homepagePlayers.innerHTML = ''

    let data

    try {
        data = await publicGet('/players')
    } catch (error) {
        console.log(error)
        return
    }

    data.forEach((player) => {
        homepagePlayers.innerHTML += `

            <article class="player-card">

                <div class="player-image-wrap">
                    <img
                    src="${player.photo}"
                    alt="${player.name}"
                    class="player-image">
                </div>

                <div class="player-card-body">
                    <h3>${player.name}</h3>
                    <span class="player-position">${player.position}</span>

                    <div class="player-stats">
                        <div class="stat-item">
                            <span class="stat-value">${player.goals ?? 0}</span>
                            <span class="stat-label">Goals</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${player.assists ?? 0}</span>
                            <span class="stat-label">Assists</span>
                        </div>
                    </div>

                    <p class="player-comment">${player.comment || ''}</p>
                </div>

            </article>

        `
    })
}

export async function loadHomepageNews() {
    const container = document.getElementById('homepageNews')

    if (!container) return

    const newsSection = document.querySelector('.news-section')

    container.innerHTML = ''
    container.classList.remove('news-grid--filled')

    if (newsSection) {
        newsSection.classList.remove('news-section--filled')
    }

    let data

    try {
        data = await publicGet('/news')
    } catch (error) {
        console.log(error)

        container.innerHTML =
            '<p class="news-empty">News will appear here once the club publishes updates.</p>'

        return
    }

    if (!data.length) {
        container.innerHTML =
            '<p class="news-empty">No news yet. Check back soon for club updates.</p>'

        return
    }

    container.classList.add('news-grid--filled')

    if (newsSection) {
        newsSection.classList.add('news-section--filled')
    }

    data.forEach((item) => {
        const imageBlock = item.photo
            ? `<img src="${item.photo}" alt="${item.title}" class="news-card-image">`
            : `<div class="news-card-image news-card-image--placeholder">Club News</div>`

        container.innerHTML += `

            <article class="news-card">

                ${imageBlock}

                <div class="news-card-body">
                    <time class="news-card-date">${formatNewsDate(item.news_date)}</time>
                    <h3 class="news-card-title">${item.title}</h3>
                    <p class="news-card-excerpt">${item.excerpt}</p>
                    ${item.content ? `<p class="news-card-content">${item.content}</p>` : ''}
                </div>

            </article>

        `
    })
}

export async function loadHomepageMatches() {
    const homepageMatches = document.getElementById('homepageMatches')

    if (!homepageMatches) return

    homepageMatches.innerHTML = ''

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

        homepageMatches.innerHTML += `

            <article class="match-card">

                <div class="match-card-header">
                    <span class="match-card-badge">Upcoming</span>
                    <span class="match-card-venue">League fixture</span>
                </div>

                <div class="match-card-body">
                    <div class="match-teams">
                        <div class="match-team">
                            ${homeLogoImg}
                            <span class="match-team-name">${match.homeTeam}</span>
                        </div>

                        <span class="match-vs">VS</span>

                        <div class="match-team match-team--away">
                            ${awayLogoImg}
                            <span class="match-team-name">${match.awayTeam}</span>
                        </div>
                    </div>

                    <div class="match-meta">
                        <span class="match-meta-item">
                            <strong>Date</strong> ${match.matchDate}
                        </span>
                        <span class="match-meta-item">
                            <strong>Time</strong> ${match.matchTime}
                        </span>
                    </div>
                </div>

            </article>

        `
    })
}

export async function loadClubStats() {
    let data

    try {
        data = await publicGet('/stats')
    } catch (error) {
        console.log(error)
        return
    }

    const played = document.getElementById('homeMatchesPlayed')
    const won = document.getElementById('homeMatchesWon')
    const goals = document.getElementById('homeGoalsScored')

    if (played) {
        played.innerText = data.matchesPlayed
    }

    if (won) {
        won.innerText = data.matchesWon
    }

    if (goals) {
        goals.innerText = data.goalsScored
    }
}

export function scrollPlayersLeft() {
    document.getElementById('homepagePlayers')?.scrollBy({
        left: -320,
        behavior: 'smooth',
    })
}

export function scrollPlayersRight() {
    document.getElementById('homepagePlayers')?.scrollBy({
        left: 320,
        behavior: 'smooth',
    })
}

export function initHomePage() {
    loadHomepagePlayers()
    loadHomepageMatches()
    loadHomepageNews()
    loadClubStats()

    const footerYear = document.getElementById('footerYear')
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear()
    }

    window.scrollPlayersLeft = scrollPlayersLeft
    window.scrollPlayersRight = scrollPlayersRight

    const slides = document.querySelectorAll('.slide')
    const nextBtn = document.querySelector('.next')
    const prevBtn = document.querySelector('.prev')
    const heroDotsContainer = document.getElementById('heroDots')

    let currentSlide = 0
    let heroIntervalId = null

    function showSlide(index) {
        if (!slides.length) return

        slides.forEach((slide) => {
            slide.classList.remove('active')
        })

        slides[index].classList.add('active')

        if (heroDotsContainer) {
            const dots = heroDotsContainer.querySelectorAll('.hero-dot')

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index)
            })
        }
    }

    function goToSlide(index) {
        if (!slides.length) return

        currentSlide = index

        if (currentSlide >= slides.length) {
            currentSlide = 0
        }

        if (currentSlide < 0) {
            currentSlide = slides.length - 1
        }

        showSlide(currentSlide)
    }

    function startHeroAutoplay() {
        if (heroIntervalId || !slides.length) return

        heroIntervalId = setInterval(() => {
            goToSlide(currentSlide + 1)
        }, 5000)
    }

    const cleanups = []

    if (slides.length) {
        if (heroDotsContainer) {
            heroDotsContainer.innerHTML = ''

            slides.forEach((_, i) => {
                const dot = document.createElement('button')

                dot.type = 'button'
                dot.className = 'hero-dot' + (i === 0 ? ' active' : '')
                dot.setAttribute('aria-label', 'Go to slide ' + (i + 1))

                dot.addEventListener('click', () => {
                    goToSlide(i)
                })

                heroDotsContainer.appendChild(dot)
            })
        }

        if (nextBtn) {
            const onNext = () => goToSlide(currentSlide + 1)
            nextBtn.addEventListener('click', onNext)
            cleanups.push(() => nextBtn.removeEventListener('click', onNext))
        }

        if (prevBtn) {
            const onPrev = () => goToSlide(currentSlide - 1)
            prevBtn.addEventListener('click', onPrev)
            cleanups.push(() => prevBtn.removeEventListener('click', onPrev))
        }

        startHeroAutoplay()
    }

    const siteHeader = document.getElementById('siteHeader')

    if (siteHeader) {
        const onScroll = () => {
            siteHeader.classList.toggle('is-scrolled', window.scrollY > 40)
        }

        window.addEventListener('scroll', onScroll)
        cleanups.push(() => window.removeEventListener('scroll', onScroll))
    }

    const navToggle = document.getElementById('navToggle')
    const navLinks = document.getElementById('navLinks')

    if (navToggle && navLinks) {
        const onToggle = () => {
            const isOpen = navToggle.classList.toggle('is-open')

            navLinks.classList.toggle('is-open', isOpen)

            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
        }

        navToggle.addEventListener('click', onToggle)
        cleanups.push(() => navToggle.removeEventListener('click', onToggle))

        const linkCleanups = []

        navLinks.querySelectorAll('a').forEach((link) => {
            const onLinkClick = () => {
                navToggle.classList.remove('is-open')
                navLinks.classList.remove('is-open')
                navToggle.setAttribute('aria-expanded', 'false')
            }

            link.addEventListener('click', onLinkClick)
            linkCleanups.push(() => link.removeEventListener('click', onLinkClick))
        })

        cleanups.push(...linkCleanups)
    }

    return () => {
        if (heroIntervalId) {
            clearInterval(heroIntervalId)
        }

        cleanups.forEach((fn) => fn())
    }
}
