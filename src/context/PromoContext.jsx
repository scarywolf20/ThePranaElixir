import { createContext, useEffect, useMemo, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

const PromoContext = createContext(null)

export function PromoProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [promo, setPromo] = useState({
    enabled: true,
    text: "",
    code: "",
    discountType: "percentage",
    discountValue: 0,
  })

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'settings', 'promo'),
      (snap) => {
        const data = snap.data() || {}
        setPromo({
          enabled: data.enabled !== false,
          text: typeof data.text === 'string' ? data.text : "",
          code: typeof data.code === 'string' ? data.code.trim().toUpperCase() : "",
          discountType: data.discountType === 'fixed' ? 'fixed' : 'percentage',
          discountValue: Number(data.discountValue || 0),
        })
        setLoading(false)
      },
      () => {
        setLoading(false)
      },
    )
    return () => unsub()
  }, [])

  const promoCoupon = useMemo(() => {
    if (!promo.enabled) return null
    if (!promo.code) return null
    if (!Number(promo.discountValue || 0)) return null
    return {
      code: promo.code,
      type: promo.discountType,
      discount: Number(promo.discountValue || 0),
    }
  }, [promo.code, promo.discountType, promo.discountValue, promo.enabled])

  const value = useMemo(() => {
    return {
      loading,
      promo,
      promoCoupon,
      promoText: promo.enabled ? promo.text : "",
      promoEnabled: !!promo.enabled,
    }
  }, [loading, promo, promoCoupon])

  return <PromoContext.Provider value={value}>{children}</PromoContext.Provider>
}

export { PromoContext }
