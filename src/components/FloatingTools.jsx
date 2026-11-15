import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Search, CheckCheck } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { initialAnnouncements } from '../data/announcements'
import CommandPalette from './CommandPalette'

const read = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb } catch { return fb } }

export default function FloatingTools() {
  const { role, currentUser, standard } = useUser()
  const name = typeof currentUser === 'string' ? currentUser : currentUser?.name
  const navigate = useNavigate()
  const [bellOpen, setBellOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [, force] = useState(0)
  const readKey = `notif-read-${name}`

  // Ctrl+K (or Cmd+K) opens search
  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  // notifications are built from data the app already has
  const items = []
  if (role === 'admin') {
    read('daily-reports-v1', []).slice(0, 5).forEach((r) =>
      items.push({ id: `r-${r.id}`, text: `${r.from} submitted a daily report`, sub: r.date, to: '/reports' }))
  }
  const today = new Date().toLocaleDateString('en-CA')
  read('events-v1', [])
    .filter((e) => e.date >= today && (role !== 'student' || e.standard === 'all' || Number(e.standard) === standard))
    .slice(0, 5)
    .forEach((e) => items.push({ id: `e-${e.id}`, text: `Class: ${e.subject} at ${e.time}`, sub: e.date, to: '/' }))
  read('announcements-v1', initialAnnouncements)
    .filter((a) => role !== 'student' || a.standard === 'all' || Number(a.standard) === standard)
    .slice(0, 5)
    .forEach((a) => items.push({ id: `a-${a.id}`, text: a.title, sub: a.date, to: '/' }))

  const readIds = read(readKey, [])
  const unread = items.filter((i) => !readIds.includes(i.id)).length

  const markRead = (ids) => {
    localStorage.setItem(readKey, JSON.stringify([...new Set([...readIds, ...ids])]))
    force((n) => n + 1)
  }

  const btn = 'flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg ring-1 ring-slate-200 transition hover:scale-105'

  return (
    <>
      <button onClick={() => setSearchOpen(true)} title="Search (Ctrl+K)"
        className={`${btn} fixed bottom-[9rem] right-4 z-40 sm:right-5`}>
        <Search size={20} />
      </button>

      <button onClick={() => setBellOpen((o) => !o)} title="Notifications"
        className={`${btn} fixed bottom-24 right-4 z-40 sm:right-5`}>
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {bellOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setBellOpen(false)} />
          <div className="page-enter fixed bottom-24 right-4 z-50 mr-14 max-h-[60vh] w-72 max-w-[calc(100vw-5rem)] overflow-y-auto rounded-2xl bg-white p-3 shadow-2xl sm:right-5 sm:w-80">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold text-slate-900">Notifications</p>
              {unread > 0 && (
                <button onClick={() => markRead(items.map((i) => i.id))}
                  className="flex items-center gap-1 text-xs font-medium text-indigo-600">
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
            </div>
            {items.length === 0 && <p className="p-3 text-center text-sm text-slate-500">You're all caught up.</p>}
            {items.map((i) => {
              const isNew = !readIds.includes(i.id)
              return (
                <button key={i.id}
                  onClick={() => { markRead([i.id]); setBellOpen(false); navigate(i.to) }}
                  className="flex w-full items-start gap-2 rounded-lg p-2 text-left hover:bg-slate-100">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${isNew ? 'bg-rose-500' : 'bg-transparent'}`} />
                  <span>
                    <span className="block text-sm text-slate-900">{i.text}</span>
                    <span className="text-xs text-slate-500">{i.sub}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </>
      )}

      {searchOpen && <CommandPalette onClose={() => setSearchOpen(false)} />}
    </>
  )
}