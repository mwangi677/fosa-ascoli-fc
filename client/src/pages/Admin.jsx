import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminRequest, publicGet } from '../lib/api'

const ICONS = {
  dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  news: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9"/><line x1="10" y1="8" x2="18" y2="8"/><line x1="10" y1="12" x2="16" y2="12"/><line x1="10" y1="16" x2="14" y2="16"/></svg>,
  calendar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  stats: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  trophy: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C5 4 6 3 8 3c1.5 0 3 1 3.42 3"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C19 4 18 3 16 3c-1.5 0-3 1-3.42 3"/><path d="M12 12v6"/><path d="M8 21h8"/><path d="M12 18a4 4 0 0 0 4-4H8a4 4 0 0 0 4 4z"/></svg>,
  photo: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  star: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  logout: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>,
  edit: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  arrowLeft: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  menu: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  upload: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  check: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  warning: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
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

const SECTIONS = [
  { id: 'overview', label: 'Dashboard', icon: ICONS.dashboard },
  { id: 'players', label: 'Players', icon: ICONS.users },
  { id: 'news', label: 'News', icon: ICONS.news },
  { id: 'matches', label: 'Matches', icon: ICONS.calendar },
  { id: 'stats', label: 'Statistics', icon: ICONS.stats },
  { id: 'gallery', label: 'Gallery', icon: ICONS.photo },
  { id: 'settings', label: 'Settings', icon: ICONS.settings },
]

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div style={{
      position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.85rem 1.25rem', borderRadius: 10,
      background: type === 'success' ? 'var(--accent)' : 'var(--error)',
      color: '#fff', fontSize: '0.875rem', fontWeight: 500,
      boxShadow: '0 8px 30px oklch(0% 0 0 / 0.2)',
      animation: 'slideUp 0.3s ease',
    }}>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', padding: 0, display: 'flex', cursor: 'pointer' }}>{ICONS.close}</button>
    </div>
  )
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div onClick={onCancel} style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      background: 'oklch(0% 0 0 / 0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem', cursor: 'pointer',
      animation: 'fadeIn 0.15s ease',
    }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{
        maxWidth: 400, width: '100%', padding: '2rem',
        animation: 'bounce-in 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', marginBottom: '0.75rem' }}>
          {ICONS.warning}
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--fg)' }}>Confirm</h3>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--fg-muted)', marginBottom: '1.5rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
          <button onClick={onConfirm} className="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  )
}

