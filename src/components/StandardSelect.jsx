import { GraduationCap } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { STANDARDS, ordinal } from '../data/standards'

// Admin gets a dropdown for 9th to 12th. Students see their own class, locked.
export default function StandardSelect() {
  const { isStaff, standard, setStandard } = useUser()

  if (!isStaff) {
    return (
      <span className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm">
        <GraduationCap size={16} /> Class {ordinal(standard)}
      </span>
    )
  }

  return (
    <label className="text-sm text-slate-500">
      Class{' '}
      <select
        value={standard}
        onChange={(e) => setStandard(Number(e.target.value))}
        className="ml-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-800 outline-none"
      >
        {STANDARDS.map((s) => (
          <option key={s} value={s}>
            {ordinal(s)}
          </option>
        ))}
      </select>
    </label>
  )
}
