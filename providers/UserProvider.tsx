'use client'
import React, { createContext, useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { app } from '../firebaseClient'

type User = any
export const UserContext = createContext<any>({})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    const auth = getAuth(app)
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsub()
  }, [])
  const value = { user, setUser }
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
