import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, Info } from 'lucide-react'

const Ctx = createContext(() => {})
export const useToast = () => useContext(Ctx)

export function ToastProvider({ children }) {
  const [list, setList] = useState([])

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setList((l) => [...l, { id, message, type }])
    setTimeout(() => setList((l) => l.filter((t) => t.id !== id)), 3200)
  }, [])

  return (
    <Ctx.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed left-1/2 top-4 z-[70] flex w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2">
        {list.map((t) => (
          <div key={t.id} className="page-enter flex items-center gap-2 rounded-xl bg-navy-900 px-4 py-3 text-sm font-medium text-white shadow-xl">
            {t.type === 'success'
              ? <CheckCircle2 size={18} className="shrink-0 text-gold-400" />
              : <Info size={18} className="shrink-0 text-gold-400" />}
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}