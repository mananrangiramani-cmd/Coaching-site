import { Link } from 'react-router-dom'
import { ArrowRight, Award, BookOpen, GraduationCap, Trophy, Users } from 'lucide-react'
import { students } from '../data/students'
import { courses } from '../data/courses'
import { faculty, achievements } from '../data/home'

const medalColors = ['bg-amber-100 text-amber-600', 'bg-slate-200 text-slate-600', 'bg-orange-100 text-orange-600']

const typeColors = {
  Student: 'bg-indigo-100 text-indigo-600',
  Batch: 'bg-emerald-100 text-emerald-600',
  Faculty: 'bg-amber-100 text-amber-600',
  Institute: 'bg-rose-100 text-rose-600',
}

function initials(name) {
  return name.split(' ').map((n) => n[0]).join('')
}

export default function Home() {
  const topPerformers = [...students].sort((a, b) => b.avgScore - a.avgScore).slice(0, 3)

  const stats = [
    { label: 'Students', value: `${students.length}+`, icon: Users },
    { label: 'Courses', value: courses.length, icon: BookOpen },
    { label: 'Expert faculty', value: faculty.length, icon: GraduationCap },
    { label: 'Achievements', value: achievements.length, icon: Award },
  ]

  return (
    <div className="space-y-12">
      {/* Hero */}
            <section className="rounded-3xl bg-navy-900 p-8 text-snow sm:p-12">
        <p className="text-sm font-medium text-gold-400">Welcome to XYZ Coaching</p>
        <h1 className="mt-2 max-w-xl text-3xl font-bold leading-tight sm:text-4xl">
          Learn smarter. Score higher. Grow together.
        </h1>
        <p className="mt-3 max-w-lg text-blue-100/80">
          Expert faculty, regular tests and a community where every doubt gets answered.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/courses" className="flex items-center gap-2 rounded-xl bg-gold-400 px-5 py-2.5 text-sm font-medium text-navy-900 hover:bg-gold-300">
            Explore courses <ArrowRight size={16} />
          </Link>
          <Link to="/tests" className="rounded-xl border border-snow/30 px-5 py-2.5 text-sm font-medium hover:bg-snow/10">
            Take a test
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <Icon size={20} className="text-indigo-500" />
            <p className="mt-3 text-2xl font-bold">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </section>

      {/* Top performers */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Trophy className="text-amber-500" /> Top performers
          </h2>
          <Link to="/students" className="text-sm font-medium text-indigo-600">View all</Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {topPerformers.map((s, i) => (
            <Link
              key={s.id}
              to={`/students/${s.id}`}
              className="rounded-2xl bg-white p-5 text-center shadow-sm transition hover:shadow-md"
            >
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold ${medalColors[i]}`}>
                {initials(s.name)}
              </div>
              <p className="mt-3 font-semibold">{s.name}</p>
              <p className="text-sm text-slate-500">{s.batch}</p>
              <p className="mt-2 text-2xl font-bold text-emerald-600">{s.avgScore}%</p>
              <p className="text-xs text-slate-400">Rank #{i + 1}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Faculty */}
      <section>
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <GraduationCap className="text-indigo-500" /> Meet our faculty
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {faculty.map((f) => (
            <div key={f.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                {initials(f.name.replace(/^(Dr\.|Prof\.|Ms\.|Mr\.)\s/, ''))}
              </div>
              <p className="mt-3 font-semibold">{f.name}</p>
              <p className="text-sm font-medium text-indigo-600">{f.subject}</p>
              <p className="text-xs text-slate-500">{f.qualification} · {f.experience} yrs</p>
              <p className="mt-2 text-sm text-slate-600">{f.tagline}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section>
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Award className="text-rose-500" /> Recent achievements
        </h2>
        <div className="mt-4 space-y-3">
          {achievements.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${typeColors[a.type]}`}>
                  {a.type}
                </span>
                <p className="text-sm font-medium">{a.title}</p>
              </div>
              <span className="shrink-0 text-xs text-slate-400">{a.date}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}