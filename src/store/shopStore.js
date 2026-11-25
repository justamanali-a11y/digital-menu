import { useSyncExternalStore } from 'react'
import {
  COUPONS, INVENTORY, ITEMS, STAFF, seedFeedback, seedOrders, seedRequests,
} from '../data/menu'

/*
 * Shared store: menu, orders, table requests, coupons, feedback, staff, inventory.
 *
 * Today: state lives in memory and is saved to localStorage. The "storage" event keeps other
 * tabs of the same browser in sync, so /m and /admin can be open side by side on one laptop.
 *
 * Later: replace the body of each action with a Firestore call (addDoc, updateDoc) and the state
 * with an onSnapshot listener. Components only use useShop() and `actions`, so they stay as they are.
 */

const KEY = 'spice-route-demo-v2'
const uid = () => Math.random().toString(36).slice(2, 9)

const fresh = () => ({
  items: ITEMS,
  orders: seedOrders(),
  requests: seedRequests(),
  coupons: COUPONS,
  feedback: seedFeedback(),
  staff: STAFF,
  inventory: INVENTORY,
  nextOrder: 1043,
  nextItem: 1,
})

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY))
    if (s && s.items && s.orders && s.requests && s.coupons && s.feedback && s.staff && s.inventory) return s
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
const patchOrder = (id, fn) => set({ orders: state.orders.map((o) => (o.id === id ? fn(o) : o)) })

export const actions = {
  // ---- orders ----
  placeOrder({ table, lines, note, pay, totals, couponCode }) {
    const order = {
      id: state.nextOrder,
      table,
      lines: lines.map((l) => ({ ...l })),
      note: note.trim(),
      sub: totals.sub,
      discount: totals.discount,
      gst: totals.gst,
      tip: totals.tip,
      total: totals.total,
      couponCode: couponCode || '',
      pay,
      status: 'new',
      t: Date.now(),
      refund: null,
      rejectReason: '',
    }
    set({ orders: [order, ...state.orders], nextOrder: state.nextOrder + 1 })
    return order
  },
  advanceOrder(id) {
    patchOrder(id, (o) => (NEXT[o.status] ? { ...o, status: NEXT[o.status] } : o))
  },
  rejectOrder(id, reason) {
    patchOrder(id, (o) => ({
      ...o,
      status: 'rejected',
      rejectReason: reason,
      refund: o.pay === 'upi' ? 'due' : null,
    }))
  },
  refundOrder(id) {
    patchOrder(id, (o) => (o.refund === 'due' ? { ...o, refund: 'done' } : o))
  },

  // ---- table service ----
  requestService(table, type) {
    if (state.requests.some((r) => r.table === table && r.type === type && !r.done)) return false
    set({ requests: [{ id: uid(), table, type, t: Date.now(), done: false }, ...state.requests] })
    return true
  },
  resolveRequest(id) {
    set({ requests: state.requests.map((r) => (r.id === id ? { ...r, done: true } : r)) })
  },

  // ---- feedback ----
  addFeedback({ orderId, table, rating, comment }) {
    if (state.feedback.some((f) => f.orderId === orderId)) return
    set({
      feedback: [{ id: uid(), orderId, table, rating, comment: comment.trim(), t: Date.now() }, ...state.feedback],
    })
  },

  // ---- menu ----
  toggleStock(id) {
    set({ items: state.items.map((i) => (i.id === id ? { ...i, stock: !i.stock } : i)) })
  },
  setPrice(id, price) {
    set({ items: state.items.map((i) => (i.id === id ? { ...i, price } : i)) })
  },
  addItem({ name, price, cat, veg }) {
    const item = {
      id: 'new-' + state.nextItem, name, price, cat, veg,
      desc: 'Added just now.', hue: Math.floor(Math.random() * 360), stock: true, tags: ['new'], spice: 0,
    }
    set({ items: [...state.items, item], nextItem: state.nextItem + 1 })
  },
  deleteItem(id) {
    set({ items: state.items.filter((i) => i.id !== id) })
  },

  // ---- offers ----
  addCoupon({ code, type, value, min }) {
    const c = code.trim().toUpperCase()
    if (!c || state.coupons.some((x) => x.code === c)) return false
    set({ coupons: [...state.coupons, { code: c, type, value, min, active: true }] })
    return true
  },
  toggleCoupon(code) {
    set({ coupons: state.coupons.map((c) => (c.code === code ? { ...c, active: !c.active } : c)) })
  },
  deleteCoupon(code) {
    set({ coupons: state.coupons.filter((c) => c.code !== code) })
  },

  // ---- staff ----
  addStaff({ name, role }) {
    set({ staff: [...state.staff, { id: uid(), name: name.trim(), role }] })
  },
  setStaffRole(id, role) {
    set({ staff: state.staff.map((s) => (s.id === id ? { ...s, role } : s)) })
  },
  removeStaff(id) {
    set({ staff: state.staff.filter((s) => s.id !== id) })
  },

  // ---- inventory ----
  adjustStock(id, delta) {
    set({
      inventory: state.inventory.map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)),
    })
  },

  resetDemo() {
    set(fresh())
  },
}
