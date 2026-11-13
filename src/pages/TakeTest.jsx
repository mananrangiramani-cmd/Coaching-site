import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Lock, Timer } from 'lucide-react'
import { tests } from '../data/tests'
import { useUser } from '../context/UserContext'

export default function TakeTest() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, isAdmin, standard } = useUser()
  const test = tests.find((t) => t.id === Number(id))

  // a student can only take tests of their own class
  const allowed = Boolean(test) && !isAdmin && test.standard === standard

  const [answers, setAnswers] = useState({})
  const [secondsLeft, setSecondsLeft] = useState((test?.duration ?? 0) * 60)

  useEffect(() => {
    if (!allowed) return
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearInterval(timer)
  }, [allowed])

  useEffect(() => {
    if (allowed && secondsLeft <= 0) submit()
  }, [secondsLeft])

  function submit() {
    const score = test.questions.filter((q, i) => answers[i] === q.answer).length
    const result = {
      id: Date.now(),
      testId: test.id,
      title: test.title,
      student: currentUser,
      standard: test.standard,
      score,
      total: test.questions.length,
      date: new Date().toLocaleDateString('en-IN'),
      answers,
    }
    const saved = JSON.parse(localStorage.getItem('results') || '[]')
    localStorage.setItem('results', JSON.stringify([result, ...saved]))
    navigate('/results')
  }

  if (!allowed) {
    const title = !test
      ? 'Test not found'
      : isAdmin
        ? 'Students attempt tests'
        : 'Not available for your class'
    const text = !test
      ? 'This test does not exist.'
      : isAdmin
        ? 'Log in as a student to attempt this test.'
        : 'This test belongs to a different class.'
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
        <Lock className="mx-auto text-slate-400" size={32} />
        <h1 className="mt-3 text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-slate-500">{text}</p>
        <Link to="/tests" className="mt-4 inline-block font-medium text-indigo-600">
          Back to tests
        </Link>
      </div>
    )
  }

  const mins = String(Math.max(0, Math.floor(secondsLeft / 60))).padStart(2, '0')
  const secs = String(Math.max(0, secondsLeft % 60)).padStart(2, '0')
  const answered = Object.keys(answers).length

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-2 flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
        <div>
          <h1 className="font-semibold">{test.title}</h1>
          <p className="text-xs text-slate-500">
            {answered} of {test.questions.length} answered · {currentUser}
          </p>
        </div>
        <div className={`flex items-center gap-1 font-mono text-lg font-semibold ${secondsLeft < 60 ? 'text-red-500' : 'text-slate-800'}`}>
          <Timer size={18} /> {mins}:{secs}
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {test.questions.map((q, qi) => (
          <div key={qi} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="font-medium">{qi + 1}. {q.q}</p>
            <div className="mt-3 grid gap-2">
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  onClick={() => setAnswers({ ...answers, [qi]: oi })}
                  className={`rounded-xl border px-4 py-2 text-left text-sm transition ${
                    answers[qi] === oi
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={submit}
        className="mt-6 rounded-xl bg-gold-400 px-6 py-3 font-medium text-navy-900 hover:bg-gold-300"
      >
        Submit test
      </button>
    </div>
  )
}
