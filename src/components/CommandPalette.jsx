import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, CornerDownLeft } from 'lucide-react'
import { students } from '../data/students'
import { courses } from '../data/courses'
import { tests } from '../data/tests'
import { useUser } from '../context/UserContext'

const PAGES = [
  ['Home', '/'], ['About us', '/about'], ['Courses', '/courses'], ['Tests', '/tests'],
  ['Results', '/results'], ['Students', '/students'], ['Doubts', '/queries'],
  ['Study material', '/materials'],
  ['Attendance', '/attendance', 'admin'], ['Payments', '/payments', 'admin'],
  ['Daily reports', '/reports', 'admin'], ['Faculty progress', '/faculty', 'staff'],
]

const readJson = (k) => { try { return JSON.parse(localStorage.getItem(k)) || [] } catch { return [] } }

export default function CommandPalette({ onClose }) {
  const { role, standard, subject } = useUser()
  const navigate = useNavigate()
  const isStaff = role !== 'student'
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  // everything searchable, limited by who is logged in
  const items = []
  PAGES.filter(([, , g]) => !g || (g === 'admin' ? role === 'admin' : isStaff))
    .forEach(([label, to]) => items.push({ group: 'Pages', label, sub: '', to }))
   const visible = students.filter((s) => isStaff || s.standard === standard)
  const schoolNames = [...new Set(visible.map((s) => s.school).filter(Boolean))]
  schoolNames.forEach((n) =>
    items.push({
      group: 'Schools', label: n,
      sub: `${visible.filter((s) => s.school === n).length} students`,
      to: `/students?school=${encodeURIComponent(n)}`,
    }))
  visible.forEach((s) =>
    items.push({
      group: 'Students', label: s.name,
      sub: `Class ${s.standard}th${s.school ? ' · ' + s.school : ''}`,
      to: `/students/${s.id}`,
    }))
    
  const term = q.trim().toLowerCase()
  const found = items
    .filter((i) => (term ? `${i.label} ${i.sub} ${i.group}`.toLowerCase().includes(term) : i.group === 'Pages'))
    .slice(0, 12)

  const go = (item) => { onClose(); navigate(item.to) }

  const onKey = (e) => {
    if (e.key === 'Escape') onClose()
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, found.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter' && found[active]) go(found[active])
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 px-4 pt-[12vh]" onClick={onClose}>
      <div className="page-enter w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-4">
          <Search size={18} className="text-slate-400" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setActive(0) }}
            onKeyDown={onKey}
            placeholder="Search pages, students, courses, tests..."
            className="w-full bg-transparent py-4 text-slate-900 outline-none"
          />
          <kbd className="hidden rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500 sm:block">Esc</kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
          {found.length === 0 && <p className="p-4 text-center text-sm text-slate-500">Nothing found.</p>}
          {found.map((item, i) => (
            <div key={`${item.group}-${item.label}-${i}`}>
              {(i === 0 || found[i - 1].group !== item.group) && (
                <p className="px-3 pb-1 pt-3 text-xs font-bold uppercase tracking-wide text-slate-400">{item.group}</p>
              )}
              <button
                ref={i === active ? (el) => el?.scrollIntoView({ block: 'nearest' }) : null}
                onClick={() => go(item)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left ${
                  i === active ? 'bg-gold-400/25' : ''
                }`}
              >
                <span>
                  <span className="text-sm font-medium text-slate-900">{item.label}</span>
                  {item.sub && <span className="ml-2 text-xs text-slate-500">{item.sub}</span>}
                </span>
                {i === active && <CornerDownLeft size={14} className="text-slate-400" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}