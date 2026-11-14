import { useState } from 'react'
import { Star } from 'lucide-react'

const KEY = 'daily-reports-v1'
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }

export default function Reports() {
  const [list] = useState(load)
  const [who, setWho] = useState('all')
  const [day, setDay] = useState('')

  const shown = list.filter((r) => (who === 'all' || r.role === who) && (!day || r.date === day))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Daily reports</h1>
        <div className="flex w-full gap-2 sm:w-auto">
          <input type="date" value={day} onChange={(e) => setDay(e.target.value)}            className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white p-2 text-slate-900" />
          <select value={who} onChange={(e) => setWho(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white p-2 text-slate-900">
            <option value="all">Everyone</option>
            <option value="faculty">Faculty</option>
            <option value="student">Students</option>
          </select>
        </div>
      </div>

      {shown.length === 0 && <p className="text-slate-500">No reports yet.</p>}

      {shown.map((r) => (
        <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-slate-900">
              {r.from} <span className="text-sm font-normal text-slate-500">
                ({r.role}{r.subject ? ` · ${r.subject}` : ''}{r.cls ? ` · Class ${r.cls}` : ''})
              </span>
            </p>
            <span className="text-xs text-slate-500">{r.date} · {r.hours} h</span>
          </div>
          <div className="mt-1 flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} size={16} className={n <= r.rating ? 'fill-gold-400 text-gold-400' : 'text-slate-300'} />
            ))}
          </div>
          <p className="mt-2 text-sm text-slate-800"><b>Topics:</b> {r.topics}</p>
          {r.notes && <p className="mt-1 text-sm text-slate-800"><b>Notes:</b> {r.notes}</p>}
          {r.tomorrow && <p className="mt-1 text-sm text-slate-800"><b>Next:</b> {r.tomorrow}</p>}
        </div>
      ))}
    </div>
  )
}