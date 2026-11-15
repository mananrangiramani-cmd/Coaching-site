import { useEffect, useState } from 'react'

export default function BarChart({ data, suffix = '%' }) {
  const [go, setGo] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setGo(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex h-44 items-end gap-3">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center justify-end gap-1">
          <span className="text-xs font-semibold text-slate-700">{d.value}{suffix}</span>
          <div
            className="w-full rounded-t-lg"
            style={{
              height: go ? `${d.value * 1.1}px` : '0px',
              background: 'linear-gradient(180deg, #f5c542, #1a2e6b)',
              transition: 'height 0.8s ease',
            }}
          />
          <span className="text-xs text-slate-500">{d.label}</span>
        </div>
      ))}
    </div>
  )
}