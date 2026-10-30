import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Moon, Sun } from 'lucide-react'
import {
  Home01Icon,
  InformationCircleIcon,
  BookOpen01Icon,
  Task01Icon,
  ChartBarLineIcon,
  UserGroupIcon,
  MessageMultiple01Icon,
  Wallet01Icon,
} from '@hugeicons/core-free-icons'
import BranchedMenu from './BranchedMenu'
import { students } from '../data/students'
import { useUser } from '../context/UserContext'

const items = [
  {
    label: 'Main',
    children: [
      { value: '/', label: 'Home', icon: Home01Icon },
      { value: '/about', label: 'About us', icon: InformationCircleIcon },
    ],
  },
  {
    label: 'Learning',
    children: [
      { value: '/courses', label: 'Courses', icon: BookOpen01Icon },
      { value: '/tests', label: 'Tests', icon: Task01Icon },
      { value: '/results', label: 'Results', icon: ChartBarLineIcon },
    ],
  },
  {
    label: 'Community',
    children: [
      { value: '/students', label: 'Students', icon: UserGroupIcon },
      { value: '/queries', label: 'Doubts', icon: MessageMultiple01Icon },
    ],
  },
  {
    label: 'Admin',
    children: [{ value: '/payments', label: 'Payments', icon: Wallet01Icon }],
  },
]

function SidebarContent({ onNavigate, dark, onToggleTheme }) {
  const { currentUser, setCurrentUser } = useUser()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const me = students.find((s) => s.name === currentUser)

  return (
    <>
      <div className="mb-6 flex items-center gap-2 px-2 text-xl font-bold text-snow">
        <span className="h-3 w-3 rounded-full bg-gold-400" />
        DLPT
      </div>

      <div className="-mx-1 overflow-y-auto">
        <BranchedMenu
          items={items}
          defaultOpen={[0, 1, 2, 3]}
          defaultActive={pathname}
          onSelect={(value) => {
            navigate(value)
            onNavigate?.()
          }}
          color="#f5f5f5"
          accentColor="#f5f5f5"
          lineColor="#3f3f46"
          width={240}
          rowHeight={36}
          indent={40}
          trunk={14}
          radius={10}
          lineWidth={1.5}
          fontSize={14}
          drawDuration={400}
          foldDuration={300}
        />
      </div>

      <div className="mt-auto space-y-2 pt-4">
        <button
          onClick={onToggleTheme}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-blue-100/80 hover:bg-snow/10 hover:text-snow"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
          {dark ? 'Light mode' : 'Dark mode'}
        </button>

        <div className="rounded-xl bg-snow/10 p-3">
          <p className="text-xs text-blue-200/70">Logged in as</p>
          <select
            value={currentUser}
            onChange={(e) => setCurrentUser(e.target.value)}
            className="mt-1 w-full bg-transparent text-sm font-medium text-snow outline-none"
          >
            {students.map((s) => (
              <option key={s.id} className="bg-navy-900 text-snow">
                {s.name}
              </option>
            ))}
          </select>
          {me && (
            <Link
              to={`/students/${me.id}`}
              onClick={onNavigate}
              className="mt-2 block text-xs font-medium text-gold-400 hover:underline"
            >
              View my profile
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

export default function Layout() {
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggleTheme = () => setDark(!dark)

  return (
    <div className="app-bg flex min-h-screen text-slate-800">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-navy-900 p-4 md:flex">
        <SidebarContent dark={dark} onToggleTheme={toggleTheme} />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-navy-900 p-4 shadow-xl">
            <button onClick={() => setOpen(false)} className="mb-2 self-end text-snow">
              <X size={22} />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} dark={dark} onToggleTheme={toggleTheme} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-navy-900 px-4 py-3 md:hidden">
          <span className="flex items-center gap-2 font-bold text-snow">
            <span className="h-2.5 w-2.5 rounded-full bg-gold-400" />
           DLPT
          </span>
          <button onClick={() => setOpen(true)} className="text-snow">
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}