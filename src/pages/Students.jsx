import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { students } from '../data/students'
import { useUser } from '../context/UserContext'
import { ordinal } from '../data/standards'
import StandardSelect from '../components/StandardSelect'

export default function Students() {
  const { standard } = useUser()
  const [query, setQuery] = useState('')
  const [params, setParams] = useSearchParams()
  const school = params.get('school') || 'all'
  const schools = [...new Set(students.filter((s) => s.standard === standard).map((s) => s.school).filter(Boolean))].sort()

  // only students of the selected (or own) class are listed
  const classmates = students.filter((s) => s.standard === standard).filter((s) => school === 'all' || s.school === school)
  const filtered = classmates.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="mt-1 text-slate-500">
            {classmates.length} students in Class {ordinal(standard)}
            {school !== 'all' && ` · ${school}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={school}
            onChange={(e) => (e.target.value === 'all' ? setParams({}) : setParams({ school: e.target.value }))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="all">All schools</option>
            {schools.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <StandardSelect />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
        <Search size={18} className="text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search students..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {filtered.map((s) => (
          <Link
            key={s.id}
            to={`/students/${s.id}`}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
              {s.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <p className="font-semibold">{s.name}</p>
              <p className="text-sm text-slate-500">{s.batch} · {s.school}</p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && <p className="mt-6 text-slate-500">No students match your search.</p>}
    </div>
  )
}
