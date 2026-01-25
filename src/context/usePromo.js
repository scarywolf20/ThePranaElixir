import { useContext } from 'react'
import { PromoContext } from './PromoContext'

export function usePromo() {
  const ctx = useContext(PromoContext)
  if (!ctx) {
    throw new Error('usePromo must be used within a PromoProvider')
  }
  return ctx
}
