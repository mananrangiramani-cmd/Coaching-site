import { useEffect, useState } from 'react'

export default function DonutRing({ value, size = 130 }) {
  const r = 46
  const c = 2 * Math.PI * r
  const [go, setGo] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setGo(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <circle cx="60" cy="60" r={r} fill="none" strokeWidth="12" className="stroke-slate-200" />
      <circle
        cx="60" cy="60" r={r} fill="none" strokeWidth="12" stroke="#f5c542" strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={go ? c * (1 - value / 100) : c}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="66" textAnchor="middle" fontSize="22" fontWeight="700" className="fill-slate-900">
        {value}%
      </text>
    </svg>
  )
}