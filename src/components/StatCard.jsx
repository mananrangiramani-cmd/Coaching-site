import { useEffect, useState } from 'react'

function useCount(target, ms = 800) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf, start
    const step = (t) => {
      start ??= t
      const p = Math.min((t - start) / ms, 1)
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return v
}

const TONES = {
  gold: 'bg-gold-400/20 text-gold-500',
  blue: 'bg-indigo-500/10 text-indigo-600',
  green: 'bg-emerald-500/15 text-emerald-600',
  rose: 'bg-rose-500/15 text-rose-500',
}

export default function StatCard({ icon: Icon, label, value, suffix = '', tone = 'gold' }) {
  const count = useCount(typeof value === 'number' ? value : 0)
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${TONES[tone]}`}>
        <Icon size={20} />
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-900">
        {typeof value === 'number' ? count : value}{typeof value === 'number' ? suffix : ''}
      </p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  )
}