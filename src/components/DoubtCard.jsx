import { useState } from 'react'
import { ArrowBigUp, CheckCircle2, MessageCircle } from 'lucide-react'

const subjectColors = {
  Physics: 'bg-indigo-100 text-indigo-600',
  Maths: 'bg-emerald-100 text-emerald-600',
  Chemistry: 'bg-amber-100 text-amber-600',
  Biology: 'bg-rose-100 text-rose-600',
  Other: 'bg-slate-100 text-slate-600',
}

// readOnly is used for the admin: they can see everything but not post or answer.
export default function DoubtCard({ doubt, currentUser, readOnly = false, onUpvote, onReply, onAccept }) {
  const [showReplies, setShowReplies] = useState(false)
  const [replyText, setReplyText] = useState('')

  const solved = doubt.replies.some((r) => r.accepted)
  const isAsker = currentUser === doubt.author

  function handleReply(e) {
    e.preventDefault()
    if (!replyText.trim()) return
    onReply(doubt.id, replyText.trim())
    setReplyText('')
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
            {doubt.author.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <p className="text-sm font-semibold">{doubt.author}</p>
            <p className="text-xs text-slate-400">{doubt.time}</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${subjectColors[doubt.subject]}`}>
          {doubt.subject}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-700">{doubt.text}</p>

      <div className="mt-4 flex items-center gap-4 text-sm">
        <button
          onClick={() => onUpvote(doubt.id)}
          disabled={readOnly}
          className="flex items-center gap-1 text-slate-500 enabled:hover:text-indigo-600"
        >
          <ArrowBigUp size={18} /> {doubt.upvotes}
        </button>
        <button
          onClick={() => setShowReplies(!showReplies)}
          className="flex items-center gap-1 text-slate-500 hover:text-indigo-600"
        >
          <MessageCircle size={16} /> {doubt.replies.length} {doubt.replies.length === 1 ? 'answer' : 'answers'}
        </button>
        {solved && (
          <span className="ml-auto flex items-center gap-1 font-medium text-emerald-600">
            <CheckCircle2 size={16} /> Solved
          </span>
        )}
      </div>

      {showReplies && (
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          {doubt.replies.map((r) => (
            <div
              key={r.id}
              className={`rounded-xl p-3 ${r.accepted ? 'bg-emerald-50 ring-1 ring-emerald-200' : 'bg-slate-50'}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-600">{r.author}</p>
                {r.accepted && (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <CheckCircle2 size={14} /> Accepted answer
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-700">{r.text}</p>
              {isAsker && !solved && r.author !== currentUser && (
                <button
                  onClick={() => onAccept(doubt.id, r.id)}
                  className="mt-2 text-xs font-medium text-indigo-600 hover:underline"
                >
                  This solved my doubt
                </button>
              )}
            </div>
          ))}
          {doubt.replies.length === 0 && <p className="text-sm text-slate-500">No answers yet.</p>}

          {!readOnly && (
            <form onSubmit={handleReply} className="flex gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write an answer..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
              <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
                Answer
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
