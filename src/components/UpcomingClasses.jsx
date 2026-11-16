import { useState } from 'react'
import { CalendarDays, Trash2, Plus } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { classesOn } from '../utils/schedule'
import { users } from '../data/users'

const KEY = 'events-v1'
const DAYS = 14
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }
const keyOf = (d) => d.toLocaleDateString('en-CA') // YYYY-MM-DD in local time
const fmt = (t24) => {
  const [h, m] = t24.split(':').map(Number)
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}
const mins = (t) => {
  const m = t.match(/(\d+):(\d+) (AM|PM)/)
  return m ? ((+m[1] % 12) + (m[3] === 'PM' ? 12 : 0)) * 60 + +m[2] : 0
}

export default function UpcomingClasses() {
  const { role, standard } = useUser()
  const isStaff = role === 'admin' || role === 'faculty'
  const [sel, setSel] = useState(0)
  const [events, setEvents] = useState(load)
  const [adding, setAdding] = useState(false)
  const faculty = users.filter((u) => u.role === 'faculty')

  const days = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d
  })
  const [form, setForm] = useState({
    date: keyOf(days[0]), time: '16:00', subject: '', cls: 'all', faculty: '',
  })
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const save = (next) => { setEvents(next); localStorage.setItem(KEY, JSON.stringify(next)) }

  const add = (e) => {
    e.preventDefault()
    if (!form.subject.trim() || !form.date || !form.time) return
        const targets = form.cls === 'all' ? [9, 10, 11, 12] : [Number(form.cls)]
    save([
      ...events,
      ...targets.map((c, i) => ({
        id: Date.now() + i, date: form.date, time: fmt(form.time),
        subject: form.subject.trim(), standard: c, faculty: form.faculty,
      })),
    ])
    setForm((p) => ({ ...p, subject: '' }))
    setAdding(false)
  }

  const day = days[sel]
  const dayKey = keyOf(day)

  // regular weekly timetable: students get their class, staff get every class
  const classes = isStaff ? [9, 10, 11, 12] : [standard]
  const regular = classes.flatMap((s) =>
    classesOn(day, s).map((c) => ({ ...c, standard: s, key: `g-${s}-${c.time}` }))
  )
  // classes the admin added
  const added = events
    .filter((ev) => ev.date === dayKey)
        .filter((ev) => isStaff || Number(ev.standard) === standard)
    .map((ev) => ({ ...ev, key: ev.id, custom: true }))

  const list = [...regular, ...added].sort((a, b) => mins(a.time) - mins(b.time))

  const input = 'w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900'

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 font-semibold text-slate-900">
          <CalendarDays size={18} className="text-gold-500" /> Calendar
        </p>
        {role === 'admin' && (
          <button
            onClick={() => setAdding((v) => !v)}
            className="flex items-center gap-1 rounded-lg bg-gold-400 px-3 py-1 text-sm font-semibold text-navy-900"
          >
            <Plus size={14} /> Add class
          </button>
        )}
      </div>

      {role === 'admin' && adding && (
        <form onSubmit={add} className="mt-3 space-y-2 rounded-xl bg-slate-50 p-3">
          <div className="grid grid-cols-2 gap-2">
            <input type="date" className={input} value={form.date} min={keyOf(days[0])} max={keyOf(days[DAYS - 1])}
              onChange={(e) => set('date', e.target.value)} />
            <input type="time" className={input} value={form.time} onChange={(e) => set('time', e.target.value)} />
          </div>
          <input className={input} placeholder="Subject / title (e.g. Physics doubt class)"
            value={form.subject} onChange={(e) => set('subject', e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <select className={input} value={form.cls} onChange={(e) => set('cls', e.target.value)}>
              <option value="all">All classes</option>
              {[9, 10, 11, 12].map((c) => <option key={c} value={c}>Class {c}th</option>)}
            </select>
            <select className={input} value={form.faculty} onChange={(e) => set('faculty', e.target.value)}>
              <option value="">Faculty (optional)</option>
              {faculty.map((f) => <option key={f.name} value={f.name}>{f.name}</option>)}
            </select>
          </div>
          <button className="w-full rounded-lg bg-navy-900 py-2 font-semibold text-white">Add to calendar</button>
        </form>
      )}

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {days.map((d, i) => (
          <button
            key={i}
            onClick={() => setSel(i)}
            className={`flex min-w-[56px] flex-col items-center rounded-xl px-3 py-2 text-sm transition ${
              sel === i ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="text-xs">{i === 0 ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
            <span className="text-lg font-bold">{d.getDate()}</span>
            <span className="text-xs">{d.toLocaleDateString('en-IN', { month: 'short' })}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {list.length === 0 && <p className="text-sm text-slate-500">No classes this day.</p>}
        {list.map((c) => (
          <div key={c.key} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <span className="w-20 shrink-0 text-sm font-semibold text-navy-900">{c.time}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">{c.subject}</p>
              <p className="text-xs text-slate-500">
                {[c.faculty, isStaff || c.custom ? (c.standard === 'all' ? 'All classes' : `Class ${c.standard}th`) : '']
                  .filter(Boolean).join(' · ')}
              </p>
            </div>
            {c.custom && <span className="rounded-full bg-gold-400/30 px-2 py-0.5 text-xs text-slate-700">Added</span>}
            {c.custom && role === 'admin' && (
              <button onClick={() => save(events.filter((x) => x.id !== c.id))} title="Remove">
                <Trash2 size={15} className="text-slate-400 hover:text-rose-500" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}