import { users } from '../data/users'
import { tests } from '../data/tests'
import { useUser } from '../context/UserContext'
import ProgressBar from '../components/ProgressBar'
import { facultyModules, avg, loadResults, scorePct } from '../utils/progress'

const CLASSES = [9, 10, 11, 12]

export default function Faculty() {
  const { role, currentUser } = useUser()
  const myName = typeof currentUser === 'string' ? currentUser : currentUser?.name

  if (role === 'student') {
    return <p className="rounded-xl bg-white p-6 text-slate-700">This page is for faculty and admin only.</p>
  }

  const results = loadResults()
  const list = users.filter((u) => u.role === 'faculty' && (role === 'admin' || u.name === myName))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Faculty progress</h1>
      {list.length === 0 && <p className="text-slate-500">No faculty found.</p>}

      {list.map((f) => {
        const perClass = CLASSES.map((cls) => {
          const mods = facultyModules(f.name, f.subject, cls)
          const rs = results.filter((r) => {
            const t = tests.find((x) => x.id === r.testId)
            return t && t.subject === f.subject && t.standard === cls
          })
          return {
            cls, mods,
            completion: avg(mods.map((m) => m.percent)),
            grasp: avg(rs.map(scorePct)),
            attempts: rs.length,
            students: new Set(rs.map((r) => r.student)).size,
          }
        })
        const overall = avg(perClass.map((c) => c.completion))

        return (
          <div key={f.id ?? f.name} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-lg font-bold text-slate-900">{f.name}</p>
                <p className="text-sm text-slate-500">{f.subject}</p>
              </div>
              <p className="text-3xl font-bold text-navy-900">{overall}%
                <span className="block text-right text-xs font-normal text-slate-500">course completion</span>
              </p>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {perClass.map((c) => (
                <div key={c.cls} className="rounded-xl bg-slate-50 p-4">
                  <p className="mb-3 font-semibold text-slate-900">Class {c.cls}th</p>
                  <div className="space-y-3">
                    <ProgressBar label="Course completion" value={c.completion} />
                    <ProgressBar
                      label="Students' grasp (avg test score)"
                      value={c.grasp}
                      sub={c.attempts ? `· ${c.students} student(s)` : '· no tests yet'}
                    />
                  </div>
                  <p className="mb-2 mt-4 text-xs font-bold uppercase text-slate-500">Module progress</p>
                  <div className="space-y-2">
                    {c.mods.map((m) => <ProgressBar key={m.name} label={m.name} value={m.percent} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}