export const GST_RATE = 0.05

export const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN')

export function calcTotals(lines) {
  const sub = lines.reduce((a, l) => a + l.price * l.qty, 0)
  const gst = Math.round(sub * GST_RATE)
  return { sub, gst, total: sub + gst }
}
