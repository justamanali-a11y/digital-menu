export const GST_RATE = 0.05

export const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN')

// coupon: { type: 'percent' | 'flat', value, min } or null. tipPct: 0, 5 or 10.
export function couponDiscount(sub, coupon) {
  if (!coupon || sub < coupon.min) return 0
  const d = coupon.type === 'percent' ? Math.round((sub * coupon.value) / 100) : coupon.value
  return Math.min(d, sub)
}

export function calcTotals(lines, coupon = null, tipPct = 0) {
  const sub = lines.reduce((a, l) => a + l.price * l.qty, 0)
  const discount = couponDiscount(sub, coupon)
  const gst = Math.round((sub - discount) * GST_RATE)
  const tip = Math.round((sub * tipPct) / 100)
  return { sub, discount, gst, tip, total: sub - discount + gst + tip }
}
