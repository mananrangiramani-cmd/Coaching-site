import { useState } from 'react'
import { ClipboardCheck, X, Star } from 'lucide-react'
import { useUser } from '../context/UserContext'

const KEY = 'daily-reports-v1'
const today = () => new Date().toISOString().slice(0, 10)

export default function ReportFab() {
  const { currentUser, role, subject } = useUser()
  const name = typeof currentUser === 'string' ? currentUser : currentUser?.name
  const isFaculty = role === 'faculty'

  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [f, setF] = useState({
    subject: '', cls: '', hours: '', topics: '', rating: 0, notes: '', tomorrow: '',
  })

  if (role === 'admin') return null
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    if (!f.topics.trim() || !f.hours || !f.rating) return
    let all = []
    try { all = JSON.parse(localStorage.getItem(KEY)) || [] } catch {}
    all.unshift({
      id: Date.now(), date: today(), from: name, role,
      subject: isFaculty ? subject : f.subject.trim(),
      cls: f.cls, hours: f.hours, topics: f.topics.trim(), rating: f.rating,
      notes: f.notes.trim(), tomorrow: f.tomorrow.trim(),
    })
    localStorage.setItem(KEY, JSON.stringify(all))
    setF({ subject: '', cls: '', hours: '', topics: '', rating: 0, notes: '', tomorrow: '' })
    setSent(true)
    setTimeout(() => { setSent(false); setOpen(false) }, 1400)
  }

  const input = 'w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 sm:p-2'
  const label = 'mb-1 mt-3 block text-sm font-medium text-slate-700'

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Daily report"
        className="glow-btn fixed bottom-4 right-4 z-40 flex h-14 w-14 sm:bottom-5 sm:right-5 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gold-400 text-navy-900"
      >
        <ClipboardCheck size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <form onSubmit={submit} className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 pb-6 shadow-2xl sm:rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {isFaculty ? "Today's teaching report" : "Today's study report"}
                </h2>
                <p className="text-xs text-slate-500">{today()} · {name}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)}><X size={20} /></button>
            </div>

            {isFaculty ? (
              <>
                <label className={label}>Subject</label>
                <input className={input} value={subject || ''} disabled />
                <label className={label}>Class taught</label>
                <select className={input} value={f.cls} onChange={(e) => set('cls', e.target.value)}>
                  <option value="">Select class</option>
                  {[9, 10, 11, 12].map((c) => <option key={c} value={c}>Class {c}th</option>)}
                </select>
              </>
            ) : (
              <>
                <label className={label}>Subject(s) studied</label>
                <input className={input} value={f.subject} onChange={(e) => set('subject', e.target.value)} placeholder="e.g. Physics, Maths" />
              </>
            )}

            <label className={label}>{isFaculty ? 'Hours taught' : 'Hours studied'}</label>
            <input type="number" min="0" max="16" step="0.5" className={input}
              value={f.hours} onChange={(e) => set('hours', e.target.value)} />

            <label className={label}>{isFaculty ? 'Topics covered today' : 'Topics you studied'}</label>
            <textarea rows={2} className={input} value={f.topics} onChange={(e) => set('topics', e.target.value)} />

            <label className={label}>
              {isFaculty ? 'How well did the class understand?' : 'How well did you understand?'}
            </label>
            <div className="flex gap-2 sm:gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} onClick={() => set('rating', n)}>
                  <Star size={28} className={n <= f.rating ? 'fill-gold-400 text-gold-400' : 'text-slate-300'} />
                </button>
              ))}
            </div>

            <label className={label}>{isFaculty ? 'Student response / concerns' : 'Doubts or difficulties'}</label>
            <textarea rows={2} className={input} value={f.notes} onChange={(e) => set('notes', e.target.value)} />

            <label className={label}>{isFaculty ? 'Plan for next class' : "Plan for tomorrow"}</label>
            <textarea rows={2} className={input} value={f.tomorrow} onChange={(e) => set('tomorrow', e.target.value)} />

            <button type="submit" className="sticky bottom-0 mt-5 w-full rounded-xl bg-gold-400 py-3.5 text-base font-bold text-navy-900">
              {sent ? 'Report submitted ✓' : 'Submit daily report'}
            </button>
            <p className="mt-2 text-center text-xs text-slate-500">Hours, topics and a rating are required.</p>
          </form>
        </div>
      )}
    </>
  )
}