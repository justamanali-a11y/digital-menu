import { useMemo, useState } from 'react'
import { actions, useShop } from '../store/shopStore'
import { fmt } from '../lib/format'
import { toast } from '../lib/toast'

const hourLabel = (h) => `${h % 12 === 0 ? 12 : h % 12} ${h < 12 ? 'am' : 'pm'}`

function Bar({ label, value, max, text }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-[130px] flex-none truncate text-[13px]">{label}</span>
      <div className="h-[18px] flex-1 overflow-hidden rounded-full bg-sand">
        <div className="h-full rounded-full bg-brand-600" style={{ width: `${max ? Math.max(4, (value / max) * 100) : 0}%` }} />
      </div>
      <span className="w-[64px] flex-none text-right text-[13px] font-semibold tabular-nums">{text}</span>
    </div>
  )
}

function payStatus(o) {
  if (o.status === 'rejected') return o.refund === 'due' ? 'Refund due' : o.refund === 'done' ? 'Refunded' : 'Rejected'
  return o.pay === 'upi' ? 'Paid · UPI' : o.status === 'served' ? 'Cash collected' : 'Cash pending'
}

export default function Reports() {
  const { orders } = useShop()
  const [filter, setFilter] = useState('all')

  const data = useMemo(() => {
    const since = Date.now() - 24 * 3600 * 1000
    const recent = orders.filter((o) => o.t >= since)
    const valid = recent.filter((o) => o.status !== 'rejected')
    const sales = valid.reduce((a, o) => a + o.total, 0)

    const byItem = {}
    valid.forEach((o) => o.lines.forEach((l) => (byItem[l.name] = (byItem[l.name] || 0) + l.qty)))
    const top = Object.entries(byItem).sort((a, b) => b[1] - a[1]).slice(0, 6)

    const byHour = {}
    valid.forEach((o) => {
      const h = new Date(o.t).getHours()
      byHour[h] = (byHour[h] || 0) + 1
    })
    const hours = Object.entries(byHour).sort((a, b) => a[0] - b[0])
    return { recent, valid, sales, top, hours, aov: valid.length ? Math.round(sales / valid.length) : 0 }
  }, [orders])

  const maxTop = Math.max(0, ...data.top.map((t) => t[1]))
  const maxHour = Math.max(0, ...data.hours.map((h) => h[1]))
  const tx = data.recent.filter((o) => {
    if (filter === 'upi') return o.pay === 'upi' && o.status !== 'rejected'
    if (filter === 'counter') return o.pay === 'counter' && o.status !== 'rejected'
    if (filter === 'refund') return o.status === 'rejected'
    return true
  })

  return (
    <>
      <div>
        <h2 className="text-lg font-semibold">Reports</h2>
        <span className="text-[12.5px] text-mute">Last 24 hours. Rejected orders are not counted as sales.</span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-sand px-3.5 py-3">
          <small className="block text-mute">Sales</small>
          <b className="font-head text-[28px] leading-tight tabular-nums">{fmt(data.sales)}</b>
        </div>
        <div className="rounded-2xl bg-sand px-3.5 py-3">
          <small className="block text-mute">Orders</small>
          <b className="font-head text-[28px] leading-tight tabular-nums">{data.valid.length}</b>
        </div>
        <div className="rounded-2xl bg-sand px-3.5 py-3">
          <small className="block text-mute">Average order</small>
          <b className="font-head text-[28px] leading-tight tabular-nums">{fmt(data.aov)}</b>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card flex flex-col gap-2.5">
          <h3 className="font-semibold">Top selling dishes (plates sold)</h3>
          {data.top.length === 0 && <p className="text-mute">No sales yet.</p>}
          {data.top.map(([name, qty]) => (
            <Bar key={name} label={name} value={qty} max={maxTop} text={qty} />
          ))}
        </section>
        <section className="card flex flex-col gap-2.5">
          <h3 className="font-semibold">Peak hours (orders)</h3>
          {data.hours.length === 0 && <p className="text-mute">No orders yet.</p>}
          {data.hours.map(([h, n]) => (
            <Bar key={h} label={hourLabel(Number(h))} value={n} max={maxHour} text={n} />
          ))}
        </section>
      </div>

      <section>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold">Payments</h3>
          <select className="input min-h-[38px] w-auto" aria-label="Filter payments" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="upi">UPI</option>
            <option value="counter">Cash at counter</option>
            <option value="refund">Rejected and refunds</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left">
            <thead className="text-xs text-mute">
              <tr>
                <th className="py-2">Order</th>
                <th>Table</th>
                <th>Amount</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tx.map((o) => (
                <tr key={o.id} className="border-t border-line">
                  <td className="py-2.5 font-semibold">#{o.id}</td>
                  <td>T{o.table}</td>
                  <td className="tabular-nums">{fmt(o.total)}</td>
                  <td>{payStatus(o)}</td>
                  <td className="text-right">
                    {o.refund === 'due' && (
                      <button
                        className="btn btn-sm"
                        onClick={() => {
                          actions.refundOrder(o.id)
                          toast(`Refund marked done for #${o.id}`)
                        }}
                      >
                        Mark refunded
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {tx.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-mute">
                    Nothing to show.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-mute">In this demo "Mark refunded" only updates the status. Real refunds go through Razorpay.</p>
      </section>
    </>
  )
}
