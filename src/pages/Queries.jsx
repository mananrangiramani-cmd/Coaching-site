import { useEffect, useState } from 'react'
import DoubtCard from '../components/DoubtCard'
import CommunityPanel from '../components/CommunityPanel'
import { initialDoubts, subjects } from '../data/doubts'
import { useUser } from '../context/UserContext'
export default function Queries() {
  const [doubts, setDoubts] = useState(() => {
    try {
      const saved = localStorage.getItem('doubts-v2')
      return saved ? JSON.parse(saved) : initialDoubts
    } catch {
      return initialDoubts
    }
  })
     const { currentUser } = useUser()
  const [text, setText] = useState('')
  const [subject, setSubject] = useState('Physics')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    localStorage.setItem('doubts-v2', JSON.stringify(doubts))
  }, [doubts])

  function addDoubt(e) {
    e.preventDefault()
    if (!text.trim()) return
    setDoubts([
      { id: Date.now(), author: currentUser, subject, text: text.trim(), time: 'Just now', upvotes: 0, replies: [] },
      ...doubts,
    ])
    setText('')
  }

  function upvote(id) {
    setDoubts(doubts.map((d) => (d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d)))
  }

  function addReply(id, replyText) {
    setDoubts(
      doubts.map((d) =>
        d.id === id
          ? { ...d, replies: [...d.replies, { id: Date.now(), author: currentUser, accepted: false, text: replyText }] }
          : d
      )
    )
  }

  function acceptReply(doubtId, replyId) {
    setDoubts(
      doubts.map((d) =>
        d.id === doubtId
          ? { ...d, replies: d.replies.map((r) => (r.id === replyId ? { ...r, accepted: true } : r)) }
          : d
      )
    )
  }

  const visible = filter === 'All' ? doubts : doubts.filter((d) => d.subject === filter)

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Doubts</h1>
          <p className="mt-1 text-slate-500">Ask, answer and learn together.</p>
        </div>
          <p className="text-sm text-slate-500">
     Posting as <span className="font-medium text-slate-800">{currentUser}</span>
   </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div>
          <form onSubmit={addDoubt} className="rounded-2xl bg-white p-4 shadow-sm">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's your doubt?"
              rows={3}
              className="w-full resize-none text-sm outline-none"
            />
            <div className="mt-3 flex items-center justify-between">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm outline-none"
              >
                {subjects.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <button className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-700">
                Post doubt
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap gap-2">
            {['All', ...subjects].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  filter === s ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            {visible.map((d) => (
              <DoubtCard
                key={d.id}
                doubt={d}
                currentUser={currentUser}
                onUpvote={upvote}
                onReply={addReply}
                onAccept={acceptReply}
              />
            ))}
            {visible.length === 0 && <p className="text-slate-500">No doubts in this subject yet.</p>}
          </div>
        </div>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <CommunityPanel doubts={doubts} />
        </aside>
      </div>
    </div>
  )
}