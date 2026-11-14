import { tests } from '../data/tests'
import { useUser } from '../context/UserContext'
import ProgressBar from './ProgressBar'
import TrendChart from './TrendChart'
import { studentModules, avg, loadResults, scorePct } from '../utils/progress'

export default function StudentProgress({ student }) {
  const { subject } = useUser()          // faculty only see their own subject
  const groups = studentModules(student.name, subject)
  const all = groups.flatMap((g) => g.modules.map((m) => m.percent))

  const results = loadResults()
    .filter((r) => r.student === student.name)
    .filter((r) => !subject || tests.find((t) => t.id === r.testId)?.subject === subject)
    .sort((a, b) => a.id - b.id)
    .slice(-10)

  const points = results.map((r) => ({ label: r.title, value: scorePct(r) }))

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="font-semibold text-slate-900">Course completion</p>
        <p className="mt-1 text-4xl font-bold text-navy-900">{avg(all)}%</p>
        <div className="mt-3"><ProgressBar label="Overall" value={avg(all)} /></div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="mb-3 font-semibold text-slate-900">Module progress</p>
        <div className="space-y-5">
          {groups.map((g) => (
            <div key={g.subject}>
              <p className="mb-2 text-sm font-bold text-navy-900">{g.subject}</p>
              <div className="space-y-3">
                {g.modules.map((m) => <ProgressBar key={m.name} label={m.name} value={m.percent} />)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="mb-3 font-semibold text-slate-900">Test score trend (last 10)</p>
        <TrendChart points={points} />
      </div>
    </div>
  )
}