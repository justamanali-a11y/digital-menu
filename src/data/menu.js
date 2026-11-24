// Dummy menu and seed orders. Replace with Firestore data later.
export const CATS = ['Starters', 'Main Course', 'Breads & Rice', 'Drinks', 'Desserts']

const mk = (id, name, cat, veg, price, desc, hue) => ({ id, name, cat, veg, price, desc, hue, stock: true })

export const ITEMS = [
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

const ago = (m) => Date.now() - m * 60000

// status: 'new' -> 'preparing' -> 'ready' -> 'served'
export const seedOrders = () => [
  {
    id: 1042, table: 7, status: 'new', pay: 'upi', t: ago(2), note: 'Less spicy please', total: 462,
    lines: [
      { id: 'paneer-tikka', name: 'Paneer Tikka', price: 260, qty: 1, note: '' },
      { id: 'spring-rolls', name: 'Veg Spring Rolls', price: 180, qty: 1, note: '' },
    ],
  },
  {
    id: 1041, table: 2, status: 'preparing', pay: 'counter', t: ago(9), note: '', total: 987,
    lines: [
      { id: 'chicken-biryani', name: 'Chicken Biryani', price: 380, qty: 2, note: '' },
      { id: 'sweet-lassi', name: 'Sweet Lassi', price: 90, qty: 2, note: '' },
    ],
  },
  {
    id: 1040, table: 3, status: 'ready', pay: 'upi', t: ago(14), note: '', total: 525,
    lines: [
      { id: 'dal-makhani', name: 'Dal Makhani', price: 320, qty: 1, note: '' },
      { id: 'butter-naan', name: 'Butter Naan', price: 60, qty: 3, note: '' },
    ],
  },
]
