import { Link } from 'react-router-dom'
import { Clock, HelpCircle } from 'lucide-react'
import { tests } from '../data/tests'

export default function Tests() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Tests</h1>
      <p className="mt-1 text-slate-500">Choose a test and start when you're ready.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {tests.map((t) => (
          <div key={t.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-medium text-indigo-600">{t.course}</p>
            <h2 className="mt-1 text-lg font-semibold">{t.title}</h2>
            <div className="mt-3 flex gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><HelpCircle size={14} /> {t.questions.length} questions</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {t.duration} min</span>
            </div>
            <Link
              to={`/tests/${t.id}`}
              className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Start test
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}