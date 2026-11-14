export default function ProgressBar({ label, value, sub }) {
  const color = value >= 75 ? 'bg-emerald-500' : value >= 50 ? 'bg-gold-400' : 'bg-rose-500'
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-slate-700">{label}</span>
        <span className="font-semibold text-slate-900">{value}%{sub ? ` ${sub}` : ''}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}