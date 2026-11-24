import { useSyncExternalStore } from 'react'
import { ITEMS, seedOrders } from '../data/menu'
import { calcTotals } from '../lib/format'

/*
 * Shared store for menu items and orders.
 *
 * Today: state lives in memory and is saved to localStorage. The "storage" event
 * keeps other tabs of the same browser in sync, so /m and /admin can be open
 * side by side on one laptop.
 *
 * Later: replace the body of each action with a Firestore call (addDoc, updateDoc)
 * and replace the state with an onSnapshot listener. Components only use
 * useShop() and `actions`, so they do not need to change.
 */

const KEY = 'spice-route-demo-v1'

const fresh = () => ({ items: ITEMS, orders: seedOrders(), nextOrder: 1043, nextItem: 1 })

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY))
    if (s && s.items && s.orders) return s
  } catch {
    /* ignore corrupt or missing data */
  }
  return null
}

let state = load() || fresh()
const listeners = new Set()
const emit = () => listeners.forEach((l) => l())

function set(patch) {
  state = { ...state, ...patch }
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage can be unavailable in private windows */
  }
  emit()
}

window.addEventListener('storage', (e) => {
  if (e.key === KEY) {
    const s = load()
    if (s) {
      state = s
      emit()
    }
  }
})

const subscribe = (cb) => {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export const useShop = () => useSyncExternalStore(subscribe, () => state)

const NEXT = { new: 'preparing', preparing: 'ready', ready: 'served' }

export const actions = {
  placeOrder({ table, lines, note, pay }) {
    const order = {
      id: state.nextOrder,
      table,
      lines: lines.map((l) => ({ ...l })),
      note: note.trim(),
      total: calcTotals(lines).total,
      pay,
      status: 'new',
      t: Date.now(),
    }
    set({ orders: [order, ...state.orders], nextOrder: state.nextOrder + 1 })
    return order
  },
  advanceOrder(id) {
    set({ orders: state.orders.map((o) => (o.id === id && NEXT[o.status] ? { ...o, status: NEXT[o.status] } : o)) })
  },
  toggleStock(id) {
    set({ items: state.items.map((i) => (i.id === id ? { ...i, stock: !i.stock } : i)) })
  },
  setPrice(id, price) {
    set({ items: state.items.map((i) => (i.id === id ? { ...i, price } : i)) })
  },
  addItem({ name, price, cat, veg }) {
    const item = {
      id: 'new-' + state.nextItem,
      name,
      price,
      cat,
      veg,
      desc: 'Added just now.',
      hue: Math.floor(Math.random() * 360),
      stock: true,
    }
    set({ items: [...state.items, item], nextItem: state.nextItem + 1 })
  },
  deleteItem(id) {
    set({ items: state.items.filter((i) => i.id !== id) })
  },
  resetDemo() {
    set(fresh())
  },
}
