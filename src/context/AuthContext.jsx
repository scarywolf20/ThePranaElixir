import { createContext, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'

import { auth, db } from '../firebase'

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

        await setDoc(
          doc(db, 'users', cred.user.uid),
          {
            name: name || cred.user.displayName || '',
            email: cred.user.email || email,
            createdAt: serverTimestamp(),
          },
          { merge: true },
        )
        return cred.user
      },
      async login({ email, password }) {
        const cred = await signInWithEmailAndPassword(auth, email, password)

        await setDoc(
          doc(db, 'users', cred.user.uid),
          {
            email: cred.user.email || email,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        )
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