function FormModal({ title, children, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9997,
      background: 'oklch(0% 0 0 / 0.5)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '5rem 1.5rem 2rem', cursor: 'pointer',
      overflowY: 'auto', animation: 'fadeIn 0.15s ease',
    }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{
        maxWidth: 560, width: '100%', padding: '2rem',
        animation: 'slideUp 0.25s ease', cursor: 'default',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--fg-subtle)', cursor: 'pointer', padding: 4 }}>{ICONS.close}</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function OverviewTab({ stats, players, news, matches }) {
  const cards = [
    { label: 'Total Players', value: players.length, icon: ICONS.users, color: 'var(--accent)' },
    { label: 'News Articles', value: news.length, icon: ICONS.news, color: 'var(--accent-yellow)' },
    { label: 'Upcoming Matches', value: matches.length, icon: ICONS.calendar, color: 'var(--warning)' },
    { label: 'Goals This Season', value: parseInt(stats.goalsScored) || 0, icon: ICONS.stats, color: 'var(--success)' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>Dashboard Overview</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)' }}>Welcome back — here's your club at a glance</p>
      </div>

      <div className="admin-overview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {cards.map((c, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem', animation: `slideUp 0.3s ease ${i * 0.06}s both` }}>
            <div style={{ color: c.color, marginBottom: '0.75rem' }}>{c.icon}</div>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, lineHeight: 1, marginBottom: '0.25rem' }}>{c.value}</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--fg-muted)' }}>{c.label}</span>
        </div>
        ))}
      </div>

      <div className="admin-charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="card-flat" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {ICONS.news} Latest News
          </h4>
          {news.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--fg-subtle)' }}>No news yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {news.slice(0, 3).map(n => (
                <div key={n.id} style={{ fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 600 }}>{n.title}</span>
                  <span style={{ color: 'var(--fg-subtle)', marginLeft: '0.5rem' }}>{formatDate(n.news_date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card-flat" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {ICONS.calendar} Upcoming Fixtures
          </h4>
          {matches.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--fg-subtle)' }}>No matches scheduled</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {matches.slice(0, 3).map(m => (
                <div key={m.id} style={{ fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 600 }}>{m.homeTeam} vs {m.awayTeam}</span>
                  <span style={{ color: 'var(--fg-subtle)', marginLeft: '0.5rem' }}>{m.matchDate}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const SEED_NEWS = [
  { id: 'sn1', title: 'Fosa Ascoli Maintains Perfect Home Record', news_date: '2026-05-28', excerpt: 'A dominant 2-0 victory extends the club\'s unbeaten home streak to 12 matches in the FKF Premier League.', photo: '/images/field.png', content: 'Fosa Ascoli FC continued their impressive home form with a commanding performance at their home ground.' },
  { id: 'sn2', title: 'New Signing John Avire Joins Fosa Ascoli', news_date: '2026-05-20', excerpt: 'The club is delighted to announce the signing of forward John Avire on a three-year deal from Tusker FC.', photo: '/images/team 1.png', content: 'John Avire brings a wealth of experience to the squad.' },
  { id: 'sn3', title: 'Youth Academy Promotes Three Players', news_date: '2026-05-15', excerpt: 'Three academy graduates have been promoted to the first team after impressing in the reserve league.', photo: '/images/team 2.png', content: 'The Fosa Ascoli youth academy continues to bear fruit.' },
  { id: 'sn4', title: 'Community Football Tournament a Success', news_date: '2026-05-10', excerpt: 'Over 300 local children participated in the annual Fosa Ascoli community football tournament.', photo: '/images/field.png', content: 'The tournament brought together young footballers from across the region.' },
  { id: 'sn5', title: 'Match Report: Fosa Ascoli 2-0 Gor Mahia', news_date: '2026-05-05', excerpt: 'Goals from Olunga and Omondi secured a vital three points against the league leaders.', photo: '/images/team 1.png', content: 'In front of a packed stadium, Fosa Ascoli delivered one of their best performances of the season.' },
  { id: 'sn6', title: 'Season Ticket Early Bird Offer Available', news_date: '2026-05-01', excerpt: 'Get your season tickets for the 2026/27 campaign at special early bird prices.', photo: '/images/team 2.png', content: 'The club announced early bird pricing for the upcoming season.' },
]

const SEED_MATCHES = [
  { id: 'sm1', homeTeam: 'Fosa Ascoli FC', awayTeam: 'Gor Mahia', matchDate: '2026-06-10', matchTime: '15:00' },
  { id: 'sm2', homeTeam: 'Fosa Ascoli FC', awayTeam: 'Tusker FC', matchDate: '2026-06-17', matchTime: '16:00' },
  { id: 'sm3', homeTeam: 'AFC Leopards', awayTeam: 'Fosa Ascoli FC', matchDate: '2026-06-24', matchTime: '15:00' },
  { id: 'sm4', homeTeam: 'Fosa Ascoli FC', awayTeam: 'KCB FC', matchDate: '2026-07-01', matchTime: '16:00' },
  { id: 'sm5', homeTeam: 'Bandari FC', awayTeam: 'Fosa Ascoli FC', matchDate: '2026-07-08', matchTime: '15:00' },
  { id: 'sm6', homeTeam: 'Fosa Ascoli FC', awayTeam: 'Kakamega Homeboyz', matchDate: '2026-07-15', matchTime: '15:30' },
  { id: 'sm7', homeTeam: 'Ulinzi Stars', awayTeam: 'Fosa Ascoli FC', matchDate: '2026-07-22', matchTime: '15:00' },
  { id: 'sm8', homeTeam: 'Fosa Ascoli FC', awayTeam: 'Sofapaka', matchDate: '2026-07-29', matchTime: '16:00' },
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

function PlayersTab() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', position: 'Forward', goals: 0, assists: 0, comment: '' })
  const [photoFile, setPhotoFile] = useState(null)
  const [toast, setToast] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [editingPlayer, setEditingPlayer] = useState(null)
  const [editPhotoFile, setEditPhotoFile] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', position: 'Forward', photo: '', goals: '0', assists: '0', comment: '' })

  const loadPlayers = async () => {
    try { const d = await publicGet('/players'); setPlayers(d && d.length > 0 ? d : SEED_PLAYERS) } catch { setPlayers(SEED_PLAYERS) }
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try { const d = await publicGet('/players'); if (!cancelled) setPlayers(d && d.length > 0 ? d : SEED_PLAYERS) } catch { if (!cancelled) setPlayers(SEED_PLAYERS) }
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !photoFile) { setToast({ type: 'error', message: 'Name and photo required' }); return }
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    fd.append('photo', photoFile)
    try {
      await adminRequest('/players', { method: 'POST', body: fd })
      setToast({ type: 'success', message: 'Player added!' })
      setShowForm(false); setPhotoFile(null); setForm({ name: '', position: 'Forward', goals: 0, assists: 0, comment: '' })
      loadPlayers()
    } catch (err) { setToast({ type: 'error', message: err.message }) }
  }

  const handleDelete = async (id) => {
    try {
      await adminRequest(`/players/${id}`, { method: 'DELETE' })
      setToast({ type: 'success', message: 'Player deleted' })
      setConfirmDelete(null); loadPlayers()
    } catch (err) { setToast({ type: 'error', message: err.message }) }
  }

  const handleEdit = (p) => {
    setEditForm({
      name: p.name,
      position: p.position || 'Forward',
      photo: p.photo || '',
      goals: String(p.goals ?? 0),
      assists: String(p.assists ?? 0),
      comment: p.comment || '',
    })
    setEditPhotoFile(null)
    setEditingPlayer(p)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editForm.name) { setToast({ type: 'error', message: 'Name is required' }); return }
    try {
      const body = editPhotoFile ? (() => {
        const fd = new FormData()
        fd.append('name', editForm.name)
        fd.append('position', editForm.position)
        fd.append('goals', String(parseInt(editForm.goals) || 0))
        fd.append('assists', String(parseInt(editForm.assists) || 0))
        fd.append('comment', editForm.comment)
        fd.append('photo', editPhotoFile)
        return fd
      })() : JSON.stringify({
        name: editForm.name,
        position: editForm.position,
        goals: parseInt(editForm.goals) || 0,
        assists: parseInt(editForm.assists) || 0,
        comment: editForm.comment,
      })
      await adminRequest(`/players/${editingPlayer.id}`, { method: 'PATCH', body })
      setToast({ type: 'success', message: `Player updated: ${editForm.name}` })
      setEditingPlayer(null)
      setEditPhotoFile(null)
      setEditForm({ name: '', position: 'Forward', photo: '', goals: '0', assists: '0', comment: '' })
      loadPlayers()
    } catch (err) { setToast({ type: 'error', message: err.message }) }
  }

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {confirmDelete && <ConfirmModal message={confirmDelete.message} onConfirm={() => handleDelete(confirmDelete.id)} onCancel={() => setConfirmDelete(null)} />}
      {editingPlayer && (
        <FormModal title={`Edit Player: ${editingPlayer.name}`} onClose={() => { setEditingPlayer(null); setEditPhotoFile(null); setEditForm({ name: '', position: 'Forward', photo: '', goals: '0', assists: '0', comment: '' }) }}>
          <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label>Player Name</label>
              <input className="form-input" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} placeholder="e.g. John Kamau" />
            </div>
            <div className="form-group">
              <label>Position</label>
              <select className="form-input" value={editForm.position} onChange={e => setEditForm({ ...editForm, position: e.target.value })}>
                {['Goalkeeper', 'Defender', 'Midfielder', 'Forward'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Goals</label>
                <input type="number" className="form-input" value={editForm.goals} onChange={e => setEditForm({ ...editForm, goals: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Assists</label>
                <input type="number" className="form-input" value={editForm.assists} onChange={e => setEditForm({ ...editForm, assists: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Photo</label>
              {editForm.photo && !editPhotoFile && (
                <div style={{ marginBottom: '0.5rem', position: 'relative', display: 'inline-block' }}>
                  <img src={editForm.photo} alt="Current" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }} />
                  <span style={{ position: 'absolute', bottom: 4, left: 4, fontSize: '0.6rem', fontWeight: 600, background: 'var(--surface)', padding: '0.15rem 0.4rem', borderRadius: 4, border: '1px solid var(--border)' }}>Current</span>
                </div>
              )}
              {editPhotoFile && (
                <div style={{ marginBottom: '0.5rem', position: 'relative', display: 'inline-block' }}>
                  <img src={URL.createObjectURL(editPhotoFile)} alt="New" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }} />
                  <span style={{ position: 'absolute', bottom: 4, left: 4, fontSize: '0.6rem', fontWeight: 600, background: 'var(--accent)', color: 'var(--surface)', padding: '0.15rem 0.4rem', borderRadius: 4 }}>New</span>
                </div>
              )}
              <input type="file" accept="image/*" className="form-input" style={{ padding: '0.5rem' }} onChange={e => setEditPhotoFile(e.target.files[0])} />
            </div>
            <div className="form-group">
              <label>Comment / Bio</label>
              <textarea className="form-input" value={editForm.comment} onChange={e => setEditForm({ ...editForm, comment: e.target.value })} placeholder="Short bio..." />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>{ICONS.check} Update Player</button>
          </form>
        </FormModal>
      )}
      {showForm && (
        <FormModal title="Add Player" onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label>Player Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. John Kamau" />
            </div>
            <div className="form-group">
              <label>Position</label>
              <select className="form-input" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}>
                {['Goalkeeper', 'Defender', 'Midfielder', 'Forward'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Goals</label>
                <input type="number" className="form-input" value={form.goals} onChange={e => setForm({ ...form, goals: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Assists</label>
                <input type="number" className="form-input" value={form.assists} onChange={e => setForm({ ...form, assists: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Photo</label>
              <input type="file" accept="image/*" className="form-input" style={{ padding: '0.5rem' }} onChange={e => setPhotoFile(e.target.files[0])} />
            </div>
            <div className="form-group">
              <label>Comment</label>
              <textarea className="form-input" value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} placeholder="Short bio..." />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>{ICONS.plus} Add Player</button>
          </form>
        </FormModal>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>Manage Players</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)' }}>{players.length} players in squad</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">{ICONS.plus} Add Player</button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>
      ) : players.length === 0 ? (
        <div className="empty-state">{ICONS.users}<p>No players yet. Click "Add Player" to get started.</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {players.map(p => (
            <div key={p.id} className="card" style={{ overflow: 'hidden' }}>
              {p.photo ? (
                <img src={p.photo} alt={p.name} style={{ width: '100%', height: 240, objectFit: 'cover' }} />
              ) : (
                <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-alt)', color: 'var(--fg-subtle)' }}>{ICONS.users}</div>
              )}
              <div style={{ padding: '1rem 1.25rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '0.2rem' }}>{p.name}</h3>
                <span className="badge" style={{ marginBottom: '0.5rem' }}>{p.position}</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <span>Goals: <strong>{p.goals ?? 0}</strong></span>
                  <span>Assists: <strong>{p.assists ?? 0}</strong></span>
                </div>
                {p.comment && <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', marginBottom: '0.5rem' }}>{p.comment}</p>}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(p)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>{ICONS.edit} Edit</button>
                  <button onClick={() => setConfirmDelete({ id: p.id, message: `Delete ${p.name}?` })} className="btn btn-danger btn-sm" style={{ flex: 1 }}>{ICONS.trash} Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function NewsTab() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', newsDate: '', excerpt: '', content: '' })
  const [photoFile, setPhotoFile] = useState(null)
  const [toast, setToast] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const loadNews = async () => {
    try { const d = await publicGet('/news'); setNews(d && d.length > 0 ? d : SEED_NEWS) } catch { setNews(SEED_NEWS) }
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try { const d = await publicGet('/news'); if (!cancelled) setNews(d && d.length > 0 ? d : SEED_NEWS) } catch { if (!cancelled) setNews(SEED_NEWS) }
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.excerpt || !form.newsDate) { setToast({ type: 'error', message: 'Title, date, and summary required' }); return }
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (photoFile) fd.append('photo', photoFile)
    try {
      await adminRequest('/news', { method: 'POST', body: fd })
      setToast({ type: 'success', message: 'News published!' })
      setShowForm(false); setPhotoFile(null); setForm({ title: '', newsDate: '', excerpt: '', content: '' })
      loadNews()
    } catch (err) { setToast({ type: 'error', message: err.message }) }
  }

  const handleDelete = async (id) => {
    try {
      await adminRequest(`/news/${id}`, { method: 'DELETE' })
      setToast({ type: 'success', message: 'News deleted' })
      setConfirmDelete(null); loadNews()
    } catch (err) { setToast({ type: 'error', message: err.message }) }
  }

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {confirmDelete && <ConfirmModal message={confirmDelete.message} onConfirm={() => handleDelete(confirmDelete.id)} onCancel={() => setConfirmDelete(null)} />}
      {showForm && (
        <FormModal title="Publish News" onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label>Title</label>
              <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Headline" />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" className="form-input" value={form.newsDate} onChange={e => setForm({ ...form, newsDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Summary</label>
              <textarea className="form-input" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Short summary for homepage" rows={3} />
            </div>
            <div className="form-group">
              <label>Full Content (optional)</label>
              <textarea className="form-input" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Full article..." rows={4} />
            </div>
            <div className="form-group">
              <label>Featured Image</label>
              <input type="file" accept="image/*" className="form-input" style={{ padding: '0.5rem' }} onChange={e => setPhotoFile(e.target.files[0])} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>{ICONS.plus} Publish</button>
          </form>
        </FormModal>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>Manage News</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)' }}>{news.length} articles</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">{ICONS.plus} Publish News</button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>
      ) : news.length === 0 ? (
        <div className="empty-state">{ICONS.news}<p>No articles yet.</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {news.map(item => (
            <article key={item.id} className="card" style={{ overflow: 'hidden' }}>
              {item.photo ? (
                <img src={item.photo} alt={item.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
              ) : (
                <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-alt)', color: 'var(--fg-subtle)' }}>{ICONS.news}</div>
              )}
              <div style={{ padding: '1.25rem' }}>
                <time style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{formatDate(item.news_date)}</time>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', margin: '0.5rem 0' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', marginBottom: '0.75rem' }}>{item.excerpt}</p>
                <button onClick={() => setConfirmDelete({ id: item.id, message: `Delete "${item.title}"?` })} className="btn btn-danger btn-sm" style={{ width: '100%' }}>{ICONS.trash} Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function MatchesTab() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ homeTeam: '', awayTeam: '', matchDate: '', matchTime: '' })
  const [homeLogo, setHomeLogo] = useState(null)
  const [awayLogo, setAwayLogo] = useState(null)
  const [toast, setToast] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const loadMatches = async () => {
    try { const d = await publicGet('/matches'); setMatches(d && d.length > 0 ? d : SEED_MATCHES) } catch { setMatches(SEED_MATCHES) }
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try { const d = await publicGet('/matches'); if (!cancelled) setMatches(d && d.length > 0 ? d : SEED_MATCHES) } catch { if (!cancelled) setMatches(SEED_MATCHES) }
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.homeTeam || !form.awayTeam || !homeLogo || !awayLogo) {
      setToast({ type: 'error', message: 'All fields and both logos required' }); return
    }
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    fd.append('homeLogo', homeLogo); fd.append('awayLogo', awayLogo)
    try {
      await adminRequest('/matches', { method: 'POST', body: fd })
      setToast({ type: 'success', message: 'Match added!' })
      setShowForm(false); setHomeLogo(null); setAwayLogo(null)
      setForm({ homeTeam: '', awayTeam: '', matchDate: '', matchTime: '' })
      loadMatches()
    } catch (err) { setToast({ type: 'error', message: err.message }) }
  }

  const handleDelete = async (id) => {
    try {
      await adminRequest(`/matches/${id}`, { method: 'DELETE' })
      setToast({ type: 'success', message: 'Match deleted' })
      setConfirmDelete(null); loadMatches()
    } catch (err) { setToast({ type: 'error', message: err.message }) }
  }

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {confirmDelete && <ConfirmModal message={confirmDelete.message} onConfirm={() => handleDelete(confirmDelete.id)} onCancel={() => setConfirmDelete(null)} />}
      {showForm && (
        <FormModal title="Add Match" onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Home Team</label>
                <input className="form-input" value={form.homeTeam} onChange={e => setForm({ ...form, homeTeam: e.target.value })} placeholder="e.g. Fosa Ascoli FC" />
              </div>
              <div className="form-group">
                <label>Away Team</label>
                <input className="form-input" value={form.awayTeam} onChange={e => setForm({ ...form, awayTeam: e.target.value })} placeholder="e.g. Gor Mahia" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Date</label>
                <input type="date" className="form-input" value={form.matchDate} onChange={e => setForm({ ...form, matchDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input type="time" className="form-input" value={form.matchTime} onChange={e => setForm({ ...form, matchTime: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Home Logo</label>
                <input type="file" accept="image/*" className="form-input" style={{ padding: '0.5rem' }} onChange={e => setHomeLogo(e.target.files[0])} />
              </div>
              <div className="form-group">
                <label>Away Logo</label>
                <input type="file" accept="image/*" className="form-input" style={{ padding: '0.5rem' }} onChange={e => setAwayLogo(e.target.files[0])} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>{ICONS.plus} Add Match</button>
          </form>
        </FormModal>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>Manage Matches</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)' }}>{matches.length} fixtures</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">{ICONS.plus} Add Match</button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>
      ) : matches.length === 0 ? (
        <div className="empty-state">{ICONS.calendar}<p>No matches scheduled.</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {matches.map(m => (
            <div key={m.id} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', flex: 1, textAlign: 'center' }}>
                  {m.homeLogo ? <img src={m.homeLogo} alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} /> : <div style={{ width: 48, height: 48, borderRadius: 6, background: 'var(--surface-alt)' }} />}
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{m.homeTeam}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--accent-yellow)' }}>VS</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', flex: 1, textAlign: 'center' }}>
                  {m.awayLogo ? <img src={m.awayLogo} alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} /> : <div style={{ width: 48, height: 48, borderRadius: 6, background: 'var(--surface-alt)' }} />}
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{m.awayTeam}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--fg-muted)' }}>
                <span>{m.matchDate}</span>
                <span>{formatTime(m.matchTime)}</span>
              </div>
              <button onClick={() => setConfirmDelete({ id: m.id, message: `Delete ${m.homeTeam} vs ${m.awayTeam}?` })} className="btn btn-danger btn-sm" style={{ width: '100%' }}>{ICONS.trash} Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatsTab() {
  const [stats, setStats] = useState({ matchesPlayed: 0, matchesWon: 0, goalsScored: 0 })
  const [form, setForm] = useState({ matchesPlayed: '', matchesWon: '', goalsScored: '' })
  const [toast, setToast] = useState(null)

  useEffect(() => {
    publicGet('/stats').then(d => { if (d) { setStats(d); setForm({ matchesPlayed: d.matchesPlayed || '', matchesWon: d.matchesWon || '', goalsScored: d.goalsScored || '' }) } }).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await adminRequest('/stats', { method: 'PATCH', body: JSON.stringify(form) })
      setToast({ type: 'success', message: 'Stats updated!' })
      setStats({ matchesPlayed: parseInt(form.matchesPlayed) || 0, matchesWon: parseInt(form.matchesWon) || 0, goalsScored: parseInt(form.goalsScored) || 0 })
    } catch (e) { setToast({ type: 'error', message: e.message }) }
  }

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>Season Statistics</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)' }}>Current: {stats.matchesPlayed} played, {stats.matchesWon} wins, {stats.goalsScored} goals</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Matches Played', value: stats.matchesPlayed },
          { label: 'Wins', value: stats.matchesWon },
          { label: 'Goals Scored', value: stats.goalsScored },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent)', lineHeight: 1, marginBottom: '0.25rem' }}>{s.value}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="card-flat" style={{ padding: '1.5rem', maxWidth: 500 }}>
        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', marginBottom: '1rem' }}>Update Statistics</h4>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>Matches Played</label>
            <input type="number" className="form-input" value={form.matchesPlayed} onChange={e => setForm({ ...form, matchesPlayed: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Matches Won</label>
            <input type="number" className="form-input" value={form.matchesWon} onChange={e => setForm({ ...form, matchesWon: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Goals Scored</label>
            <input type="number" className="form-input" value={form.goalsScored} onChange={e => setForm({ ...form, goalsScored: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>{ICONS.check} Update Stats</button>
        </form>
      </div>
    </div>
  )
}

function GalleryTab() {
  const [toast, setToast] = useState(null)
  const [gallery, setGallery] = useState([
    { src: '/images/team 2.png', alt: 'Team squad' },
    { src: '/images/team 1.png', alt: 'Training' },
    { src: '/images/field.png', alt: 'Stadium' },
  ])

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setGallery(prev => [...prev, { src: url, alt: file.name }])
    setToast({ type: 'success', message: 'Image added to gallery' })
    e.target.value = ''
  }

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>Gallery</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--fg-muted)' }}>{gallery.length} images</p>
        </div>
        <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
          {ICONS.upload} Upload
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {gallery.map((img, i) => (
          <div key={i} className="card" style={{ overflow: 'hidden' }}>
            <img src={img.src} alt={img.alt} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
            <div style={{ padding: '0.75rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)' }}>{img.alt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsTab() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [toast, setToast] = useState(null)

  useEffect(() => {
    adminRequest('/account').then(r => {
      if (r.data?.username) setForm(prev => ({ ...prev, username: r.data.username }))
    }).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) { setToast({ type: 'error', message: 'Fill all fields' }); return }
    if (form.password.length < 6) { setToast({ type: 'error', message: 'Password must be 6+ characters' }); return }
    try {
      await adminRequest('/account', { method: 'PATCH', body: JSON.stringify({ newUsername: form.username, newPassword: form.password }) })
      setToast({ type: 'success', message: 'Account updated. Please log in again.' })
      setTimeout(() => {
        localStorage.removeItem('adminToken')
        window.location.href = '/login'
      }, 1500)
    } catch (e) { setToast({ type: 'error', message: e.message }) }
  }

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>Account Settings</h2>
      </div>

      <div className="card-flat" style={{ padding: '1.5rem', maxWidth: 480 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>Username</label>
            <input className="form-input" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="admin" />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" className="form-input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>{ICONS.settings} Update Account</button>
        </form>
      </div>
    </div>
  )
}

export default function Admin() {
  const [activeSection, setActiveSection] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [players, setPlayers] = useState([])
  const [news, setNews] = useState([])
  const [matches, setMatches] = useState([])
  const [stats, setStats] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [p, n, m, s] = await Promise.all([
          publicGet('/players'), publicGet('/news'), publicGet('/matches'), publicGet('/stats')
        ])
        if (!cancelled) {
          setPlayers(p && p.length > 0 ? p : SEED_PLAYERS)
          setNews(n && n.length > 0 ? n : SEED_NEWS)
          setMatches(m && m.length > 0 ? m : SEED_MATCHES)
          setStats(s || {})
        }
      } catch { /* ignore */ }
    })()
    return () => { cancelled = true }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/login')
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return <OverviewTab stats={stats} players={players} news={news} matches={matches} />
      case 'players': return <PlayersTab />
      case 'news': return <NewsTab />
      case 'matches': return <MatchesTab />
      case 'stats': return <StatsTab />
      case 'gallery': return <GalleryTab />
      case 'settings': return <SettingsTab />
      default: return <OverviewTab stats={stats} players={players} news={news} matches={matches} />
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-alt)' }}>
      <aside style={{
        width: sidebarOpen ? 260 : 0,
        overflow: 'hidden',
        transition: 'width 0.3s ease',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
      }} className="admin-sidebar">
        <div style={{ width: 260, padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <img src="/images/logo.png" alt="Fosa Ascoli FC crest" style={{ width: 40, height: 40, objectFit: 'contain', filter: 'drop-shadow(0 0 6px oklch(0% 0 0 / 0.3))', borderRadius: 4 }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600 }}>Fosa Admin</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--fg-subtle)', cursor: 'pointer', padding: 4 }}>{ICONS.close}</button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1 }}>
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => { setActiveSection(s.id); setSidebarOpen(false) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.65rem 0.85rem', fontSize: '0.85rem', fontWeight: activeSection === s.id ? 600 : 400,
                  border: 'none', borderRadius: 8,
                  background: activeSection === s.id ? 'var(--accent-dim)' : 'transparent',
                  color: activeSection === s.id ? 'var(--accent)' : 'var(--fg-muted)',
                  cursor: 'pointer', transition: 'all 0.15s ease', textAlign: 'left',
                }}>
                {s.icon} {s.label}
              </button>
            ))}
          </nav>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ width: '100%' }}>
              {ICONS.logout} Logout
            </button>
          </div>
        </div>
      </aside>

      <div style={{ flex: 1, marginLeft: sidebarOpen ? 260 : 0, transition: 'margin-left 0.3s ease', minWidth: 0 }}>
        <header style={{
          padding: '0.75rem 1.25rem', background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--fg)', cursor: 'pointer', padding: 4 }}>
                {ICONS.menu}
              </button>
            )}
            <span style={{ fontSize: '0.85rem', color: 'var(--fg-muted)' }}>
              {SECTIONS.find(s => s.id === activeSection)?.label || 'Dashboard'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--fg-subtle)' }}>Fosa Ascoli FC</span>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 700 }}>A</div>
          </div>
        </header>

        <main style={{ padding: '1.5rem' }}>
          {renderContent()}
        </main>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .admin-sidebar { width: 260px !important; position: fixed !important }
          .admin-sidebar + div { margin-left: 260px !important }
        }
        @media (max-width: 767px) {
          .admin-sidebar { position: fixed !important; z-index: 100 !important }
          .admin-overview-grid { grid-template-columns: repeat(2, 1fr) !important }
          .admin-charts-grid { grid-template-columns: 1fr !important }
          main { padding: 1rem !important }
        }
        @media (max-width: 480px) {
          .admin-overview-grid { grid-template-columns: 1fr !important }
        }
      `}</style>
    </div>
  )
}
