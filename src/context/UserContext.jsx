import { createContext, useContext, useEffect, useState } from 'react'
import { students } from '../data/students'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(
    () => localStorage.getItem('currentUser') || students[0].name
  )

  useEffect(() => {
    localStorage.setItem('currentUser', currentUser)
  }, [currentUser])

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}