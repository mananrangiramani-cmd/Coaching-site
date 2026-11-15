import { useState } from 'react'
import { Megaphone, Trash2 } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { initialAnnouncements } from '../data/announcements'
import { useToast } from '../context/ToastContext'

const KEY = 'announcements-v1'
const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || initialAnnouncements } catch { return initialAnnouncements }
}

export default function Announcements() {
  const { role, standard } = useUser()
  const [list, setList] = useState(load)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [to, setTo] = useState('all')

  const save = (next) => { setList(next); localStorage.setItem(KEY, JSON.stringify(next)) }

  const post = (e) => {
    e.preventDefault()
    if (!title.trim() || !text.trim()) return
    save([{ id: Date.now(), title: title.trim(), text: text.trim(), standard: to, date: new Date().toISOString().slice(0, 10) }, ...list])
    toast('Announcement posted')
    setTitle(''); setText('')
  }

  const shown = list
    .filter((a) => role !== 'student' || a.standard === 'all' || Number(a.standard) === standard)
    .slice(0, 6)

  const input = 'w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900'
  const toast = useToast()
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="flex items-center gap-2 font-semibold text-slate-900">
        <Megaphone size={18} className="text-gold-500" /> Announcements
      </p>

      {role === 'admin' && (
        <form onSubmit={post} className="mt-3 space-y-2 rounded-xl bg-slate-50 p-3">
          <input className={input} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className={input} rows={2} placeholder="Message" value={text} onChange={(e) => setText(e.target.value)} />
          <div className="flex gap-2">
            <select className={input} value={to} onChange={(e) => setTo(e.target.value)}>
              <option value="all">All classes</option>
              {[9, 10, 11, 12].map((c) => <option key={c} value={c}>Class {c}th</option>)}
            </select>
            <button className="rounded-lg bg-gold-400 px-4 font-semibold text-navy-900">Post</button>
          </div>
        </form>
      )}

      <div className="mt-3 space-y-3">
        {shown.length === 0 && <p className="text-sm text-slate-500">No announcements.</p>}
        {shown.map((a) => (
          <div key={a.id} className="rounded-xl bg-slate-50 p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{a.title}</p>
              {role === 'admin' && (
                <button onClick={() => save(list.filter((x) => x.id !== a.id))} title="Delete">
                  <Trash2 size={15} className="text-slate-400 hover:text-rose-500" />
                </button>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-700">{a.text}</p>
            <p className="mt-1 text-xs text-slate-500">
              {a.date} · {a.standard === 'all' ? 'All classes' : `Class ${a.standard}th`}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}