import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ClipboardList, Clock, Link2, Lock, PlayCircle, Trash2, Upload } from 'lucide-react'
import { courses } from '../data/courses'
import { tests } from '../data/tests'
import { useUser } from '../context/UserContext'
import { ordinal } from '../data/standards'
import StandardSelect from '../components/StandardSelect'
import { deleteFile, getFile, saveFile } from '../utils/VideoStore'

function youtubeId(url) {
  try {
    const u = new URL(url.trim())
    let id = null
    if (u.hostname === 'youtu.be') id = u.pathname.slice(1)
    else if (u.hostname.endsWith('youtube.com')) {
      if (u.pathname === '/watch') id = u.searchParams.get('v')
      else {
        const m = u.pathname.match(/^\/(embed|shorts|live)\/([^/?]+)/)
        if (m) id = m[2]
      }
    }
    return id && /^[\w-]{11}$/.test(id) ? id : null
  } catch {
    return null
  }
}

function loadVideos() {
  try {
    return JSON.parse(localStorage.getItem('course-videos-v1') || '[]')
  } catch {
    return []
  }
}

export default function CourseDetail() {
  const { id } = useParams()
  const { isAdmin, standard } = useUser()
  const course = courses.find((c) => c.id === Number(id))

  const [videos, setVideos] = useState(loadVideos)
  const [selectedId, setSelectedId] = useState(null)
  const [fileUrl, setFileUrl] = useState(null)
  const [mode, setMode] = useState('link')
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [file, setFile] = useState(null)
  const [fileKey, setFileKey] = useState(0)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    localStorage.setItem('course-videos-v1', JSON.stringify(videos))
  }, [videos])

  // videos belong to one course in one class
  const classVideos = videos.filter((v) => v.courseId === course?.id && v.standard === standard)
  const current = classVideos.find((v) => v.id === selectedId) ?? classVideos[0]

  useEffect(() => {
    setFileUrl(null)
    if (current?.kind !== 'file') return
    let url
    let cancelled = false
    getFile(current.id)
      .then((blob) => {
        if (cancelled || !blob) return
        url = URL.createObjectURL(blob)
        setFileUrl(url)
      })
      .catch(() => {})
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [current?.id, current?.kind])

  async function addVideo(e) {
    e.preventDefault()
    setError('')
    if (!title.trim()) return setError('Give the video a title.')

    const base = {
      id: Date.now(),
      courseId: course.id,
      standard,
      title: title.trim(),
      added: new Date().toLocaleDateString('en-IN'),
    }
    let video = null

    if (mode === 'link') {
      const ytId = youtubeId(link)
      if (!ytId) return setError('Paste a valid YouTube link.')
      video = { ...base, kind: 'youtube', ytId }
    } else {
      if (!file) return setError('Choose a video file.')
      if (!file.type.startsWith('video/')) return setError('That file is not a video.')
      setSaving(true)
      try {
        await saveFile(base.id, file)
        video = { ...base, kind: 'file', fileName: file.name }
      } catch {
        setError('Could not save the file in this browser.')
      }
      setSaving(false)
    }

    if (video) {
      setVideos((list) => [...list, video])
      setSelectedId(video.id)
      setTitle('')
      setLink('')
      setFile(null)
      setFileKey((k) => k + 1)
    }
  }

  function removeVideo(v) {
    setVideos((list) => list.filter((x) => x.id !== v.id))
    if (v.kind === 'file') deleteFile(v.id).catch(() => {})
  }

  if (!course || (!isAdmin && !course.standards.includes(standard))) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
        <Lock className="mx-auto text-slate-400" size={32} />
        <h1 className="mt-3 text-2xl font-bold">{course ? 'Not available for your class' : 'Course not found'}</h1>
        <Link to="/courses" className="mt-4 inline-block font-medium text-indigo-600">
          Back to courses
        </Link>
      </div>
    )
  }

  const offered = course.standards.includes(standard)
  const courseTests = tests.filter((t) => t.course === course.title && t.standard === standard)

  return (
    <div>
      <Link to="/courses" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600">
        <ArrowLeft size={16} /> Back to courses
      </Link>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium text-indigo-600">
            {course.category}
          </span>
          <h1 className="mt-2 text-3xl font-bold">{course.title}</h1>
          <p className="mt-1 text-slate-500">
            by {course.teacher} · {course.lessons} lessons · {course.hours} hrs · Class {ordinal(standard)}
          </p>
        </div>
        <StandardSelect />
      </div>

      {!offered ? (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">
          This course is not offered in Class {ordinal(standard)}. Pick another class above.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_16rem]">
          <div className="space-y-4">
            {/* Player */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {current ? (
                <>
                  <div className="aspect-video w-full bg-black">
                    {current.kind === 'youtube' ? (
                      <iframe
                        key={current.id}
                        className="h-full w-full"
                        src={`https://www.youtube-nocookie.com/embed/${current.ytId}`}
                        title={current.title}
                        allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
                        allowFullScreen
                      />
                    ) : fileUrl ? (
                      <video key={current.id} className="h-full w-full" src={fileUrl} controls />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-white/70">
                        Loading video...
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold">{current.title}</p>
                    <p className="text-xs text-slate-400">Added {current.added}</p>
                  </div>
                </>
              ) : (
                <div className="flex aspect-video items-center justify-center p-6 text-center text-slate-500">
                  {isAdmin ? 'No videos yet. Add the first one below.' : 'No videos yet. Check back soon.'}
                </div>
              )}
            </div>

            {/* Playlist */}
            {classVideos.length > 0 && (
              <div className="rounded-2xl bg-white p-2 shadow-sm">
                <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Lessons ({classVideos.length})
                </p>
                {classVideos.map((v, i) => (
                  <div
                    key={v.id}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
                      current?.id === v.id ? 'bg-indigo-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <button onClick={() => setSelectedId(v.id)} className="flex flex-1 items-center gap-3 text-left">
                      <PlayCircle size={18} className="shrink-0 text-indigo-500" />
                      <span className="text-sm font-medium">
                        {i + 1}. {v.title}
                      </span>
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => removeVideo(v)}
                        title="Delete video"
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Admin upload */}
            {isAdmin && (
              <form onSubmit={addVideo} className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="font-semibold">Add a video to Class {ordinal(standard)}</p>
                <div className="mt-3 flex gap-1 rounded-xl bg-slate-100 p-1 text-sm font-medium">
                  {[
                    { key: 'link', label: 'YouTube link', icon: Link2 },
                    { key: 'file', label: 'Upload file', icon: Upload },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setMode(key)}
                      className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 transition ${
                        mode === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                </div>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Video title, e.g. Lesson 1: Introduction"
                  className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                />

                {mode === 'link' ? (
                  <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  />
                ) : (
                  <input
                    key={fileKey}
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFile(e.target.files[0] ?? null)}
                    className="mt-3 w-full text-sm text-slate-600"
                  />
                )}

                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

                <button
                  disabled={saving}
                  className="mt-3 rounded-xl bg-gold-400 px-5 py-2 text-sm font-medium text-navy-900 hover:bg-gold-300 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Add video'}
                </button>
                <p className="mt-3 text-xs text-slate-400">
                  Demo note: uploaded files are kept in this browser only. A backend will store them for all
                  students. For now, an unlisted YouTube link is the easiest way to share a lecture.
                </p>
              </form>
            )}
          </div>

          {/* Test beside the videos */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="flex items-center gap-2 font-semibold">
                <ClipboardList size={18} className="text-gold-500" /> Test for this course
              </p>
              {courseTests.length === 0 && (
                <p className="mt-3 text-sm text-slate-500">No test for this course yet.</p>
              )}
              <div className="mt-3 space-y-3">
                {courseTests.map((t) => (
                  <div key={t.id} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-sm font-semibold">{t.title}</p>
                    <p className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                      <span>{t.questions.length} questions</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {t.duration} min
                      </span>
                    </p>
                    {isAdmin ? (
                      <p className="mt-2 text-xs text-slate-400">Students attempt this from their own login.</p>
                    ) : (
                      <Link
                        to={`/tests/${t.id}`}
                        className="mt-2 inline-block rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
                      >
                        Start test
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}