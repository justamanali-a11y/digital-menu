import { createContext, useContext, useMemo, useReducer, useState } from 'react'
import { calcTotals } from '../lib/format'

const Ctx = createContext(null)

function reducer(lines, a) {
  switch (a.type) {
    case 'add': {
      const i = lines.findIndex((l) => l.id === a.item.id)
      if (i >= 0) {
        return lines.map((l, j) => (j === i ? { ...l, qty: l.qty + a.qty, note: a.note || l.note } : l))
      }
      return [...lines, { id: a.item.id, name: a.item.name, price: a.item.price, qty: a.qty, note: a.note || '' }]
    }
    case 'inc':
      return lines.map((l) => (l.id === a.id ? { ...l, qty: l.qty + 1 } : l))
    case 'dec':
      return lines.flatMap((l) => (l.id !== a.id ? [l] : l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : []))
    case 'clear':
      return []
    default:
      return lines
  }
}

// The cart belongs to one customer's phone, so it is not part of the shared shop store.
export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, [])
  const [note, setNote] = useState('')
  const [coupon, setCoupon] = useState(null) // { code, type, value, min }
  const [tipPct, setTipPct] = useState(0)

  const value = useMemo(
    () => ({
      lines,
      note,
      setNote,
      coupon,
      setCoupon,
      tipPct,
      setTipPct,
      count: lines.reduce((a, l) => a + l.qty, 0),
      totals: calcTotals(lines, coupon, tipPct),
      qtyOf: (id) => lines.find((l) => l.id === id)?.qty || 0,
      add: (item, qty = 1, n = '') => dispatch({ type: 'add', item, qty, note: n }),
      inc: (id) => dispatch({ type: 'inc', id }),
      dec: (id) => dispatch({ type: 'dec', id }),
      clear: () => {
        dispatch({ type: 'clear' })
        setNote('')
        setCoupon(null)
        setTipPct(0)
      },
    }),
    [lines, note, coupon, tipPct]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useCart = () => useContext(Ctx)
