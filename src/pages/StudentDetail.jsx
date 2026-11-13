import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Lock } from 'lucide-react'
import { students } from '../data/students'
import { initialDoubts } from '../data/doubts'
import { useUser } from '../context/UserContext'
import { ordinal } from '../data/standards'

function load(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

function scoreColor(p) {
  return p >= 85 ? 'text-emerald-600' : p >= 70 ? 'text-amber-500' : 'text-red-500'
}

function initials(name) {
  return name.split(' ').map((n) => n[0]).join('')
}

export default function StudentDetail() {
  const { id } = useParams()
  const { isAdmin, currentUser, standard } = useUser()
  const student = students.find((s) => s.id === Number(id))

  // a student cannot open profiles from another class
  if (!student || (!isAdmin && student.standard !== standard)) {
    return (
      <div>
        <p>Student not found.</p>
        <Link to="/students" className="text-indigo-600">Back to students</Link>
      </div>
    )
  }

  // scores, contact details and test history are private to the student and the admin
  const canSeeDetails = isAdmin || student.name === currentUser

  const header = (
    <>
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-semibold text-indigo-600">
          {initials(student.name)}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{student.name}</h1>
          <p className="text-slate-500">
            Class {ordinal(student.standard)} · {student.batch} · {student.course}
          </p>
        </div>
      </div>
      <p className="mt-4 text-slate-600">{student.about}</p>
    </>
  )

  if (!canSeeDetails) {
    return (
      <div className="space-y-6">
        <Link to="/students" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600">
          <ArrowLeft size={16} /> Back to students
        </Link>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          {header}
          <div className="mt-6 flex items-center gap-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            <Lock size={16} /> Scores and test history are private to each student.
          </div>
        </div>
      </div>
    )
  }

  const results = load('results', []).filter((r) => r.student === student.name)
  const doubts = load('doubts-v3', initialDoubts)
  const asked = doubts.filter((d) => d.author === student.name).length
  const myReplies = doubts.flatMap((d) => d.replies).filter((r) => r.author === student.name)
  const solvedForOthers = myReplies.filter((r) => r.accepted).length

  const trend = results
    .slice(0, 6)
    .reverse()
    .map((r) => Math.round((r.score / r.total) * 100))

  const stats = [
    { label: 'Attendance', value: `${student.attendance}%` },
    { label: 'Average score', value: `${student.avgScore}%` },
    { label: 'Joined', value: student.joined },
  ]

  const community = [
    { label: 'Doubts asked', value: asked },
    { label: 'Answers given', value: myReplies.length },
    { label: 'Doubts solved', value: solvedForOthers },
  ]

  return (
    <div className="space-y-6">
      <Link to="/students" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600">
        <ArrowLeft size={16} /> Back to students
      </Link>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        {header}

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {stats.map((st) => (
            <div key={st.label} className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">{st.label}</p>
              <p className="text-xl font-semibold">{st.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-1 text-sm text-slate-600">
          <p>Email: {student.email}</p>
          <p>Phone: {student.phone}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Test performance</h2>

        {results.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No tests taken yet.</p>
        ) : (
          <>
            <div className="mt-4 flex h-28 items-end gap-3">
              {trend.map((p, i) => (
                <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
                  <span className="text-xs text-slate-500">{p}%</span>
                  <div className="w-full rounded-t-lg bg-indigo-500" style={{ height: `${p * 0.8}px` }} />
                </div>
              ))}
            </div>

            <div className="mt-5 divide-y divide-slate-100">
              {results.map((r) => {
                const p = Math.round((r.score / r.total) * 100)
                return (
                  <div key={r.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">{r.title}</p>
                      <p className="text-xs text-slate-400">{r.date}</p>
                    </div>
                    <p className={`font-semibold ${scoreColor(p)}`}>
                      {p}% <span className="text-xs font-normal text-slate-400">({r.score}/{r.total})</span>
                    </p>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Community activity</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {community.map((c) => (
            <div key={c.label} className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">{c.label}</p>
              <p className="text-xl font-semibold">{c.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
