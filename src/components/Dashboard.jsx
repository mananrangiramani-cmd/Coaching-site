import { Users, BookOpen, ClipboardCheck, TrendingUp, Trophy, CalendarCheck } from 'lucide-react'
import { students } from '../data/students'
import { courses } from '../data/courses'
import { tests } from '../data/tests'
import { useUser } from '../context/UserContext'
import { loadResults, avg } from '../utils/progress'
import StatCard from './StatCard'
import BarChart from './BarChart'
import DonutRing from './DonutRing'
import TrendChart from './TrendChart'
import GamePanel, { XpLeaderboard } from './GamePanel'

const CLASSES = [9, 10, 11, 12]
const pct = (r) => Math.round((r.score / r.total) * 100)
const classOf = (r) => r.standard ?? students.find((s) => s.name === r.student)?.standard

export default function Dashboard() {
  const { role, currentUser, subject,standard } = useUser()
  const name = typeof currentUser === 'string' ? currentUser : currentUser?.name

  // faculty only count their own subject
  const results = loadResults().filter(
    (r) => !subject || tests.find((t) => t.id === r.testId)?.subject === subject
  )

  /* ---------------- student view ---------------- */
  if (role === 'student') {
    const me = students.find((s) => s.name === name)
    const mine = results.filter((r) => r.student === name).sort((a, b) => a.id - b.id)
    const myAvg = mine.length ? avg(mine.map(pct)) : me?.avgScore ?? 0
    const attendance = me?.attendance ?? 0

    // rank among classmates who have taken tests
    const byStudent = {}
    results.filter((r) => classOf(r) === me?.standard).forEach((r) => {
      ;(byStudent[r.student] ||= []).push(pct(r))
    })
    const avgs = Object.entries(byStudent).map(([n, v]) => [n, avg(v)])
    const rank = byStudent[name] ? 1 + avgs.filter(([, a]) => a > avg(byStudent[name])).length : null

    const points = mine.slice(-8).map((r) => ({ label: r.title, value: pct(r) }))

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard icon={TrendingUp} label="Average score" value={myAvg} suffix="%" tone="gold" />
          <StatCard icon={ClipboardCheck} label="Tests taken" value={mine.length} tone="blue" />
          <StatCard icon={Trophy} label="Class rank" value={rank ? `#${rank}` : '-'} tone="green" />
          <StatCard icon={CalendarCheck} label="Attendance" value={attendance} suffix="%" tone="rose" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="mb-3 font-semibold text-slate-900">Attendance</p>
            <div className="flex justify-center"><DonutRing value={attendance} /></div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="mb-3 font-semibold text-slate-900">Your score trend</p>
            <TrendChart points={points} />
          </div>
        </div>
             <GamePanel name={name} own />
            <XpLeaderboard standard={me?.standard} highlight={name} />
      </div>
    )
  }

  /* ---------------- admin / faculty view ---------------- */
  const perClassScore = CLASSES.map((c) => {
    const rs = results.filter((r) => classOf(r) === c)
    const fallback = avg(students.filter((s) => s.standard === c).map((s) => s.avgScore))
    return { label: `${c}th`, value: rs.length ? avg(rs.map(pct)) : fallback }
  })
  const perClassAttendance = CLASSES.map((c) => ({
    label: `${c}th`,
    value: avg(students.filter((s) => s.standard === c).map((s) => s.attendance)),
  }))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Users} label="Students" value={students.length} tone="gold" />
        <StatCard icon={BookOpen} label="Courses" value={courses.length} tone="blue" />
        <StatCard icon={ClipboardCheck} label="Tests taken" value={results.length} tone="green" />
        <StatCard icon={TrendingUp} label="Average score" value={avg(results.map(pct)) || avg(students.map((s) => s.avgScore))} suffix="%" tone="rose" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-3 font-semibold text-slate-900">Average score by class</p>
          <BarChart data={perClassScore} />
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-3 font-semibold text-slate-900">Average attendance by class</p>
          <BarChart data={perClassAttendance} />
             <XpLeaderboard standard={standard} />
        </div>
      </div>
    </div>
  )
}