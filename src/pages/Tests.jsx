import { Link } from 'react-router-dom'
import { Clock, HelpCircle } from 'lucide-react'
import { tests } from '../data/tests'
import { useUser } from '../context/UserContext'
import { ordinal } from '../data/standards'
import StandardSelect from '../components/StandardSelect'

export default function Tests() {
  const { standard, isAdmin } = useUser()
  const visible = tests.filter((t) => t.standard === standard)

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Tests</h1>
          <p className="mt-1 text-slate-500">
            {isAdmin ? `Tests for Class ${ordinal(standard)}.` : "Choose a test and start when you're ready."}
          </p>
        </div>
        <StandardSelect />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {visible.map((t) => (
          <div key={t.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-medium text-indigo-600">{t.course}</p>
            <h2 className="mt-1 text-lg font-semibold">{t.title}</h2>
            <div className="mt-3 flex gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><HelpCircle size={14} /> {t.questions.length} questions</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {t.duration} min</span>
            </div>
            {isAdmin ? (
              <p className="mt-4 text-xs text-slate-400">Students attempt tests from their own login.</p>
            ) : (
              <Link
                to={`/tests/${t.id}`}
                className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Start test
              </Link>
            )}
          </div>
        ))}
      </div>

      {visible.length === 0 && <p className="mt-6 text-slate-500">No tests for this class yet.</p>}
    </div>
  )
}
