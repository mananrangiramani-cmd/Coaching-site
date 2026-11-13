import { createContext, useContext, useEffect, useState } from 'react'
import { users } from '../data/users'
import { students } from '../data/students'
import { STANDARDS } from '../data/standards'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser')
    // fall back to a student if the saved name is not one of the 3 accounts
    return users.some((u) => u.name === saved) ? saved : users[1].name
  })

  // the class the admin is currently looking at (students are locked to their own class)
  const [adminStandard, setAdminStandard] = useState(() => {
    const saved = Number(localStorage.getItem('adminStandard'))
    return STANDARDS.includes(saved) ? saved : 11
  })

  useEffect(() => {
    localStorage.setItem('currentUser', currentUser)
  }, [currentUser])

  useEffect(() => {
    localStorage.setItem('adminStandard', String(adminStandard))
  }, [adminStandard])

  const role = users.find((u) => u.name === currentUser)?.role ?? 'student'
  const isAdmin = role === 'admin'
  const me = students.find((s) => s.name === currentUser)
  const standard = isAdmin ? adminStandard : me?.standard ?? 11

  return (
    <UserContext.Provider
      value={{ currentUser, setCurrentUser, role, isAdmin, standard, setStandard: setAdminStandard }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
