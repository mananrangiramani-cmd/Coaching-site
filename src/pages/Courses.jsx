import { useState } from 'react'
import { Clock, PlayCircle } from 'lucide-react'
import { courses } from '../data/courses'

const categories = ['All', 'JEE', 'NEET', 'Foundation']

export default function Courses() {
  const [category, setCategory] = useState('All')

  const visible =
    category === 'All' ? courses : courses.filter((c) => c.category === category)

  return (
    <div>
      <h1 className="text-3xl font-bold">Courses</h1>
      <p className="mt-1 text-slate-500">Pick a course and keep learning.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              category === cat
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {visible.map((c) => (
          <div key={c.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium text-indigo-600">
                {c.category}
              </span>
              <span className="text-xs text-slate-500">{c.level}</span>
            </div>

            <h2 className="mt-3 text-lg font-semibold">{c.title}</h2>
            <p className="text-sm text-slate-500">by {c.teacher}</p>
            <p className="mt-2 text-sm text-slate-600">{c.description}</p>

            <div className="mt-4 flex gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><PlayCircle size={14} /> {c.lessons} lessons</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {c.hours} hrs</span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Progress</span>
                <span>{c.progress}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-gold-400"
                  style={{ width: `${c.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}