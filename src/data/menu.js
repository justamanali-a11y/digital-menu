// Dummy data for the demo. Replace with Firestore data later.
import { calcTotals } from '../lib/format'

export const CATS = ['Starters', 'Main Course', 'Breads & Rice', 'Drinks', 'Desserts']

const mk = (id, name, cat, veg, price, desc, hue) => ({ id, name, cat, veg, price, desc, hue, stock: true })

const BASE = [
  mk('paneer-tikka', 'Paneer Tikka', 'Starters', true, 260, 'Tandoor-grilled cottage cheese, peppers and onion, with mint chutney.', 28),
  mk('chicken-tikka', 'Chicken Tikka', 'Starters', false, 290, 'Yogurt and spice marinated chicken, charred in the tandoor.', 12),
  mk('spring-rolls', 'Veg Spring Rolls', 'Starters', true, 180, 'Crisp rolls filled with cabbage, carrot and noodles. Sweet chilli dip.', 45),
  mk('butter-chicken', 'Butter Chicken', 'Main Course', false, 420, 'Tender chicken in a creamy tomato and butter gravy.', 16),
  mk('dal-makhani', 'Dal Makhani', 'Main Course', true, 320, 'Black lentils slow-cooked overnight with cream and butter.', 8),
  mk('palak-paneer', 'Palak Paneer', 'Main Course', true, 340, 'Fresh spinach gravy with soft paneer cubes.', 110),
  mk('kadai-chicken', 'Kadai Chicken', 'Main Course', false, 400, 'Chicken tossed with capsicum and freshly ground kadai masala.', 20),
  mk('rogan-josh', 'Mutton Rogan Josh', 'Main Course', false, 520, 'Kashmiri-style mutton curry, slow cooked until it falls off the bone.', 6),
  mk('butter-naan', 'Butter Naan', 'Breads & Rice', true, 60, 'Soft tandoor naan brushed with butter.', 38),
  mk('garlic-naan', 'Garlic Naan', 'Breads & Rice', true, 70, 'Naan topped with garlic and coriander.', 34),
  mk('tandoori-roti', 'Tandoori Roti', 'Breads & Rice', true, 30, 'Whole wheat roti baked in the tandoor.', 32),
  mk('jeera-rice', 'Jeera Rice', 'Breads & Rice', true, 160, 'Basmati rice tempered with cumin.', 48),
  mk('chicken-biryani', 'Chicken Biryani', 'Breads & Rice', false, 380, 'Dum biryani with long-grain basmati. Served with raita.', 30),
  mk('veg-biryani', 'Veg Biryani', 'Breads & Rice', true, 300, 'Seasonal vegetables layered with saffron rice. Served with raita.', 40),
  mk('masala-chai', 'Masala Chai', 'Drinks', true, 50, 'Ginger and cardamom tea, brewed with milk.', 30),
  mk('sweet-lassi', 'Sweet Lassi', 'Drinks', true, 90, 'Thick chilled yogurt drink, topped with malai.', 50),
  mk('lime-soda', 'Fresh Lime Soda', 'Drinks', true, 80, 'Sweet, salted or mixed. Ask the waiter.', 90),
  mk('cold-coffee', 'Cold Coffee', 'Drinks', true, 120, 'Blended coffee with ice cream.', 22),
  mk('gulab-jamun', 'Gulab Jamun', 'Desserts', true, 90, 'Two warm milk dumplings in cardamom syrup.', 14),
  mk('rasmalai', 'Rasmalai', 'Desserts', true, 120, 'Soft cheese discs in saffron milk.', 44),
]

// tags: 'bestseller' | 'new' | 'chef'. spice: 0 to 3.
const TAGS = {
  'paneer-tikka': ['bestseller'],
  'butter-chicken': ['bestseller'],
  'dal-makhani': ['chef'],
  'rogan-josh': ['chef'],
  'cold-coffee': ['new'],
  rasmalai: ['new'],
}
const SPICE = {
  'paneer-tikka': 2, 'chicken-tikka': 2, 'spring-rolls': 1, 'butter-chicken': 1, 'dal-makhani': 1,
  'palak-paneer': 1, 'kadai-chicken': 3, 'rogan-josh': 3, 'chicken-biryani': 2, 'veg-biryani': 2,
}

export const ITEMS = BASE.map((i) => ({ ...i, tags: TAGS[i.id] || [], spice: SPICE[i.id] || 0 }))

