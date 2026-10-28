import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Home, Users, BookOpen, ClipboardList, BarChart3, MessageCircle, Menu, X, Moon, Sun } from 'lucide-react'
import { students } from '../data/students'
import { useUser } from '../context/UserContext'

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/tests', label: 'Tests', icon: ClipboardList },
  { to: '/results', label: 'Results', icon: BarChart3 },
  { to: '/queries', label: 'Doubts', icon: MessageCircle },
]

function SidebarContent({ onNavigate, dark, onToggleTheme }) {
  const { currentUser, setCurrentUser } = useUser()
  const me = students.find((s) => s.name === currentUser)

  return (
    <>
      <div className="mb-8 px-2 text-xl font-bold text-slate-900">DLPT</div>

      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-2">
        <button
          onClick={onToggleTheme}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
          {dark ? 'Light mode' : 'Dark mode'}
        </button>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-400">Logged in as</p>
          <select
            value={currentUser}
            onChange={(e) => setCurrentUser(e.target.value)}
            className="mt-1 w-full bg-transparent text-sm font-medium outline-none"
          >
            {students.map((s) => (
              <option key={s.id}>{s.name}</option>
            ))}
          </select>
          {me && (
            <Link
              to={`/students/${me.id}`}
              onClick={onNavigate}
              className="mt-2 block text-xs font-medium text-indigo-600 hover:underline"
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
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-slate-200/60 bg-white/60 p-4 backdrop-blur md:flex">
        <SidebarContent dark={dark} onToggleTheme={toggleTheme} />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-white p-4 shadow-xl">
            <button onClick={() => setOpen(false)} className="mb-2 self-end text-slate-500">
              <X size={22} />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} dark={dark} onToggleTheme={toggleTheme} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 px-4 py-3 backdrop-blur md:hidden">
          <span className="font-bold text-slate-900">DLPT</span>
          <button onClick={() => setOpen(true)} className="text-slate-700">
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