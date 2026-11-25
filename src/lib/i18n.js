import { useSyncExternalStore } from 'react'

// English and Hindi labels for the customer app. Dish names and descriptions stay as the restaurant wrote them.
const DICT = {
  en: {
    craving: 'What are you craving?', search: 'Search dishes', all: 'All', veg: 'Veg', nonveg: 'Non-veg',
    'cat.Starters': 'Starters', 'cat.Main Course': 'Main Course', 'cat.Breads & Rice': 'Breads & Rice',
    'cat.Drinks': 'Drinks', 'cat.Desserts': 'Desserts',
    add: 'Add', soldOut: 'Sold out', viewCart: 'View cart', items: 'items', item: 'item', table: 'Table',
    noDishes: 'No dishes found', tryAnother: 'Try another search or filter.',
    help: 'Help', helpTitle: 'How can we help?', callWaiter: 'Call waiter', reqBill: 'Request bill',
    water: 'Water or cutlery', requestSent: 'Sent. A staff member is on the way.',
    alreadyAsked: 'Already requested. Staff is on the way.',
    bestseller: 'Bestseller', new: 'New', chef: "Chef's special", spice: 'Spice level',
    vegetarian: 'Vegetarian', nonVegetarian: 'Non-vegetarian', note: 'Special note',
    notePh: 'For example: less spicy, no onion', addToCart: 'Add to cart',
    yourOrder: 'Your order', each: 'each', kitchenNote: 'Note for the kitchen',
    kitchenNotePh: 'Allergies, spice level, anything else', subtotal: 'Subtotal', discount: 'Discount',
    gst: 'GST (5%)', tip: 'Tip for staff', none: 'None', total: 'Total',
    coupon: 'Coupon code', apply: 'Apply', remove: 'Remove', couponApplied: 'applied',
    couponBad: 'This coupon is not valid.', couponMin: 'Add {n} more to use this coupon.',
    emptyCart: 'Your cart is empty', pickSomething: 'Pick something tasty from the menu.',
    browse: 'Browse menu', proceed: 'Proceed to pay',
    payment: 'Payment', amountToPay: 'Amount to pay', inclGst: 'incl. GST', upi: 'Pay with UPI',
    upiSub: 'Google Pay, PhonePe, Paytm or any UPI app', counter: 'Pay at counter',
    counterSub: 'Pay when you finish your meal', placeOrder: 'Place order', pay: 'Pay',
    demoPay: 'Demo mode: no real payment is taken. A payment gateway connects in the full build.',
    order: 'Order', thanks: 'Thanks for ordering',
    'msg.new': 'We sent your order to the kitchen.', 'msg.preparing': 'The kitchen is cooking your order.',
    'msg.ready': 'Your order is ready and on its way to your table.', 'msg.served': 'Served. Enjoy your meal!',
    'msg.rejected': 'Sorry, the restaurant could not accept this order.',
    received: 'Received', preparing: 'Preparing', ready: 'Ready', eta: 'Estimated time', payment2: 'Payment',
    paidUpi: 'Paid by UPI', payCounter: 'Pay at counter', summary: 'Order summary', orderMore: 'Order more',
    declined: 'Order declined', reason: 'Reason', refundNote: 'Your UPI payment will be refunded.',
    orderAgain: 'Order again',
    rate: 'How was your meal?', comment: 'Tell us more (optional)', submit: 'Send feedback',
    thanksFb: 'Thanks for your feedback!',
  },
  hi: {
    craving: 'आज क्या खाएँगे?', search: 'डिश खोजें', all: 'सभी', veg: 'शाकाहारी', nonveg: 'मांसाहारी',
    'cat.Starters': 'स्टार्टर', 'cat.Main Course': 'मेन कोर्स', 'cat.Breads & Rice': 'रोटी और चावल',
    'cat.Drinks': 'ड्रिंक्स', 'cat.Desserts': 'मीठा',
    add: 'जोड़ें', soldOut: 'खत्म', viewCart: 'कार्ट देखें', items: 'आइटम', item: 'आइटम', table: 'टेबल',
    noDishes: 'कोई डिश नहीं मिली', tryAnother: 'दूसरा शब्द या फ़िल्टर आज़माएँ।',
    help: 'मदद', helpTitle: 'हम कैसे मदद करें?', callWaiter: 'वेटर बुलाएँ', reqBill: 'बिल मँगाएँ',
    water: 'पानी या चम्मच', requestSent: 'भेज दिया। स्टाफ आ रहा है।',
    alreadyAsked: 'पहले ही भेजा जा चुका है। स्टाफ आ रहा है।',
    bestseller: 'बेस्टसेलर', new: 'नया', chef: 'शेफ़ स्पेशल', spice: 'तीखापन',
    vegetarian: 'शाकाहारी', nonVegetarian: 'मांसाहारी', note: 'खास नोट',
    notePh: 'जैसे: कम तीखा, प्याज़ नहीं', addToCart: 'कार्ट में जोड़ें',
    yourOrder: 'आपका ऑर्डर', each: 'प्रति', kitchenNote: 'किचन के लिए नोट',
    kitchenNotePh: 'एलर्जी, तीखापन या कुछ और', subtotal: 'सबटोटल', discount: 'छूट',
    gst: 'जीएसटी (5%)', tip: 'स्टाफ के लिए टिप', none: 'नहीं', total: 'कुल',
    coupon: 'कूपन कोड', apply: 'लगाएँ', remove: 'हटाएँ', couponApplied: 'लग गया',
    couponBad: 'यह कूपन मान्य नहीं है।', couponMin: 'इस कूपन के लिए {n} और जोड़ें।',
    emptyCart: 'आपका कार्ट खाली है', pickSomething: 'मेन्यू से कुछ स्वादिष्ट चुनें।',
    browse: 'मेन्यू देखें', proceed: 'भुगतान करें',
    payment: 'भुगतान', amountToPay: 'कुल राशि', inclGst: 'जीएसटी सहित', upi: 'UPI से भुगतान',
    upiSub: 'Google Pay, PhonePe, Paytm या कोई भी UPI ऐप', counter: 'काउंटर पर भुगतान',
    counterSub: 'खाने के बाद भुगतान करें', placeOrder: 'ऑर्डर दें', pay: 'भुगतान',
    demoPay: 'डेमो मोड: असली भुगतान नहीं लिया जाता। पूरे वर्शन में पेमेंट गेटवे जुड़ेगा।',
    order: 'ऑर्डर', thanks: 'ऑर्डर के लिए धन्यवाद',
    'msg.new': 'आपका ऑर्डर किचन में भेज दिया गया है।', 'msg.preparing': 'किचन में आपका खाना बन रहा है।',
    'msg.ready': 'आपका ऑर्डर तैयार है और टेबल पर आ रहा है।', 'msg.served': 'परोस दिया गया। खाने का आनंद लें!',
    'msg.rejected': 'क्षमा करें, रेस्टोरेंट यह ऑर्डर नहीं ले सका।',
    received: 'मिला', preparing: 'बन रहा है', ready: 'तैयार', eta: 'अनुमानित समय', payment2: 'भुगतान',
    paidUpi: 'UPI से भुगतान हो गया', payCounter: 'काउंटर पर भुगतान', summary: 'ऑर्डर का सार', orderMore: 'और ऑर्डर करें',
    declined: 'ऑर्डर रद्द हुआ', reason: 'कारण', refundNote: 'आपका UPI भुगतान वापस किया जाएगा।',
    orderAgain: 'फिर से ऑर्डर करें',
    rate: 'खाना कैसा लगा?', comment: 'कुछ और बताइए (वैकल्पिक)', submit: 'फीडबैक भेजें',
    thanksFb: 'आपके फीडबैक के लिए धन्यवाद!',
  },
}

const LKEY = 'spice-route-lang'
let lang = 'en'
try {
  const s = localStorage.getItem(LKEY)
  if (s === 'hi' || s === 'en') lang = s
} catch {
  /* storage can be unavailable */
}
const listeners = new Set()

export function toggleLang() {
  lang = lang === 'en' ? 'hi' : 'en'
  try {
    localStorage.setItem(LKEY, lang)
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l())
}

// const t = useT(); t('add'), t('couponMin', { n: '₹50' })
export function useT() {
  const l = useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => lang
  )
  return (key, vars) => {
    let s = DICT[l][key] ?? DICT.en[key] ?? key
    if (vars) for (const k of Object.keys(vars)) s = s.replace(`{${k}}`, vars[k])
    return s
  }
}

export const useLang = () =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => lang
  )
