import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'

const ACTIVE_BG = 'color-mix(in srgb, currentColor 14%, transparent)'
const HOVER_BG = 'color-mix(in srgb, currentColor 8%, transparent)'

export default function BranchedMenu({
  items = [],
  defaultOpen = [],
  defaultActive = null,
  onSelect,
  color = '#f5f5f5',
  accentColor = '#f5f5f5',
  lineColor = '#3f3f46',
  width = 240,
  rowHeight = 36,
  indent = 40,
  trunk = 14,
  radius = 10,
  lineWidth = 1.5,
  fontSize = 14,
  drawDuration = 400,
  foldDuration = 300,
}) {
  const [open, setOpen] = useState(() => new Set(defaultOpen))
  const [active, setActive] = useState(defaultActive)

  function toggle(i) {
    const next = new Set(open)
    next.has(i) ? next.delete(i) : next.add(i)
    setOpen(next)
  }

  function pick(item) {
    setActive(item.value)
    onSelect?.(item.value, item)
  }

  const r = Math.min(radius, rowHeight / 2, indent - trunk - 4)

  return (
    <div style={{ width, fontSize, color, userSelect: 'none' }}>
      {items.map((group, gi) => {
        const isOpen = open.has(gi)
        const kids = group.children || []
        const height = kids.length * rowHeight
        const lastCy = (kids.length - 1) * rowHeight + rowHeight / 2

        return (
          <div key={group.label}>
            <button
              onClick={() => toggle(gi)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                height: rowHeight, padding: '0 8px', background: 'none', border: 0,
                color, cursor: 'pointer', textAlign: 'left', fontSize, fontWeight: 600,
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  transition: `transform ${foldDuration}ms ease`,
                  transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="currentColor" />
              </span>
              {group.label}
            </button>

            <div
              style={{
                display: 'grid',
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                transition: `grid-template-rows ${foldDuration}ms ease`,
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div style={{ position: 'relative', height }}>
                  <svg
                    width={indent}
                    height={height}
                    fill="none"
                    stroke={lineColor}
                    strokeWidth={lineWidth}
                    strokeLinecap="round"
                    style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}
                  >
                    {kids.length > 0 && (
                      <path
                        d={`M ${trunk} 0 V ${Math.max(lastCy - r, 0)}`}
                        pathLength={1}
                        style={{
                          strokeDasharray: 1,
                          strokeDashoffset: isOpen ? 0 : 1,
                          transition: `stroke-dashoffset ${drawDuration}ms ease`,
                        }}
                      />
                    )}
                    {kids.map((_, i) => {
                      const cy = i * rowHeight + rowHeight / 2
                      return (
                        <path
                          key={i}
                          d={`M ${trunk} ${cy - r} A ${r} ${r} 0 0 0 ${trunk + r} ${cy} H ${indent - 4}`}
                          pathLength={1}
                          style={{
                            strokeDasharray: 1,
                            strokeDashoffset: isOpen ? 0 : 1,
                            transition: `stroke-dashoffset ${drawDuration}ms ease ${isOpen ? 120 : 0}ms`,
                          }}
                        />
                      )
                    })}
                  </svg>

                  {kids.map((item) => {
                    const isActive = active === item.value
                    return (
                      <button
                        key={item.value}
                        onClick={() => pick(item)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          height: rowHeight, width: width - indent, marginLeft: indent,
                          padding: '0 10px', border: 0, borderRadius: 8, cursor: 'pointer',
                          textAlign: 'left', fontSize,
                          color: isActive ? accentColor : color,
                          background: isActive ? ACTIVE_BG : 'transparent',
                          fontWeight: isActive ? 600 : 400,
                          transition: 'background 150ms ease',
                        }}
                        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = HOVER_BG }}
                        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                      >
                        {item.icon && (
                          <HugeiconsIcon icon={item.icon} size={fontSize + 4} color="currentColor" />
                        )}
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}