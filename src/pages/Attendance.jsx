import { useEffect, useState } from 'react'
import { CheckCircle2, Fingerprint, LogIn, LogOut, MessageCircle, Trash2 } from 'lucide-react'
import { students } from '../data/students'
import { parents } from '../data/parents'

function waLink(phone, text) {
  const digits = phone.replace(/\D/g, '')
  const number = digits.length === 10 ? '91' + digits : digits
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

function buildMessage(parent, student, type, ts) {
  const d = new Date(ts)
  const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  const date = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  const action = type === 'IN' ? 'has arrived at' : 'has left'
  return `Hello ${parent.name}, ${student.name.split(' ')[0]} ${action} XYZ Coaching at ${time} on ${date}.`
}

export default function Attendance() {
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('attendance-v1')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [studentId, setStudentId] = useState(students[0].id)

  useEffect(() => {
    localStorage.setItem('attendance-v1', JSON.stringify(events))
  }, [events])

  function punch(type) {
    const event = { id: Date.now(), studentId: Number(studentId), type, ts: Date.now(), notified: false }
    setEvents([event, ...events])
  }

  function markNotified(id) {
    setEvents(events.map((e) => (e.id === id ? { ...e, notified: true } : e)))
  }

  const today = new Date().toDateString()
  const todays = events.filter((e) => new Date(e.ts).toDateString() === today)

  // latest punch per student today (todays is newest first, so go oldest to newest)
  const lastPunch = {}
  todays
    .slice()
    .reverse()
    .forEach((e) => {
      lastPunch[e.studentId] = e.type
    })
  const inClass = Object.values(lastPunch).filter((t) => t === 'IN').length

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Attendance</h1>
          <p className="mt-1 text-slate-500">Fingerprint entry and exit log with parent alerts.</p>
        </div>
        {events.length > 0 && (
          <button
            onClick={() => setEvents([])}
            className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm text-slate-500 hover:bg-white hover:text-red-500"
          >
            <Trash2 size={16} /> Clear log
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold">{inClass}</p>
          <p className="text-sm text-slate-500">Students in class now</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold">{todays.length}</p>
          <p className="text-sm text-slate-500">Punches today</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold">{todays.filter((e) => e.notified).length}</p>
          <p className="text-sm text-slate-500">Parents notified</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <p className="flex items-center gap-2 font-semibold">
          <Fingerprint size={18} className="text-gold-500" /> Fingerprint machine (demo)
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Pretend a student touched the machine at the entrance. With a backend, this log fills itself.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => punch('IN')}
            className="flex items-center gap-1 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
          >
            <LogIn size={16} /> Punch in
          </button>
          <button
            onClick={() => punch('OUT')}
            className="flex items-center gap-1 rounded-xl bg-gold-400 px-4 py-2 text-sm font-medium text-navy-900 hover:bg-gold-300"
          >
            <LogOut size={16} /> Punch out
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {events.length === 0 && <p className="text-slate-500">No punches yet. Try Punch in above.</p>}
        {events.map((e) => {
          const student = students.find((s) => s.id === e.studentId)
          const parent = parents[e.studentId]
          if (!student || !parent) return null
          return (
            <div key={e.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                    e.type === 'IN' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  {e.type === 'IN' ? 'ENTERED' : 'LEFT'}
                </span>
                <div>
                  <p className="text-sm font-semibold">{student.name}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(e.ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} ·{' '}
                    Parent: {parent.name}, {parent.phone}
                  </p>
                </div>
              </div>
              {e.notified ? (
                <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                  <CheckCircle2 size={16} /> Parent notified
                </span>
              ) : (
                <a
                  href={waLink(parent.phone, buildMessage(parent, student, e.type, e.ts))}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => markNotified(e.id)}
                  className="flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
                >
                  <MessageCircle size={14} /> Notify parent
                </a>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}