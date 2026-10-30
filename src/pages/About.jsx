import { Link } from 'react-router-dom'
import { Lightbulb, ClipboardCheck, Users, HeartHandshake } from 'lucide-react'

const values = [
  { icon: Lightbulb, title: 'Concept clarity', text: 'We teach the why before the how, so students understand instead of memorising.' },
  { icon: ClipboardCheck, title: 'Regular testing', text: 'Weekly tests and detailed result reviews show exactly where to improve.' },
  { icon: Users, title: 'Learning together', text: 'Our doubts community lets students teach and learn from each other.' },
  { icon: HeartHandshake, title: 'Personal mentoring', text: 'Small batches and caring faculty who know every student by name.' },
]

const numbers = [
  { value: '500+', label: 'Students taught' },
  { value: '15+', label: 'Years of experience' },
  { value: '95%', label: 'Students improved scores' },
]

export default function About() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-navy-900 p-8 text-snow sm:p-10">
        <p className="text-sm font-medium text-gold-400">About us</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight">
          Helping every student learn better, not just study harder.
        </h1>
        <p className="mt-4 max-w-2xl text-blue-100/80">
          Coaching started with a simple belief: every student can do well with the right
          guidance, regular practice and a supportive community. We prepare students for JEE,
          NEET and school boards with experienced faculty and a focus on understanding.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {numbers.map((n) => (
          <div key={n.label} className="rounded-2xl bg-white p-5 text-center shadow-sm">
            <p className="text-3xl font-bold text-indigo-600">{n.value}</p>
            <p className="text-sm text-slate-500">{n.label}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-bold">What we stand for</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-300 text-navy-900">
                <Icon size={20} />
              </div>
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 text-center shadow-sm">
        <h2 className="text-xl font-bold">Ready to start your journey?</h2>
        <p className="mt-1 text-slate-500">Explore our courses and take a free practice test.</p>
        <Link
          to="/courses"
          className="mt-4 inline-block rounded-xl bg-gold-400 px-5 py-2.5 text-sm font-medium text-navy-900 hover:bg-gold-300"
        >
          View courses
        </Link>
      </section>
    </div>
  )
}