import { useState } from 'react'
import { FileText, Video, Link as LinkIcon, Trash2, Upload, ExternalLink, X } from 'lucide-react'
import { useUser } from '../context/UserContext'
import StandardSelect from '../components/StandardSelect'
import { SUBJECTS } from '../utils/progress'
import { putFile, getFile, removeFile } from '../utils/materialStore'
import { useToast } from '../context/ToastContext'

const KEY = 'materials-v1'
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }
const KIND_ICON = { pdf: FileText, video: Video, link: LinkIcon }

export default function Materials() {
  const { role, currentUser, standard, subject: mySubject } = useUser()
  const name = typeof currentUser === 'string' ? currentUser : currentUser?.name

  const [items, setItems] = useState(load)
  const [fSubject, setFSubject] = useState('all')
  const [view, setView] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [form, setForm] = useState({
    title: '', subject: mySubject || 'Physics', module: '', kind: 'pdf', link: '', file: null,
  })
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const modules = [...(SUBJECTS[form.subject] || []), 'Other']
  const mod = form.module && modules.includes(form.module) ? form.module : modules[0]

  const save = (next) => { setItems(next); localStorage.setItem(KEY, JSON.stringify(next)) }

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    if (!form.title.trim()) return setErr('Add a title.')
    if (form.kind === 'link' ? !form.link.trim() : !form.file)
      return setErr(form.kind === 'link' ? 'Paste a link.' : 'Choose a file.')
    if (form.file && form.file.size > 150 * 1024 * 1024) return setErr('File is too large (max 150 MB).')

    setBusy(true)
    const id = Date.now()
    try {
      if (form.kind !== 'link') await putFile(String(id), form.file)
      save([{
        id, standard, subject: form.subject, module: mod, title: form.title.trim(),
        kind: form.kind, link: form.kind === 'link' ? form.link.trim() : '',
        fileName: form.file?.name || '', by: name, role,
        date: new Date().toISOString().slice(0, 10),
      }, ...items])
      toast('Material posted')
      setForm((p) => ({ ...p, title: '', link: '', file: null }))
      e.target.reset()
    } catch {
      setErr('Could not save the file in this browser.')
    }
    setBusy(false)
  }

  const openItem = async (it) => {
    if (view) URL.revokeObjectURL(view.url)
    if (view?.id === it.id) return setView(null)
    const blob = await getFile(String(it.id))
    if (!blob) return setErr('This file is not stored in this browser.')
    setView({ id: it.id, kind: it.kind, url: URL.createObjectURL(blob), name: it.fileName })
  }

  const remove = async (it) => {
    if (it.kind !== 'link') { try { await removeFile(String(it.id)) } catch {} }
    if (view?.id === it.id) setView(null)
    save(items.filter((x) => x.id !== it.id))
  }

  const shown = items
    .filter((it) => it.standard === standard)
    .filter((it) => fSubject === 'all' || it.subject === fSubject)

  const groups = {}
  shown.forEach((it) => {
    const g = `${it.subject} · ${it.module}`
    ;(groups[g] ||= []).push(it)
  })

  const input = 'w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900'
  const toast = useToast()
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Study material</h1>
        <div className="flex flex-wrap gap-2">
          <StandardSelect />
          <select className="rounded-lg border border-slate-300 bg-white p-2 text-slate-900"
            value={fSubject} onChange={(e) => setFSubject(e.target.value)}>
            <option value="all">All subjects</option>
            {Object.keys(SUBJECTS).map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* post form */}
      <form onSubmit={submit} className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
        <p className="flex items-center gap-2 font-semibold text-slate-900">
          <Upload size={18} className="text-gold-500" /> Share material with Class {standard}th
        </p>
        <input className={input} placeholder="Title (e.g. Kinematics short notes)"
          value={form.title} onChange={(e) => set('title', e.target.value)} />
        <div className="grid gap-2 sm:grid-cols-3">
          <select className={input} value={form.subject} disabled={role === 'faculty'}
            onChange={(e) => set('subject', e.target.value)}>
            {Object.keys(SUBJECTS).map((s) => <option key={s}>{s}</option>)}
          </select>
          <select className={input} value={mod} onChange={(e) => set('module', e.target.value)}>
            {modules.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select className={input} value={form.kind}
            onChange={(e) => setForm((p) => ({ ...p, kind: e.target.value, file: null, link: '' }))}>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="link">Link</option>
          </select>
        </div>
        {form.kind === 'link' ? (
          <input className={input} placeholder="https://..." value={form.link}
            onChange={(e) => set('link', e.target.value)} />
        ) : (
          <input type="file" className={input}
            accept={form.kind === 'pdf' ? 'application/pdf' : 'video/*'}
            onChange={(e) => set('file', e.target.files[0] || null)} />
        )}
        {err && <p className="text-sm text-rose-600">{err}</p>}
        <button disabled={busy} className="rounded-lg bg-gold-400 px-5 py-2 font-semibold text-navy-900 disabled:opacity-60">
          {busy ? 'Saving...' : 'Post'}
        </button>
      </form>

      {/* module-wise list */}
      {Object.keys(groups).length === 0 && (
        <p className="text-slate-500">No material yet for this class. Be the first to post.</p>
      )}

      {Object.entries(groups).map(([g, list]) => (
        <div key={g}>
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-navy-900">{g}</p>
          <div className="space-y-2">
            {list.map((it) => {
              const Icon = KIND_ICON[it.kind]
              const mine = role === 'admin' || it.by === name
              return (
                <div key={it.id} className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="shrink-0 text-gold-500" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900">{it.title}</p>
                      <p className="text-xs text-slate-500">
                        {it.by} ({it.role === 'student' ? 'Student' : 'Faculty'}) · {it.date}
                      </p>
                    </div>
                    {it.kind === 'link' ? (
                      <a href={it.link} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-sm font-medium text-indigo-600">
                        Open <ExternalLink size={14} />
                      </a>
                    ) : (
                      <button onClick={() => openItem(it)} className="text-sm font-medium text-indigo-600">
                        {view?.id === it.id ? 'Close' : it.kind === 'pdf' ? 'View' : 'Play'}
                      </button>
                    )}
                    {mine && (
                      <button onClick={() => remove(it)} title="Delete">
                        <Trash2 size={16} className="text-slate-400 hover:text-rose-500" />
                      </button>
                    )}
                  </div>

                  {view?.id === it.id && (
                    <div className="mt-3">
                      {it.kind === 'pdf' ? (
                        <iframe src={view.url} title={it.title} className="h-[60vh] w-full rounded-lg border md:h-[480px]" />
                      ) : (
                        <video src={view.url} controls className="w-full rounded-lg bg-black" />
                      )}
                      <a href={view.url} download={view.name}
                        className="mt-2 inline-block text-sm text-indigo-600">Download</a>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}