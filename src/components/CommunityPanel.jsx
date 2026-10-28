import { useState } from 'react'
import { students } from '../data/students'

function initials(name) {
  return name.split(' ').map((n) => n[0]).join('')
}

export default function CommunityPanel({ doubts }) {
  const [tab, setTab] = useState('helpers')

  // count accepted answers per person
  const counts = {}
  doubts.forEach((d) =>
    d.replies.forEach((r) => {
      if (r.accepted) counts[r.author] = (counts[r.author] || 0) + 1
    })
  )
  const helpers = Object.entries(counts)
    .map(([name, solved]) => ({ name, value: `${solved} solved` }))
    .sort((a, b) => parseInt(b.value) - parseInt(a.value))
    .slice(0, 5)

  const performers = [...students]
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 5)
    .map((s) => ({ name: s.name, value: `${s.avgScore}%` }))

  const list = tab === 'helpers' ? helpers : performers

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 text-sm font-medium">
        {[
          { key: 'helpers', label: 'Top solvers' },
          { key: 'performers', label: 'Top performers' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-lg px-2 py-1.5 transition ${
              tab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="mt-4 space-y-3">
        {list.map((p, i) => (
          <li key={p.name} className="flex items-center gap-3">
            <span className="w-4 text-sm font-semibold text-slate-400">{i + 1}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
              {initials(p.name)}
            </div>
            <span className="flex-1 text-sm font-medium">{p.name}</span>
            <span className="text-sm font-semibold text-indigo-600">{p.value}</span>
          </li>
        ))}
        {list.length === 0 && (
          <li className="text-sm text-slate-500">No solved doubts yet.</li>
        )}
      </ul>
    </div>
  )
}