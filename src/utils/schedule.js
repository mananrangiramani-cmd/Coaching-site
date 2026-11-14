import { users } from '../data/users'

const SUBJECTS = ['Physics', 'Chemistry', 'Maths', 'Biology']

export function classesOn(date, standard) {
  const d = date.getDay() // 0 = Sunday
  if (d === 0) return []
  if (d === 6) return [{ time: '10:00 AM', subject: 'Weekly Test', faculty: '' }]
  const i = (d + standard) % 4
  return [
    { time: '4:00 PM', subject: SUBJECTS[i] },
    { time: '5:30 PM', subject: SUBJECTS[(i + 1) % 4] },
  ].map((c) => ({ ...c, faculty: users.find((u) => u.subject === c.subject)?.name || '' }))
}