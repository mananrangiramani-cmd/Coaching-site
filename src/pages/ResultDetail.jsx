import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, X, Minus } from 'lucide-react'
import { tests } from '../data/tests'
import { useUser } from '../context/UserContext'
import { loadResults } from '../utils/progress'

// if your tests.js names the correct option differently, add it here
const correctOf = (q) => q.answer ?? q.correct ?? q.correctIndex
const fmt = (s) => (s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`)
const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0)

function Tile({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-xl font-semibold text-slate-900">{value}</p>
    </div>
  )
}

export default function ResultDetail() {
  const { id } = useParams()
  const { role, currentUser, subject } = useUser()
  const name = typeof currentUser === 'string' ? currentUser : currentUser?.name

  const all = loadResults()
  const r = all.find((x) => String(x.id) === id)
  const test = r && tests.find((t) => t.id === r.testId)

  const back = (
    <Link to="/results" className="inline-flex items-center gap-1 text-sm text-slate-500">
      <ArrowLeft size={16} /> Back to results
    </Link>
  )
  const msg = (t) => (
    <div className="space-y-4">{back}<p className="rounded-xl bg-white p-6 text-slate-700">{t}</p></div>
  )

  if (!r || !test) return msg('Result not found.')
  if (role === 'student' && r.student !== name) return msg('This result is private to the student.')
  if (subject && test.subject !== subject) return msg('This result is outside your subject.')

  const rows = test.questions.map((q, i) => {
    const a = r.answers?.[i]
    const skipped = a === undefined || a === null || a === -1
    const ok = !skipped && String(a) === String(correctOf(q))
    return { i, q, a, skipped, ok, t: r.timeSpent?.[i] ?? null }
  })

  const total = rows.length
  const attempted = rows.filter((x) => !x.skipped).length
  const correct = rows.filter((x) => x.ok).length
  const accuracy = attempted ? Math.round((correct / attempted) * 100) : 0

  const hasTime = Array.isArray(r.timeSpent) && r.timeSpent.some((s) => s > 0)
  const times = rows.map((x) => x.t || 0)
  const sumT = times.reduce((x, y) => x + y, 0)
  const avgT = total ? sumT / total : 0
  const maxT = Math.max(...times, 1)

  // how the whole class did on each question
  const same = all.filter((x) => x.testId === r.testId)
  const classRate = (i) => {
    if (same.length === 0) return null
    const hit = same.filter((x) => {
      const a = x.answers?.[i]
      return a !== undefined && a !== null && String(a) === String(correctOf(test.questions[i]))
    }).length
    return Math.round((hit / same.length) * 100)
  }

  // insights
  const tips = []
  if (hasTime) {
    const slow = rows.reduce((m, x) => (x.t > m.t ? x : m), rows[0])
    const fast = rows.reduce((m, x) => (x.t < m.t ? x : m), rows[0])
    tips.push(`Slowest: Q${slow.i + 1} (${fmt(slow.t)}). Fastest: Q${fast.i + 1} (${fmt(fast.t)}).`)
    const okT = rows.filter((x) => x.ok).map((x) => x.t)
    const badT = rows.filter((x) => !x.ok && !x.skipped).map((x) => x.t)
    if (okT.length && badT.length)
      tips.push(`You spent ${fmt(Math.round(avg(okT)))} on right answers and ${fmt(Math.round(avg(badT)))} on wrong ones.`)
    const guesses = rows.filter((x) => !x.ok && !x.skipped && x.t < avgT * 0.4).length
    if (guesses) tips.push(`${guesses} wrong answer(s) were answered very fast. They may have been guesses.`)
    const stuck = rows.filter((x) => !x.ok && !x.skipped && x.t > avgT * 1.5).length
    if (stuck) tips.push(`${stuck} wrong answer(s) took much longer than average, so those topics need revision.`)
  }
  const easyMissed = rows.filter((x) => !x.ok && (classRate(x.i) ?? 0) >= 70)
  if (easyMissed.length)
    tips.push(`Most of the class got these right but you missed them: ${easyMissed.map((x) => 'Q' + (x.i + 1)).join(', ')}.`)
  if (total - attempted > 0) tips.push(`${total - attempted} question(s) were skipped.`)

  return (
    <div className="space-y-5">
      {back}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{r.title}</h1>
        <p className="text-sm text-slate-500">{r.student} · {r.date} · {test.subject}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Score" value={`${Math.round((r.score / r.total) * 100)}% (${r.score}/${r.total})`} />
        <Tile label="Accuracy" value={`${accuracy}% (${correct}/${attempted})`} />
        <Tile label="Attempted" value={`${attempted} of ${total}`} />
        <Tile label="Time" value={hasTime ? `${fmt(Math.round(sumT))} · avg ${fmt(Math.round(avgT))}` : 'Not recorded'} />
      </div>

      {tips.length > 0 && (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-2 font-semibold text-slate-900">Insights</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {tips.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      )}

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="mb-3 font-semibold text-slate-900">Question by question</p>
        <div className="space-y-3">
          {rows.map((x) => {
            const cr = classRate(x.i)
            const color = x.skipped ? 'bg-slate-400' : x.ok ? 'bg-emerald-500' : 'bg-rose-500'
            const Icon = x.skipped ? Minus : x.ok ? Check : X
            return (
              <div key={x.i} className="rounded-xl bg-slate-50 p-3">
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${color}`}>
                    <Icon size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      Q{x.i + 1}. {x.q.q}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      Your answer: {x.skipped ? 'Skipped' : (x.q.options?.[x.a] ?? String(x.a))}
                      {!x.ok && <> · Correct: {x.q.options?.[correctOf(x.q)] ?? String(correctOf(x.q))}</>}
                    </p>
                    {cr !== null && <p className="text-xs text-slate-500">Class got this right: {cr}%</p>}
                    {hasTime && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                          <div className={`h-full rounded-full ${color}`} style={{ width: `${(x.t / maxT) * 100}%` }} />
                        </div>
                        <span className="w-14 text-right text-xs font-semibold text-slate-700">{fmt(x.t)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}