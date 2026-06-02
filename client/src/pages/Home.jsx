import { useEffect, useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { publicGet } from '../lib/api'

const ICONS = {
  ball: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10"/><path d="M2 12h20"/></svg>,
  goal: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 6v12"/><path d="M2 12h20"/></svg>,
  calendar: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  clock: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  user: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  trophy: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  shield: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  stadium: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22V8l3-2v16"/><path d="M22 22V8l-3-2v16"/><path d="M7 22V2h10v20"/><path d="M12 22V2"/></svg>,
  news: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9"/><line x1="10" y1="8" x2="18" y2="8"/><line x1="10" y1="12" x2="16" y2="12"/><line x1="10" y1="16" x2="14" y2="16"/></svg>,
  photo: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  star: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  arrowRight: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  arrowLeft: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  menu: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  linkedin: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  twitter: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>,
  instagram: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  youtube: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>,
  facebook: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  check: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00:00')
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(timeStr) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${m} ${ampm}`
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'news', label: 'News' },
  { id: 'players', label: 'Squad' },
  { id: 'matches', label: 'Fixtures' },
  { id: 'stats', label: 'Stats' },
  { id: 'gallery', label: 'Gallery' },
]

const HERO_IMAGES = [
  { src: '/images/field.png', alt: 'Fosa Ascoli FC — Home Stadium' },
  { src: '/images/team 2.png', alt: 'Fosa Ascoli FC First Team 2025/26' },
  { src: '/images/team 1.png', alt: 'Fosa Ascoli FC Training Session' },
  { src: '/images/field.png', alt: 'Match Day at the Stadium', overlay: 'rgba(0,0,0,0.3)' },
  { src: '/images/team 2.png', alt: 'Squad Celebrating a Victory', overlay: 'rgba(22,101,52,0.2)' },
  { src: '/images/team 1.png', alt: 'Youth Academy Prospects', overlay: 'rgba(0,0,0,0.25)' },
]

const GALLERY_IMAGES = [
  { src: '/images/team 2.png', alt: 'First Team Squad Photo' },
  { src: '/images/team 1.png', alt: 'Training Session at the Academy' },
  { src: '/images/field.png', alt: 'Home Stadium — Pitch View' },
  { src: '/images/team 2.png', alt: 'Team Huddle Before Kickoff', overlay: 'oklch(52% 0.18 145 / 0.15)' },
  { src: '/images/field.png', alt: 'Fans in the Stands', overlay: 'oklch(78% 0.14 85 / 0.1)' },
  { src: '/images/team 1.png', alt: 'Pre-season Training Camp', overlay: 'oklch(52% 0.18 145 / 0.08)' },
  { src: '/images/team 2.png', alt: 'Goal Celebration Moment', overlay: 'oklch(78% 0.14 85 / 0.12)' },
  { src: '/images/field.png', alt: 'Floodlit Evening Match', overlay: 'oklch(0% 0 0 / 0.2)' },
  { src: '/images/team 1.png', alt: 'Community Outreach Event', overlay: 'oklch(52% 0.18 145 / 0.1)' },
]

const SEED_PLAYERS = [
  { id: 's1', name: 'Brian Ochieng', position: 'Goalkeeper', goals: 0, assists: 1, photo: '/images/team 2.png', comment: 'Club captain, 5th season. Shot-stopping specialist.' },
  { id: 's2', name: 'Ian Otieno', position: 'Goalkeeper', goals: 0, assists: 0, photo: '/images/team 1.png', comment: 'Young prospect from the youth academy.' },
  { id: 's3', name: 'John Kamau', position: 'Defender', goals: 3, assists: 2, photo: '/images/team 2.png', comment: 'Rock-solid centre-back, dominant in the air.' },
  { id: 's4', name: 'David Owino', position: 'Defender', goals: 4, assists: 1, photo: '/images/field.png', comment: 'Vice-captain. Leads the backline with composure.' },
  { id: 's5', name: 'James Kibiru', position: 'Defender', goals: 1, assists: 4, photo: '/images/team 1.png', comment: 'Attacking left-back with an eye for crosses.' },
  { id: 's6', name: 'Eric Masika', position: 'Defender', goals: 1, assists: 3, photo: '/images/team 2.png', comment: 'Versatile defender who can play anywhere across the back.' },
  { id: 's7', name: 'Kevin Omondi', position: 'Midfielder', goals: 8, assists: 6, photo: '/images/team 1.png', comment: 'Box-to-box engine. Fans\' Player of the Year.' },
  { id: 's8', name: 'Samuel Onyango', position: 'Midfielder', goals: 3, assists: 5, photo: '/images/team 2.png', comment: 'Deep-lying playmaker with exceptional passing range.' },
  { id: 's9', name: 'Peter Opiyo', position: 'Midfielder', goals: 5, assists: 10, photo: '/images/field.png', comment: 'Creative midfielder, leads the league in assists.' },
  { id: 's10', name: 'Hassan Abdallah', position: 'Midfielder', goals: 2, assists: 7, photo: '/images/team 1.png', comment: 'Hard-working winger with blistering pace.' },
  { id: 's11', name: 'Timothy Ouma', position: 'Midfielder', goals: 6, assists: 8, photo: '/images/team 2.png', comment: 'Set-piece specialist. Deadly from free kicks.' },
  { id: 's12', name: 'Michael Olunga', position: 'Forward', goals: 14, assists: 3, photo: '/images/field.png', comment: 'Top scorer. Clinical finisher, strong hold-up play.' },
  { id: 's13', name: 'Masoud Juma', position: 'Forward', goals: 11, assists: 4, photo: '/images/team 1.png', comment: 'Pacey striker who thrives on through balls.' },
  { id: 's14', name: 'John Avire', position: 'Forward', goals: 9, assists: 7, photo: '/images/team 2.png', comment: 'New signing. Already fan favourite after 5 goals in 8 games.' },
  { id: 's15', name: 'Derrick Otanga', position: 'Forward', goals: 7, assists: 2, photo: '/images/team 1.png', comment: 'Impact substitute with a knack for late winners.' },
  { id: 's16', name: 'Collins Ochieng', position: 'Defender', goals: 2, assists: 0, photo: '/images/team 2.png', comment: 'Youngster breaking into the first team this season.' },
]

const SEED_NEWS = [
  { id: 'n1', title: 'Fosa Ascoli Maintains Perfect Home Record', news_date: '2026-05-28', excerpt: 'A dominant 2-0 victory extends the club\'s unbeaten home streak to 12 matches in the FKF Premier League.', photo: '/images/field.png', content: 'Fosa Ascoli FC continued their impressive home form with a commanding performance at their home ground. The team showed remarkable composure and tactical discipline throughout the 90 minutes.' },
  { id: 'n2', title: 'New Signing John Avire Joins Fosa Ascoli', news_date: '2026-05-20', excerpt: 'The club is delighted to announce the signing of forward John Avire on a three-year deal from Tusker FC.', photo: '/images/team 1.png', content: 'John Avire brings a wealth of experience to the squad. The 27-year-old striker scored 15 goals last season and will add significant firepower to the attack.' },
  { id: 'n3', title: 'Youth Academy Produces Three New First-Team Players', news_date: '2026-05-15', excerpt: 'Three academy graduates have been promoted to the first team after impressing in the reserve league.', photo: '/images/team 2.png', content: 'The Fosa Ascoli youth academy continues to bear fruit. The three youngsters, aged 18-20, have been training with the first team since pre-season.' },
  { id: 'n4', title: 'Community Football Tournament a Huge Success', news_date: '2026-05-10', excerpt: 'Over 300 local children participated in the annual Fosa Ascoli community football tournament.', photo: '/images/field.png', content: 'The tournament, now in its fifth year, brought together young footballers from across the region for a day of competition and camaraderie.' },
  { id: 'n5', title: 'Match Report: Fosa Ascoli 2-0 Gor Mahia', news_date: '2026-05-05', excerpt: 'Goals from Olunga and Omondi secured a vital three points against the league leaders.', photo: '/images/team 1.png', content: 'In front of a packed stadium, Fosa Ascoli delivered one of their best performances of the season. Michael Olunga opened the scoring in the 23rd minute, and Kevin Omondi sealed the win with a stunning strike.' },
  { id: 'n6', title: 'Season Ticket Early Bird Offer Now Available', news_date: '2026-05-01', excerpt: 'Get your season tickets for the 2026/27 campaign at special early bird prices until June 30th.', photo: '/images/team 2.png', content: 'The club has announced early bird pricing for the upcoming season. Fans who purchase before June 30th will receive a 20% discount and priority access to cup matches.' },
]

const SEED_MATCHES = [
  { id: 'm1', homeTeam: 'Fosa Ascoli FC', awayTeam: 'Gor Mahia', matchDate: '2026-06-10', matchTime: '15:00' },
  { id: 'm2', homeTeam: 'Fosa Ascoli FC', awayTeam: 'Tusker FC', matchDate: '2026-06-17', matchTime: '16:00' },
  { id: 'm3', homeTeam: 'AFC Leopards', awayTeam: 'Fosa Ascoli FC', matchDate: '2026-06-24', matchTime: '15:00' },
  { id: 'm4', homeTeam: 'Fosa Ascoli FC', awayTeam: 'KCB FC', matchDate: '2026-07-01', matchTime: '16:00' },
  { id: 'm5', homeTeam: 'Bandari FC', awayTeam: 'Fosa Ascoli FC', matchDate: '2026-07-08', matchTime: '15:00' },
  { id: 'm6', homeTeam: 'Fosa Ascoli FC', awayTeam: 'Kakamega Homeboyz', matchDate: '2026-07-15', matchTime: '15:30' },
  { id: 'm7', homeTeam: 'Ulinzi Stars', awayTeam: 'Fosa Ascoli FC', matchDate: '2026-07-22', matchTime: '15:00' },
  { id: 'm8', homeTeam: 'Fosa Ascoli FC', awayTeam: 'Sofapaka', matchDate: '2026-07-29', matchTime: '16:00' },
]

const DEFAULT_STATS = { matchesPlayed: 26, matchesWon: 16, goalsScored: 48 }

function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [entered, setEntered] = useState(false)
  const [heroHover, setHeroHover] = useState(false)
  const [touchDevice, setTouchDevice] = useState(
    typeof window !== 'undefined' && (window.innerWidth <= 767 || 'ontouchstart' in window)
  )
  const intervalRef = useRef(null)

  useEffect(() => { const t = setTimeout(() => setEntered(true), 100); return () => clearTimeout(t) }, [])

  useEffect(() => {
    const check = () => setTouchDevice(window.innerWidth <= 767 || 'ontouchstart' in window)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const startAutoplay = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % HERO_IMAGES.length)
    }, 5000)
  }, [])

  const goTo = (i) => {
    setCurrent(i)
    clearInterval(intervalRef.current)
    startAutoplay()
  }

  const prev = () => goTo((current - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)
  const next = () => goTo((current + 1) % HERO_IMAGES.length)

  const showArrows = heroHover || touchDevice

  return (
    <section id="home" className="hero-section"
      onMouseEnter={() => setHeroHover(true)}
      onMouseLeave={() => setHeroHover(false)}
      style={{
      position: 'relative',
      height: '100dvh',
      minHeight: '500px',
      maxHeight: '760px',
      overflow: 'hidden',
      background: 'var(--surface-alt)',
    }}>
      {HERO_IMAGES.map((img, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          opacity: i === current ? 1 : 0,
          transition: 'opacity 1s ease, transform 7s ease',
          transform: i === current ? 'scale(1)' : 'scale(1.05)',
        }}>
          <img src={img.src} alt={img.alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ))}

      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(180deg, oklch(0% 0 0 / 0.5) 0%, oklch(0% 0 0 / 0.15) 35%, oklch(0% 0 0 / 0.75) 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        display: 'flex', alignItems: 'flex-end',
        padding: '0 0 3rem',
        animation: entered ? 'slideUp 0.8s ease 0.1s both' : 'none',
      }}>
        <div className="container" style={{
          animation: `slideUp 0.8s ease ${current * 0.1}s both`,
          width: '100%',
        }}>
          <span style={{
            display: 'inline-block', marginBottom: '0.75rem',
            padding: '0.35rem 0.75rem',
            fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)', fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase',
            background: 'var(--accent-yellow)', color: 'oklch(18% 0.02 50)',
            borderRadius: 4,
          }}>Fosa Ascoli FC</span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 7vw, 4.5rem)',
            fontWeight: 700, lineHeight: 1.05,
            color: '#fff', maxWidth: '14ch',
            marginBottom: '0.6rem',
            textShadow: '0 2px 20px oklch(0% 0 0 / 0.3)',
          }}>
            Pride of<br />Ascoli
          </h1>
          <p style={{
            fontSize: 'clamp(0.85rem, 2vw, 1.15rem)',
            color: 'oklch(85% 0.01 80)',
            maxWidth: '42ch', marginBottom: '1.25rem',
          }}>
            Latest news, squad updates, and match coverage — all in one place.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href="#matches" onClick={e => { e.preventDefault(); const el = document.getElementById('matches'); if (el) el.scrollIntoView({ behavior: 'smooth' }) }}
              className="btn btn-primary btn-lg"
              style={{ border: 'none' }}>
              View Fixtures
            </a>
            <a href="#news" onClick={e => { e.preventDefault(); const el = document.getElementById('news'); if (el) el.scrollIntoView({ behavior: 'smooth' }) }}
              className="btn btn-lg"
              style={{ background: 'transparent', border: '2px solid oklch(100% 0 0 / 0.3)', color: '#fff', backdropFilter: 'blur(4px)' }}>
              Latest News
            </a>
          </div>
        </div>
      </div>

      <div className="hero-controls" style={{
        position: 'absolute', bottom: '1.25rem', right: '1.25rem', zIndex: 3,
        display: 'flex', alignItems: 'center', gap: '0.75rem',
      }}>
        <button onClick={prev} className="hero-arrow hero-arrow-prev"
          aria-label="Previous slide"
          style={{ opacity: showArrows ? 1 : 0, transform: showArrows ? 'scale(1)' : 'scale(0.9)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {HERO_IMAGES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              style={{
                width: i === current ? 36 : 24, height: 3,
                borderRadius: 2, border: 'none',
                background: i === current ? 'var(--accent-yellow)' : 'oklch(100% 0 0 / 0.3)',
                transition: 'all 0.4s ease',
              }} />
          ))}
        </div>
        <button onClick={next} className="hero-arrow hero-arrow-next"
          aria-label="Next slide"
          style={{ opacity: showArrows ? 1 : 0, transform: showArrows ? 'scale(1)' : 'scale(0.9)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>

      <div className="scroll-indicator" style={{
        position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', zIndex: 3,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
        opacity: entered ? 1 : 0,
        transition: 'opacity 0.8s ease 1s',
      }}>
        <span style={{ fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'oklch(100% 0 0 / 0.5)' }}>Scroll</span>
        <div style={{ animation: 'bounceDown 2s ease-in-out infinite' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="oklch(100% 0 0 / 0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
          </svg>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: heroArrowCss}}></style>
    </section>
  )
}

const heroArrowCss = `@keyframes bounceDown {
  0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.7 }
  50% { transform: translateX(-50%) translateY(6px); opacity: 0.4 }
}
.hero-arrow {
  width: 48px; height: 48px;
  display: flex; align-items: center; justify-content: center;
  border: none; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent-hover));
  color: var(--surface);
  box-shadow: 0 4px 15px oklch(0% 0 0 / 0.3);
  cursor: pointer;
  transition: all 0.25s ease;
}
.hero-arrow:hover {
  transform: scale(1.1) !important;
  box-shadow: 0 6px 20px oklch(0% 0 0 / 0.4);
}
.hero-arrow:active {
  transform: scale(0.95) !important;
}
@media (max-width: 767px) {
  .hero-arrow {
    width: 40px; height: 40px;
  }
}`

function NewsSection() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    publicGet('/news').then(d => {
      const data = d && d.length > 0 ? d : SEED_NEWS
      setNews(data); setLoading(false)
    }).catch(() => { setNews(SEED_NEWS); setLoading(false) })
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="news" ref={sectionRef} className="section" style={{ background: 'var(--surface-alt)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">Club News</span>
          <h2 className="section-title">Latest Updates</h2>
          <p className="section-subtitle">Stay up to date with everything Fosa Ascoli FC</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>
        ) : (
          <div className="grid-3" style={{ animation: visible ? 'fadeIn 0.5s ease' : 'none' }}>
            {news.map((item, i) => (
              <article key={item.id} className="card" style={{
                overflow: 'hidden',
                animation: visible ? `slideUp 0.5s ease ${i * 0.08}s both` : 'none',
              }}>
                {item.photo ? (
                  <img src={item.photo} alt={item.title}
                    style={{ width: '100%', height: 220, objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--surface-alt)', color: 'var(--fg-subtle)',
                  }}>
                    {ICONS.news}
                  </div>
                )}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <time style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {formatDate(item.news_date)}
                  </time>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600,
                    lineHeight: 1.2, marginBottom: '0.5rem',
                  }}>{item.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--fg-muted)', lineHeight: 1.6, flex: 1 }}>{item.excerpt}</p>
                  {item.content && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--fg-subtle)', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>{item.content}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

const scrollBtnCss = '.scroll-btn{flex-shrink:0;width:48px;height:48px;display:flex;align-items:center;justify-content:center;border:2px solid var(--accent-yellow);border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent-hover));color:var(--surface);box-shadow:0 4px 15px var(--accent-dim);cursor:pointer;transition:all 0.25s ease;position:relative;z-index:5;opacity:0}.scroll-btn:hover{transform:scale(1.1);box-shadow:0 0 0 4px var(--accent-yellow-dim),0 6px 20px var(--accent-dim)}.players-scroll-wrap:hover .scroll-btn,.players-scroll-wrap:focus-within .scroll-btn{opacity:1}.scroll-btn-left:hover{transform:scale(1.1) translateX(-3px)}.scroll-btn-right:hover{transform:scale(1.1) translateX(3px)}@media(max-width:767px){.scroll-btn{display:none}}'

function PlayersSection() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedPlayer, setExpandedPlayer] = useState(null)
  const trackRef = useRef(null)
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    publicGet('/players').then(d => {
      const data = d && d.length > 0 ? d : SEED_PLAYERS
      setPlayers(data); setLoading(false)
    }).catch(() => { setPlayers(SEED_PLAYERS); setLoading(false) })
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const s = document.createElement('style')
    s.id = 'scroll-btn-css'
    s.textContent = scrollBtnCss
    document.head.appendChild(s)
    return () => { const e = document.getElementById('scroll-btn-css'); if (e) e.remove() }
  }, [])

  useEffect(() => {
    const s = document.createElement('style')
    s.id = 'player-scroll-css'
    s.textContent = `
      .players-track {
        scroll-snap-type: x mandatory !important;
        -webkit-overflow-scrolling: touch;
      }
      .player-card {
        flex: 0 0 calc((100% - 3rem) / 3) !important;
        min-width: 0 !important;
        scroll-snap-align: start !important;
      }
      @media (max-width: 1023px) {
        .player-card { flex: 0 0 calc((100% - 1.5rem) / 2) !important; }
      }
      @media (max-width: 767px) {
        .player-card { flex: 0 0 100% !important; }
        .players-track { gap: 0.75rem !important; }
      }
    `
    document.head.appendChild(s)
    return () => { const e = document.getElementById('player-scroll-css'); if (e) e.remove() }
  }, [])

  const scroll = (dir) => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: dir * trackRef.current.clientWidth, behavior: 'smooth' })
    }
  }

  return (
    <section id="players" ref={sectionRef} className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Squad</span>
          <h2 className="section-title">Our Players</h2>
          <p className="section-subtitle">Meet the 2025/26 Fosa Ascoli FC squad</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>
        ) : (
          <div className="players-scroll-wrap" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
            <button onClick={() => scroll(-1)} className="scroll-btn scroll-btn-left"
              aria-label="Scroll players left">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>

            <div ref={trackRef} className="players-track" style={{
              display: 'flex', gap: '1.5rem', overflowX: 'auto', flex: 1,
              scrollBehavior: 'smooth', padding: '0.5rem 0.25rem 1rem',
              scrollbarWidth: 'thin', scrollbarColor: 'var(--accent) transparent',
            }}>
              {players.map((p, i) => (
                <article key={p.id} className="card player-card" style={{
                  overflow: 'hidden',
                  animation: visible ? `slideUp 0.5s ease ${i * 0.06}s both` : 'none',
                }}>
                  <div style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                    onClick={() => setExpandedPlayer(p)}>
                    {p.photo ? (
                      <img src={p.photo} alt={p.name}
                        style={{ width: '100%', height: 320, objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        className="player-hover-zoom" />
                    ) : (
                      <div style={{
                        height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--surface-alt)', color: 'var(--fg-subtle)',
                      }}>
                        {ICONS.user}
                      </div>
                    )}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(180deg, transparent 50%, var(--surface) 100%)',
                      pointerEvents: 'none',
                    }} />
                  </div>
                  <div style={{ padding: '1.25rem 1.35rem 1.5rem', marginTop: '-2rem', position: 'relative', zIndex: 1 }}>
                    <h3 style={{
                      fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 600,
                      lineHeight: 1.15, marginBottom: '0.3rem',
                    }}>{p.name}</h3>
                    <span className="badge" style={{ marginBottom: '0.75rem' }}>{p.position}</span>
                    <div style={{
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem',
                      paddingTop: '0.75rem', borderTop: '1px solid var(--border)',
                      marginBottom: '0.75rem',
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 600, color: 'var(--accent)', lineHeight: 1 }}>{p.goals ?? 0}</span>
                        <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>Goals</span>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 600, color: 'var(--accent)', lineHeight: 1 }}>{p.assists ?? 0}</span>
                        <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>Assists</span>
                      </div>
                    </div>
                    {p.comment && <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', lineHeight: 1.5 }}>{p.comment}</p>}
                  </div>
                </article>
              ))}
            </div>

            <button onClick={() => scroll(1)} className="scroll-btn scroll-btn-right"
              aria-label="Scroll players right">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        )}
      </div>

      {expandedPlayer && (
        <div onClick={() => setExpandedPlayer(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'oklch(0% 0 0 / 0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem', cursor: 'pointer', animation: 'fadeIn 0.25s ease',
          }}>
          <div onClick={e => e.stopPropagation()} style={{
            maxWidth: 600, width: '100%', borderRadius: 16, overflow: 'hidden',
            boxShadow: '0 20px 60px oklch(0% 0 0 / 0.5)',
            animation: 'slideUp 0.3s ease',
          }}>
            {expandedPlayer.photo ? (
              <img src={expandedPlayer.photo} alt={expandedPlayer.name}
                style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', display: 'block', background: 'var(--surface-alt)' }} />
            ) : (
              <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-alt)', color: 'var(--fg-subtle)' }}>
                {ICONS.user}
              </div>
            )}
            <div style={{ padding: '1.25rem 1.5rem', background: 'var(--surface)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 600, marginBottom: '0.15rem' }}>{expandedPlayer.name}</h3>
              <span className="badge">{expandedPlayer.position}</span>
              <div style={{ display: 'flex', gap: '2rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                <div><span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>Goals</span><br /><span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 600, color: 'var(--accent)' }}>{expandedPlayer.goals ?? 0}</span></div>
                <div><span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>Assists</span><br /><span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 600, color: 'var(--accent)' }}>{expandedPlayer.assists ?? 0}</span></div>
              </div>
              {expandedPlayer.comment && <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', marginTop: '0.75rem' }}>{expandedPlayer.comment}</p>}
            </div>
            <button onClick={() => setExpandedPlayer(null)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'oklch(0% 0 0 / 0.4)', border: 'none', color: '#fff', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
              {ICONS.close}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

function MatchesSection() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    publicGet('/matches').then(d => {
      const data = d && d.length > 0 ? d : SEED_MATCHES
      setMatches(data); setLoading(false)
    }).catch(() => { setMatches(SEED_MATCHES); setLoading(false) })
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="matches" ref={sectionRef} className="section" style={{ background: 'var(--surface-alt)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">Fixtures</span>
          <h2 className="section-title">Upcoming Matches</h2>
          <p className="section-subtitle">Catch Fosa Ascoli FC in action</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>
        ) : (
          <div className="grid-3">
            {matches.map((m, i) => (
              <article key={m.id} className="card" style={{
                overflow: 'hidden',
                animation: visible ? `slideUp 0.5s ease ${i * 0.08}s both` : 'none',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.6rem 1.25rem',
                  background: 'linear-gradient(90deg, var(--accent-dim), var(--accent-yellow-dim))',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                    {ICONS.shield} League Fixture
                  </span>
                </div>
                <div style={{ padding: '1.75rem 1.25rem' }}>
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1rem',
                    marginBottom: '1.25rem',
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center' }}>
                      {m.homeLogo ? (
                        <img src={m.homeLogo} alt={m.homeTeam}
                          style={{ width: 64, height: 64, objectFit: 'contain', padding: '0.35rem', background: '#fff', borderRadius: 6, boxShadow: '0 2px 8px oklch(0% 0 0 / 0.08)' }} />
                      ) : <div style={{ width: 64, height: 64, borderRadius: 6, background: 'var(--surface-alt)' }} />}
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.03em', lineHeight: 1.2 }}>{m.homeTeam}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-yellow)', letterSpacing: '0.06em' }}>VS</span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center' }}>
                      {m.awayLogo ? (
                        <img src={m.awayLogo} alt={m.awayTeam}
                          style={{ width: 64, height: 64, objectFit: 'contain', padding: '0.35rem', background: '#fff', borderRadius: 6, boxShadow: '0 2px 8px oklch(0% 0 0 / 0.08)' }} />
                      ) : <div style={{ width: 64, height: 64, borderRadius: 6, background: 'var(--surface-alt)' }} />}
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.03em', lineHeight: 1.2 }}>{m.awayTeam}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.85rem', fontSize: '0.8rem', fontWeight: 500, color: 'var(--fg-muted)', background: 'var(--surface-alt)', borderRadius: 6, border: '1px solid var(--border)' }}>
                      {ICONS.calendar} {m.matchDate}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.85rem', fontSize: '0.8rem', fontWeight: 500, color: 'var(--fg-muted)', background: 'var(--surface-alt)', borderRadius: 6, border: '1px solid var(--border)' }}>
                      {ICONS.clock} {formatTime(m.matchTime)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function StatsSection() {
  const [stats, setStats] = useState({ matchesPlayed: 0, matchesWon: 0, goalsScored: 0 })
  const [loading, setLoading] = useState(true)
  const [animated, setAnimated] = useState(false)
  const [counts, setCounts] = useState({ matchesPlayed: 0, matchesWon: 0, goalsScored: 0 })
  const sectionRef = useRef(null)

  useEffect(() => {
    publicGet('/stats').then(d => {
      const data = d || DEFAULT_STATS
      setStats(data); setLoading(false)
    }).catch(() => { setStats(DEFAULT_STATS); setLoading(false) })
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setAnimated(true); obs.disconnect() }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!animated || loading) return
    const duration = 1500
    const steps = 30
    const interval = duration / steps
    const targets = { matchesPlayed: parseInt(stats.matchesPlayed) || 0, matchesWon: parseInt(stats.matchesWon) || 0, goalsScored: parseInt(stats.goalsScored) || 0 }
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = Math.min(step / steps, 1)
      setCounts({
        matchesPlayed: Math.round(targets.matchesPlayed * progress),
        matchesWon: Math.round(targets.matchesWon * progress),
        goalsScored: Math.round(targets.goalsScored * progress),
      })
      if (step >= steps) clearInterval(timer)
    }, interval)
    return () => clearInterval(timer)
  }, [animated, loading, stats])

  const statItems = [
    { key: 'matchesPlayed', label: 'Matches Played', icon: ICONS.stadium },
    { key: 'matchesWon', label: 'Wins', icon: ICONS.trophy },
    { key: 'goalsScored', label: 'Goals Scored', icon: ICONS.goal },
  ]

  return (
    <section id="stats" ref={sectionRef} className="section" style={{ background: 'var(--surface-alt)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">Season</span>
          <h2 className="section-title">Club Statistics</h2>
          <p className="section-subtitle">2025/26 season overview</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>
        ) : (
          <div className="grid-3" style={{ maxWidth: 900, margin: '0 auto' }}>
            {statItems.map((item, i) => (
              <div key={item.key} className="card" style={{
                padding: '2.5rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
                animation: animated ? `slideUp 0.5s ease ${i * 0.1}s both` : 'none',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--accent), var(--accent-yellow))' }} />
                <div style={{ color: 'var(--accent-yellow)', marginBottom: '0.75rem' }}>
                  {item.icon}
                </div>
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.75rem, 5vw, 3.75rem)',
                  fontWeight: 700, lineHeight: 1,
                  color: 'var(--fg)', marginBottom: '0.5rem',
                }}>
                  {counts[item.key]}
                </span>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>{item.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function GallerySection() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <section id="gallery" ref={sectionRef} className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Moments</span>
            <h2 className="section-title">Club Gallery</h2>
            <p className="section-subtitle">Memorable moments from the season</p>
          </div>

          <div className="grid-3">
            {GALLERY_IMAGES.map((img, i) => (
              <button key={i} onClick={() => setLightbox(i)}
                className="card" style={{
                  overflow: 'hidden', border: 'none', padding: 0, display: 'block',
                  animation: visible ? `slideUp 0.5s ease ${i * 0.08}s both` : 'none',
                }}>
                <img src={img.src} alt={img.alt}
                  style={{ width: '100%', height: 280, objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  className="player-hover-zoom" />
                <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {ICONS.photo}
                  <span style={{ fontSize: '0.85rem', color: 'var(--fg-muted)' }}>{img.alt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox !== null && (
        <div onClick={() => setLightbox(null)} style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'oklch(0% 0 0 / 0.9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem', cursor: 'pointer',
          animation: 'fadeIn 0.2s ease',
        }}>
          <button onClick={(e) => { e.stopPropagation(); setLightbox(null) }}
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'oklch(100% 0 0 / 0.1)', border: 'none', borderRadius: '50%', width: 44, height: 44, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            {ICONS.close}
          </button>
          <img src={GALLERY_IMAGES[lightbox].src} alt={GALLERY_IMAGES[lightbox].alt}
            style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 8 }} />
        </div>
      )}
    </>
  )
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const scrollYRef = useRef(0)

  const closeAndScroll = useCallback((id) => {
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    setMobileOpen(false)
    requestAnimationFrame(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    })
  }, [])

  const scrollToSection = useCallback((e, id) => {
    e.preventDefault()
    if (window.history && window.history.pushState) {
      window.history.replaceState(null, '', window.location.pathname)
    }
    closeAndScroll(id)
  }, [closeAndScroll])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    if (mobileOpen) {
      scrollYRef.current = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollYRef.current}px`
      document.body.style.width = '100%'
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    } else {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      transition: 'background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease',
      background: scrolled ? 'var(--nav-bg)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      boxShadow: scrolled ? '0 1px 0 var(--border)' : 'none',
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: scrolled ? 64 : 72, transition: 'height 0.3s ease',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/images/logo.png" alt="Fosa Ascoli FC crest"
            style={{ width: scrolled ? 44 : 52, height: scrolled ? 44 : 52, objectFit: 'contain', transition: 'width 0.3s ease, height 0.3s ease', filter: 'drop-shadow(0 0 8px oklch(0% 0 0 / 0.3))', borderRadius: 4 }} />
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.04em', lineHeight: 1.15, display: 'block' }}>
              Fosa Ascoli FC
            </span>
            {!scrolled && (
              <span style={{ fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)', display: 'block' }}>
                Official Website
              </span>
            )}
          </div>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <div className="mobile-nav" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'var(--surface)', flexDirection: 'column',
            padding: '5rem 1.5rem 2rem', zIndex: 1001,
            gap: '0.25rem', alignItems: 'stretch',
            overflowY: 'auto', WebkitOverflowScrolling: 'touch',
            display: mobileOpen ? 'flex' : 'none',
          }}>
            <button onClick={() => setMobileOpen(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: 'var(--fg)' }}>
              {ICONS.close}
            </button>
            {NAV_ITEMS.map(item => (
              <a key={item.id} href={`#${item.id}`} onClick={e => scrollToSection(e, item.id)}
                style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--fg-muted)', borderRadius: 8, transition: 'all 0.2s ease' }}>
                {item.label}
              </a>
            ))}
            <Link to="/login"
              className="btn btn-primary" style={{ marginTop: '0.5rem', textAlign: 'center' }}>
              Admin Login
            </Link>
          </div>

          <div className="desktop-nav" style={{ flexDirection: 'row', gap: '0.25rem', display: 'none' }}>
            {NAV_ITEMS.map(item => (
              <a key={item.id} href={`#${item.id}`} onClick={e => scrollToSection(e, item.id)}
                style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem', fontWeight: 500, color: scrolled ? 'var(--fg-muted)' : 'oklch(90% 0.01 80)', borderRadius: 6, transition: 'all 0.2s ease' }}>
                {item.label}
              </a>
            ))}
          </div>

          <Link to="/login" className="desktop-only-admin"
            style={{ display: 'none', alignItems: 'center', gap: '0.4rem' }}>
            {' '}{ICONS.shield} Admin
          </Link>

          <button onClick={() => setMobileOpen(true)}
            className="mobile-toggle"
            style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: 8, color: scrolled ? 'var(--fg)' : '#fff', cursor: 'pointer' }}>
            {ICONS.menu}
          </button>
        </nav>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .mobile-nav, .mobile-toggle { display: none !important }
          .desktop-nav { display: flex !important }
          .desktop-only-admin {
            display: inline-flex !important;
            padding: 0.5rem 1rem !important;
            font-size: 0.8rem !important;
            font-weight: 600 !important;
            border-radius: 8px !important;
            background: var(--accent) !important;
            color: var(--surface) !important;
            transition: all 0.25s ease !important;
          }
          .desktop-only-admin:hover {
            background: var(--accent-hover) !important;
            transform: translateY(-1px);
          }
        }
        @media (max-width: 767px) {
          .desktop-only-admin { display: none !important }
        }
        .player-hover-zoom:hover { transform: scale(1.06) }
      `}</style>
    </header>
  )
}

function Footer() {
  return (
    <footer style={{ background: 'var(--bg)', color: 'var(--fg)', padding: '3rem 0 1.5rem' }}>
      <div className="container">
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr', gap: '2rem',
          paddingBottom: '2rem', borderBottom: '1px solid var(--border)',
          marginBottom: '1.5rem',
        }} className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img src="/images/logo.png" alt="Fosa Ascoli FC crest" style={{ width: 56, height: 56, objectFit: 'contain', filter: 'drop-shadow(0 0 8px oklch(0% 0 0 / 0.3))', borderRadius: 4 }} />
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.04em', display: 'block' }}>
                  Fosa Ascoli FC
                </span>
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>
                  Since 2010
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', maxWidth: 320, lineHeight: 1.6 }}>
              Fosa Ascoli Football Club — representing the heart of Kenyan football. 
              Dedicated to excellence, community, and the beautiful game.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {NAV_ITEMS.map(item => (
                <a key={item.id} href={`#${item.id}`} onClick={e => { e.preventDefault(); const el = document.getElementById(item.id); if (el) el.scrollIntoView({ behavior: 'smooth' }); if (window.history) window.history.replaceState(null, '', window.location.pathname) }}
                  style={{ fontSize: '0.85rem', color: 'var(--fg-muted)' }}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--fg-muted)' }}>
              <span>Ascoli, Kenya</span>
              <span>info@fosaascolifc.co.ke</span>
              <span>+254 700 000 000</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              {[ICONS.twitter, ICONS.instagram, ICONS.facebook, ICONS.youtube].map((icon, i) => (
                <a key={i} href="#" style={{ color: 'var(--fg-muted)' }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--fg-subtle)' }}>
          &copy; {new Date().getFullYear()} Fosa Ascoli FC. All rights reserved.
        </p>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .footer-grid { grid-template-columns: 2fr 1fr 1fr !important }
        }
      `}</style>
    </footer>
  )
}

export default function Home() {
  return (
    <div style={{ paddingTop: 0 }}>
      <Navbar />
      <HeroSlider />
      <NewsSection />
      <PlayersSection />
      <MatchesSection />
      <StatsSection />
      <GallerySection />
      <Footer />
    </div>
  )
}
