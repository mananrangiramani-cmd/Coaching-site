export default function TrendChart({ points }) {
  // points: [{ label, value }] with value 0 to 100
  if (points.length === 0) return <p className="text-sm text-slate-500">No tests taken yet.</p>
  const W = 320, H = 130, P = 22
  const x = (i) => (points.length === 1 ? W / 2 : P + (i * (W - 2 * P)) / (points.length - 1))
  const y = (v) => H - P - (v / 100) * (H - 2 * P)
  const line = points.map((p, i) => `${x(i)},${y(p.value)}`).join(' ')
  const diff = points[points.length - 1].value - points[0].value

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {[0, 50, 100].map((g) => (
          <g key={g}>
            <line x1={P} x2={W - P} y1={y(g)} y2={y(g)} className="stroke-slate-200" strokeDasharray="3 3" />
            <text x={2} y={y(g) + 3} fontSize="9" className="fill-slate-500">{g}</text>
          </g>
        ))}
        <polyline points={line} fill="none" className="stroke-gold-500" strokeWidth="2.5" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(p.value)} r="4" className="fill-gold-400 stroke-navy-900" strokeWidth="1.5" />
            <title>{p.label}: {p.value}%</title>
          </g>
        ))}
      </svg>
      {points.length > 1 && (
        <p className="text-sm text-slate-600">
          {diff >= 0 ? '↑ Improving' : '↓ Dropping'} ({diff >= 0 ? '+' : ''}{diff} points since first test)
        </p>
      )}
    </div>
  )
}