export const SUBJECTS = {
  Physics: ['Kinematics', 'Laws of Motion', 'Work & Energy', 'Thermodynamics'],
  Chemistry: ['Atomic Structure', 'Chemical Bonding', 'Organic Basics', 'Equilibrium'],
  Maths: ['Algebra', 'Trigonometry', 'Calculus', 'Coordinate Geometry'],
  Biology: ['Cell Biology', 'Genetics', 'Human Physiology', 'Ecology'],
}

const hash = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h }
// sample progress, same input always gives the same number (20 to 99)
const pct = (key) => 20 + (hash(key) % 80)

export const avg = (a) => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0)

export const studentModules = (name, onlySubject) =>
  Object.entries(SUBJECTS)
    .filter(([s]) => !onlySubject || s === onlySubject)
    .map(([subject, mods]) => ({
      subject,
      modules: mods.map((m) => ({ name: m, percent: pct(name + subject + m) })),
    }))

export const facultyModules = (name, subject, cls) =>
  (SUBJECTS[subject] || []).map((m) => ({ name: m, percent: pct(name + cls + m) }))

export const loadResults = () => {
  try { return JSON.parse(localStorage.getItem('results')) || [] } catch { return [] }
}
export const scorePct = (r) => Math.round((r.score / r.total) * 100)