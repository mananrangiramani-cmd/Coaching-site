import { useEffect } from 'react'
import { Flame, Trophy, Star, Zap, Target, Upload, Heart, CalendarCheck, Award, Lock } from 'lucide-react'
import { students } from '../data/students'
import { getStats } from '../utils/gamify'
import { useToast } from '../context/ToastContext'

const ICONS = { Flame, Trophy, Star, Zap, Target, Upload, Heart, CalendarCheck, Award }

export default function GamePanel({ name, own = false }) {
  const toast = useToast()
  const g = getStats(name)
  const earned = g.badges.filter((b) => b.earned)

  // pop a message when a new badge is earned (only on your own panel)
  useEffect(() => {
    if (!own) return
    const key = `badges-seen-${name}`
    let seen = null
    try { seen = JSON.parse(localStorage.getItem(key)) } catch {}
    const ids = earned.map((b) => b.id)
    if (seen) ids.filter((id) => !seen.includes(id)).forEach((id) =>
      toast(`New badge: ${g.badges.find((b) => b.id === id).label}`))
    localStorage.setItem(key, JSON.stringify(ids))
  }, [own, name, earned.length]) // eslint-disable-line

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full text-navy-900"
          style={{ background: 'linear-gradient(180deg, #ffd96a, #f5c542)' }}>
          <span className="text-xs font-semibold">LEVEL</span>
          <span className="text-2xl font-bold leading-none">{g.level}</span>
        </div>
        <div className="min-w-[10rem] flex-1">
          <p className="font-semibold text-slate-900">{g.xp} points</p>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-gold-400" style={{ width: `${g.progress}%`, transition: 'width 0.8s ease' }} />
          </div>
          <p className="mt-1 text-xs text-slate-500">{g.next - g.xp} points to level {g.level + 1}</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 px-4 py-2">
          <Flame size={26} className={g.streak ? 'text-orange-500' : 'text-slate-400'} />
          <div>
            <p className="text-xl font-bold leading-none text-slate-900">{g.streak}</p>
            <p className="text-xs text-slate-500">day streak</p>
          </div>
        </div>
      </div>

      <p className="mb-2 mt-5 text-sm font-semibold text-slate-900">
        Badges ({earned.length}/{g.badges.length})
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
        {g.badges.map((b) => {
          const Icon = ICONS[b.icon]
          return (
            <div key={b.id} title={b.desc}
              className={`flex flex-col items-center rounded-xl p-2 text-center ${b.earned ? 'bg-gold-400/20' : 'bg-slate-100 opacity-60'}`}>
              {b.earned ? <Icon size={22} className="text-gold-500" /> : <Lock size={22} className="text-slate-400" />}
              <span className="mt-1 text-xs font-medium text-slate-800">{b.label}</span>
              <span className="text-[10px] leading-tight text-slate-500">{b.desc}</span>
            </div>
          )
        })}
      </div>

      <p className="mb-1 mt-5 text-sm font-semibold text-slate-900">Where your points come from</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
        {g.breakdown.map((b) => <span key={b.label}>{b.label}: <b>{b.xp}</b></span>)}
      </div>
    </div>
  )
}

export function XpLeaderboard({ standard, highlight }) {
  const rows = students
    .filter((s) => s.standard === standard)
    .map((s) => ({ name: s.name, xp: getStats(s.name).xp, level: getStats(s.name).level }))
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 5)

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
        <Trophy size={18} className="text-gold-500" /> Points leaderboard
      </p>
      {rows.length === 0 && <p className="text-sm text-slate-500">No students in this class.</p>}
      <ol className="space-y-2">
        {rows.map((r, i) => (
          <li key={r.name} className={`flex items-center gap-3 rounded-xl px-2 py-1.5 ${r.name === highlight ? 'bg-gold-400/20' : ''}`}>
            <span className="w-5 text-center text-sm font-bold text-slate-500">{i + 1}</span>
            <span className="flex-1 truncate text-sm font-medium text-slate-900">{r.name}</span>
            <span className="text-xs text-slate-500">Lvl {r.level}</span>
            <span className="w-16 text-right text-sm font-semibold text-indigo-600">{r.xp} pts</span>
          </li>
        ))}
      </ol>
    </div>
  )
}