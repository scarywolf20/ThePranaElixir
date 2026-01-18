import { createContext, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'

import { auth } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = useMemo(() => {
    return {
      user,
      loading,
      async signup({ name, email, password }) {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        if (name) {
          await updateProfile(cred.user, { displayName: name })
        }
        return cred.user
      },
      async login({ email, password }) {
        const cred = await signInWithEmailAndPassword(auth, email, password)
        return cred.user
      },
      async logout() {
        await signOut(auth)
      },
      async resetPassword(email) {
        await sendPasswordResetEmail(auth, email)
      },
    }
  }, [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }
