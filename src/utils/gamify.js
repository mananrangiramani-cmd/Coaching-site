import { students } from '../data/students'
import { loadResults } from './progress'

const read = (k) => { try { return JSON.parse(localStorage.getItem(k)) || [] } catch { return [] } }
const dayKey = (d) => new Date(d).toLocaleDateString('en-CA')

export const BADGES = [
  { id: 'first', icon: 'Target', label: 'First Step', desc: 'Take your first test', test: (s) => s.tests >= 1 },
  { id: 'five', icon: 'Zap', label: 'Test Warrior', desc: 'Take 5 tests', test: (s) => s.tests >= 5 },
  { id: 'perfect', icon: 'Star', label: 'Perfectionist', desc: 'Score 100% on a test', test: (s) => s.perfect },
  { id: 'top', icon: 'Trophy', label: 'Top Scorer', desc: 'Average 80%+ over 3 tests', test: (s) => s.tests >= 3 && s.avg >= 80 },
  { id: 'streak3', icon: 'Flame', label: 'On Fire', desc: '3-day streak', test: (s) => s.streak >= 3 },
  { id: 'streak7', icon: 'Award', label: 'Unstoppable', desc: '7-day streak', test: (s) => s.streak >= 7 },
  { id: 'helper', icon: 'Heart', label: 'Doubt Solver', desc: 'Get an answer accepted', test: (s) => s.accepted >= 1 },
  { id: 'sharer', icon: 'Upload', label: 'Sharer', desc: 'Post study material', test: (s) => s.materials >= 1 },
  { id: 'present', icon: 'CalendarCheck', label: 'Always Present', desc: 'Attendance 90%+', test: (s) => s.attendance >= 90 },
]

export function getStats(name) {
  const results = loadResults().filter((r) => r.student === name)
  const reports = read('daily-reports-v1').filter((r) => r.from === name)
  const doubts = read('doubts-v3')
  const asked = doubts.filter((d) => d.author === name).length
  const replies = doubts.flatMap((d) => d.replies || []).filter((r) => r.author === name)
  const accepted = replies.filter((r) => r.accepted).length
  const materials = read('materials-v1').filter((m) => m.by === name).length
  const me = students.find((s) => s.name === name)

  const pcts = results.map((r) => Math.round((r.score / r.total) * 100))
  const testXp = pcts.reduce((a, p) => a + 10 + Math.round(p / 10) + (p === 100 ? 20 : 0), 0)
  const breakdown = [
    { label: 'Tests', xp: testXp },
    { label: 'Daily reports', xp: reports.length * 5 },
    { label: 'Doubts asked', xp: asked * 2 },
    { label: 'Answers given', xp: replies.length * 5 },
    { label: 'Answers accepted', xp: accepted * 15 },
    { label: 'Material shared', xp: materials * 10 },
  ]
  const xp = breakdown.reduce((a, b) => a + b.xp, 0)

  // streak = consecutive days with a test or a daily report (today may still be open)
  const days = new Set([...results.map((r) => dayKey(r.id)), ...reports.map((r) => r.date)])
  let streak = 0
  const d = new Date()
  if (!days.has(dayKey(d))) d.setDate(d.getDate() - 1)
  while (days.has(dayKey(d))) { streak++; d.setDate(d.getDate() - 1) }

  const level = Math.floor(Math.sqrt(xp / 20)) + 1
  const base = 20 * (level - 1) ** 2
  const next = 20 * level ** 2
  const progress = Math.round(((xp - base) / (next - base)) * 100)

  const s = {
    tests: results.length, perfect: pcts.includes(100),
    avg: pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : 0,
    streak, accepted, materials, attendance: me?.attendance ?? 0,
  }
  return { xp, level, progress, next, streak, breakdown, badges: BADGES.map((b) => ({ ...b, earned: b.test(s) })) }
}