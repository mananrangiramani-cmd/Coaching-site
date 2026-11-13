import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useUser } from '../context/UserContext'

export default function RequireAdmin({ children }) {
  const { isAdmin } = useUser()

  if (!isAdmin) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
        <Lock className="mx-auto text-slate-400" size={32} />
        <h1 className="mt-3 text-2xl font-bold">Admin only</h1>
        <p className="mt-1 text-slate-500">You don't have permission to view this page.</p>
        <Link to="/" className="mt-4 inline-block font-medium text-indigo-600">
          Back to home
        </Link>
      </div>
    )
  }

  return children
}