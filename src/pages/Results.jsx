import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Trash2, Trophy, XCircle } from 'lucide-react'
import { tests } from '../data/tests'
import { students } from '../data/students'
import { useUser } from '../context/UserContext'
import { ordinal } from '../data/standards'
import StandardSelect from '../components/StandardSelect'

const standardOf = (r) => r.standard ?? students.find((s) => s.name === r.student)?.standard
const medal = ['bg-gold-400 text-navy-900', 'bg-slate-300 text-slate-800', 'bg-orange-400 text-white']

function initials(name) {
  return name.split(' ').map((n) => n[0]).join('')
}

// each student's best score per test, then the average of those (retakes cannot inflate it)
function buildRanking(results, standard, testId) {
  const best = {}
  results
    .filter((r) => standardOf(r) === standard && (testId === 'all' || r.testId === Number(testId)))
    .forEach((r) => {
      const pct = Math.round((r.score / r.total) * 100)
      best[r.student] = best[r.student] || {}
      best[r.student][r.testId] = Math.max(best[r.student][r.testId] ?? 0, pct)
    })

  const list = Object.entries(best)
    .map(([name, byTest]) => {
      const vals = Object.values(byTest)
      return { name, avg: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length), tests: vals.length }
    })
    .sort((a, b) => b.avg - a.avg || b.tests - a.tests || a.name.localeCompare(b.name))

  let prev = null
  return list.map((p, i) => {
    const rank = prev && prev.avg === p.avg ? prev.rank : i + 1
    prev = { avg: p.avg, rank }
    return { ...p, rank }
  })
}

function RankingPanel({ results, standard, currentUser }) {
  const [testId, setTestId] = useState('all')
  const classTests = tests.filter((t) => t.standard === standard)
  const active = classTests.some((t) => String(t.id) === testId) ? testId : 'all'
  const ranking = buildRanking(results, standard, active)

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="flex items-center gap-2 font-semibold">
        <Trophy size={18} className="text-gold-500" /> Class {ordinal(standard)} ranking
      </p>
      <select
        value={active}
        onChange={(e) => setTestId(e.target.value)}
        className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none"
      >
        <option value="all">All tests (average)</option>
        {classTests.map((t) => (
          <option key={t.id} value={t.id}>
            {t.title}
          </option>
        ))}
      </select>

      <ul className="mt-4 space-y-2">
        {ranking.map((p) => (
          <li
            key={p.name}
            className={`flex items-center gap-3 rounded-xl px-2 py-1.5 ${
              p.name === currentUser ? 'bg-indigo-50' : ''
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                medal[p.rank - 1] ?? 'bg-slate-100 text-slate-500'
              }`}
            >
              {p.rank}
            </span>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
              {initials(p.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{p.name}</p>
              <p className="text-xs text-slate-400">
                {p.tests} {p.tests === 1 ? 'test' : 'tests'}
              </p>
            </div>
            <span className="text-sm font-semibold text-indigo-600">{p.avg}%</span>
          </li>
        ))}
        {ranking.length === 0 && (
          <li className="text-sm text-slate-500">
            No attempts yet in Class {ordinal(standard)}. Take a test to enter the ranking.
          </li>
        )}
      </ul>
    </div>
  )
}

export default function Results() {
  const { currentUser, isStaff, standard, subject } = useUser()
  const subjectOk = (r) => !subject || tests.find((t) => t.id === r.testId)?.subject === subject
  const [results, setResults] = useState(() =>
    JSON.parse(localStorage.getItem('results') || '[]')
  )
  const [openId, setOpenId] = useState(null)

  // students only ever see their own result details; the admin sees one class at a time
  const visible = isStaff
    ? results.filter((r) => standardOf(r) === standard).filter(subjectOk)
    : results.filter((r) => r.student === currentUser)

  function clearMine() {
    const rest = results.filter((r) => r.student !== currentUser)
    localStorage.setItem('results', JSON.stringify(rest))
    setResults(rest)
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Results</h1>
          <p className="mt-1 text-slate-500">
            {isStaff ? `All test attempts in Class ${ordinal(standard)}.` : `Test attempts by ${currentUser}.`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StandardSelect />
          {!isStaff && visible.length > 0 && (
            <button
              onClick={clearMine}
              className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm text-slate-500 hover:bg-white hover:text-red-500"
            >
              <Trash2 size={16} /> Clear mine
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-4">
          {visible.length === 0 && (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-slate-500">No results yet.</p>
              {!isStaff && (
                <Link to="/tests" className="mt-2 inline-block font-medium text-indigo-600">
                  Take a test
                </Link>
              )}
            </div>
          )}

          {visible.map((r) => {
            const percent = Math.round((r.score / r.total) * 100)
            const color =
              percent >= 85 ? 'text-emerald-600' : percent >= 70 ? 'text-amber-500' : 'text-red-500'
            const test = tests.find((t) => t.id === r.testId)
            const open = openId === r.id

            return (
              <div key={r.id} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">{r.title}</h2>
                    <p className="text-sm text-slate-500">
                      {isStaff && <span className="font-medium text-slate-700">{r.student} · </span>}
                      {r.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${color}`}>{percent}%</p>
                    <p className="text-sm text-slate-500">{r.score} / {r.total} correct</p>
                  </div>
                </div>

                               <div className="mt-3 flex items-center gap-4">
                  <button
                    onClick={() => setOpenId(open ? null : r.id)}
                    className="text-sm font-medium text-indigo-600"
                  >
                    {open ? 'Hide review' : 'View review'}
                  </button>
                  <Link
                    to={`/results/${r.id}`}
                    className="text-sm font-medium text-indigo-600"
                  >
                    View breakdown →
                  </Link>
                </div>

                {open && test && (
                  <div className="mt-4 space-y-3">
                    {test.questions.map((q, i) => {
                      const picked = r.answers[i]
                      const correct = picked === q.answer
                      return (
                        <div key={i} className="rounded-xl bg-slate-50 p-4">
                          <div className="flex items-start gap-2">
                            {correct ? (
                              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" />
                            ) : (
                              <XCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
                            )}
                            <p className="text-sm font-medium">{i + 1}. {q.q}</p>
                          </div>
                          <p className="mt-2 text-sm text-slate-600">
                            Answer given: {picked === undefined ? 'Not answered' : q.options[picked]}
                          </p>
                          {!correct && (
                            <p className="text-sm text-emerald-600">
                              Correct answer: {q.options[q.answer]}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <RankingPanel results={results.filter(subjectOk)} standard={standard} currentUser={currentUser} />
        </aside>
      </div>
    </div>
  )
}