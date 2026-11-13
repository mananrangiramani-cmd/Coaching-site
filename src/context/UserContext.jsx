import { createContext, useContext, useEffect, useState } from 'react'
import { users } from '../data/users'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser')
    // fall back to a student if the saved name is not one of the 3 accounts
    return users.some((u) => u.name === saved) ? saved : users[1].name
  })

  useEffect(() => {
    localStorage.setItem('currentUser', currentUser)
  }, [currentUser])

  const role = users.find((u) => u.name === currentUser)?.role ?? 'student'

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, role, isAdmin: role === 'admin' }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}