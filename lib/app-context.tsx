"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { type User, type UserRole, users } from "./data"

interface AppContextType {
  currentUser: User
  setCurrentUser: (user: User) => void
  userRole: UserRole
  switchRole: (role: UserRole) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(users[0]) // Default student

  const switchRole = (role: UserRole) => {
    const newUser = users.find(u => u.role === role)
    if (newUser) {
      setCurrentUser(newUser)
    }
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userRole: currentUser.role,
        switchRole,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
