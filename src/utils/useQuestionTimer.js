import { useRef } from 'react'

// counts seconds spent on each question
export function useQuestionTimer() {
  const times = useRef([])
  const cur = useRef(null)
  const since = useRef(Date.now())

  const flush = () => {
    const now = Date.now()
    if (cur.current !== null) {
      times.current[cur.current] = (times.current[cur.current] || 0) + (now - since.current) / 1000
    }
    since.current = now
  }

  return {
    enter: (i) => { flush(); cur.current = i },
    // all questions on one page: the time since the last answer goes to this question
    mark: (i) => {
      const now = Date.now()
      times.current[i] = (times.current[i] || 0) + (now - since.current) / 1000
      since.current = now
    },
    snapshot: (count) => {
      flush()
      return Array.from({ length: count }, (_, i) => Math.round(times.current[i] || 0))
    },
  }
}