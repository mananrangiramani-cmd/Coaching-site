import { useEffect, useState } from 'react'
import { CheckCircle2, ChevronDown, Clock, Wallet } from 'lucide-react'
import { students } from '../data/students'
import { initialPayments } from '../data/payments'

const inr = (n) => '₹' + n.toLocaleString('en-IN')

const badge = {
  Completed: 'bg-emerald-100 text-emerald-600',
  Paid: 'bg-emerald-100 text-emerald-600',
  Pending: 'bg-amber-100 text-amber-600',
}

function initials(name) {
  return name.split(' ').map((n) => n[0]).join('')
}

function summarize(record) {
  const sum = (status) =>
    record.installments.filter((i) => i.status === status).reduce((s, i) => s + i.amount, 0)
  const paid = sum('Paid')
  const pending = sum('Pending')
  return { paid, pending, status: pending === 0 ? 'Completed' : 'Pending' }
}

export default function Payments() {
  const [payments, setPayments] = useState(() => {
    try {
      const saved = localStorage.getItem('payments-v1')
      return saved ? JSON.parse(saved) : initialPayments
    } catch {
      return initialPayments
    }
  })
  const [filter, setFilter] = useState('All')
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    localStorage.setItem('payments-v1', JSON.stringify(payments))
  }, [payments])

  function markPaid(studentId, installmentId) {
    setPayments(
      payments.map((p) =>
        p.studentId === studentId
          ? {
              ...p,
              installments: p.installments.map((i) =>
                i.id === installmentId
                  ? { ...i, status: 'Paid', paidOn: new Date().toLocaleDateString('en-IN'), mode: 'Office' }
                  : i
              ),
            }
          : p
      )
    )
  }

  const rows = payments
    .map((p) => ({ ...p, student: students.find((s) => s.id === p.studentId), ...summarize(p) }))
    .filter((r) => r.student)

  const visible = filter === 'All' ? rows : rows.filter((r) => r.status === filter)

  const summary = [
    { label: 'Collected', value: inr(rows.reduce((s, r) => s + r.paid, 0)), icon: CheckCircle2 },
    { label: 'Pending amount', value: inr(rows.reduce((s, r) => s + r.pending, 0)), icon: Clock },
    { label: 'Students with dues', value: rows.filter((r) => r.status === 'Pending').length, icon: Wallet },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="mt-1 text-slate-500">Admin view of fee payments.</p>
        </div>
        <label className="text-sm text-slate-500">
          Show{' '}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="ml-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-800 outline-none"
          >
            <option>All</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {summary.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <Icon size={20} className="text-gold-500" />
            <p className="mt-3 text-2xl font-bold">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {visible.map((r) => {
          const open = openId === r.studentId
          return (
            <div key={r.studentId} className="rounded-2xl bg-white shadow-sm">
              <button
                onClick={() => setOpenId(open ? null : r.studentId)}
                className="flex w-full items-center gap-4 p-4 text-left"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                  {initials(r.student.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{r.student.name}</p>
                  <p className="text-sm text-slate-500">
                    {inr(r.paid)} paid of {inr(r.totalFee)}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${badge[r.status]}`}>
                  {r.status}
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
                />
              </button>

              {open && (
                <div className="border-t border-slate-100 px-4 pb-4">
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Payment history
                  </p>
                  <div className="mt-2 divide-y divide-slate-100">
                    {r.installments.map((i) => (
                      <div key={i.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                        <div>
                          <p className="text-sm font-medium">{i.label}</p>
                          <p className="text-xs text-slate-400">
                            {i.status === 'Paid'
                              ? `Paid on ${i.paidOn} via ${i.mode}`
                              : `Due ${i.dueDate}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-semibold">{inr(i.amount)}</p>
                          <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${badge[i.status]}`}>
                            {i.status}
                          </span>
                          {i.status === 'Pending' && (
                            <button
                              onClick={() => markPaid(r.studentId, i.id)}
                              className="rounded-lg bg-gold-400 px-3 py-1 text-xs font-medium text-navy-900 hover:bg-gold-300"
                            >
                              Mark paid
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {visible.length === 0 && <p className="text-slate-500">No students in this category.</p>}
      </div>
    </div>
  )
}