const byId = Object.fromEntries(ITEMS.map((i) => [i.id, i]))
const ago = (m) => Date.now() - m * 60000

// status: 'new' -> 'preparing' -> 'ready' -> 'served'. 'rejected' is a dead end.
const mkOrder = (id, table, status, pay, min, lines, note = '') => {
  const ls = lines.map(([iid, qty]) => ({
    id: iid, name: byId[iid].name, price: byId[iid].price, qty, note: '',
  }))
  const t = calcTotals(ls)
  return {
    id, table, status, pay, t: ago(min), note, lines: ls,
    sub: t.sub, discount: 0, gst: t.gst, tip: 0, total: t.total, couponCode: '',
    refund: null, rejectReason: '',
  }
}

export const seedOrders = () => [
  mkOrder(1042, 7, 'new', 'upi', 2, [['paneer-tikka', 1], ['spring-rolls', 1]], 'Less spicy please'),
  mkOrder(1041, 2, 'preparing', 'counter', 9, [['chicken-biryani', 2], ['sweet-lassi', 2]]),
  mkOrder(1040, 3, 'ready', 'upi', 14, [['dal-makhani', 1], ['butter-naan', 3]]),
  mkOrder(1039, 1, 'served', 'upi', 40, [['butter-chicken', 1], ['garlic-naan', 2], ['masala-chai', 2]]),
  mkOrder(1038, 6, 'served', 'counter', 65, [['veg-biryani', 2], ['lime-soda', 2]]),
  mkOrder(1037, 4, 'served', 'upi', 95, [['chicken-tikka', 1], ['paneer-tikka', 1], ['cold-coffee', 2]]),
  mkOrder(1036, 8, 'served', 'upi', 130, [['rogan-josh', 1], ['jeera-rice', 1], ['tandoori-roti', 4]]),
  mkOrder(1035, 2, 'served', 'counter', 160, [['palak-paneer', 1], ['butter-naan', 2], ['gulab-jamun', 2]]),
  mkOrder(1034, 5, 'served', 'upi', 170, [['chicken-biryani', 1], ['sweet-lassi', 1]]),
  mkOrder(1033, 3, 'served', 'upi', 215, [['kadai-chicken', 1], ['butter-naan', 3], ['rasmalai', 1]]),
  mkOrder(1032, 9, 'served', 'counter', 240, [['spring-rolls', 2], ['masala-chai', 3]]),
]

export const seedRequests = () => [{ id: 'r-seed', table: 4, type: 'waiter', t: ago(1), done: false }]

export const COUPONS = [
  { code: 'WELCOME10', type: 'percent', value: 10, min: 300, active: true },
  { code: 'FLAT50', type: 'flat', value: 50, min: 500, active: true },
]

export const seedFeedback = () => [
  { id: 'f1', orderId: 1039, table: 1, rating: 5, comment: 'Butter chicken was excellent and the ordering was quick.', t: ago(30) },
  { id: 'f2', orderId: 1038, table: 6, rating: 4, comment: 'Good food. The lassi could be colder.', t: ago(55) },
  { id: 'f3', orderId: 1037, table: 4, rating: 3, comment: '', t: ago(80) },
]

export const STAFF = [
  { id: 's1', name: 'Aman', role: 'owner' },
  { id: 's2', name: 'Riya', role: 'manager' },
  { id: 's3', name: 'Karan', role: 'kitchen' },
  { id: 's4', name: 'Neha', role: 'waiter' },
]

export const INVENTORY = [
  { id: 'i1', name: 'Paneer', unit: 'kg', qty: 3, min: 2 },
  { id: 'i2', name: 'Chicken', unit: 'kg', qty: 12, min: 5 },
  { id: 'i3', name: 'Basmati rice', unit: 'kg', qty: 25, min: 10 },
  { id: 'i4', name: 'Milk', unit: 'L', qty: 8, min: 6 },
  { id: 'i5', name: 'Cooking oil', unit: 'L', qty: 4, min: 5 },
  { id: 'i6', name: 'Tomato', unit: 'kg', qty: 6, min: 4 },
  { id: 'i7', name: 'Butter', unit: 'kg', qty: 2, min: 2 },
  { id: 'i8', name: 'Atta (wheat flour)', unit: 'kg', qty: 15, min: 8 },
]
