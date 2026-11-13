import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, XCircle, Trash2 } from 'lucide-react'
import { tests } from '../data/tests'
import { students } from '../data/students'
import { useUser } from '../context/UserContext'
import { ordinal } from '../data/standards'
import StandardSelect from '../components/StandardSelect'

// older saved results may not have a standard, so fall back to the student's own
const standardOf = (r) => r.standard ?? students.find((s) => s.name === r.student)?.standard

export default function Results() {
  const { currentUser, isAdmin, standard } = useUser()
  const [results, setResults] = useState(() =>
    JSON.parse(localStorage.getItem('results') || '[]')
  )
  const [openId, setOpenId] = useState(null)

  // students only ever see their own results; the admin sees one class at a time
  const visible = isAdmin
    ? results.filter((r) => standardOf(r) === standard)
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
            {isAdmin ? `All test attempts in Class ${ordinal(standard)}.` : `Test attempts by ${currentUser}.`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StandardSelect />
          {!isAdmin && visible.length > 0 && (
            <button
              onClick={clearMine}
              className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm text-slate-500 hover:bg-white hover:text-red-500"
            >
              <Trash2 size={16} /> Clear mine
            </button>
          )}
        </div>
      </div>

      {visible.length === 0 && (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">No results yet.</p>
          {!isAdmin && (
            <Link to="/tests" className="mt-2 inline-block font-medium text-indigo-600">
              Take a test
            </Link>
          )}
        </div>
      )}

      <div className="mt-6 space-y-4">
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
                    {isAdmin && <span className="font-medium text-slate-700">{r.student} · </span>}
                    {r.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${color}`}>{percent}%</p>
                  <p className="text-sm text-slate-500">{r.score} / {r.total} correct</p>
                </div>
              </div>

              <button
                onClick={() => setOpenId(open ? null : r.id)}
                className="mt-3 text-sm font-medium text-indigo-600"
              >
                {open ? 'Hide review' : 'View review'}
              </button>

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
    </div>
  )
}
