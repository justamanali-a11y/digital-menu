import { useState } from 'react'
import { actions, useShop } from '../store/shopStore'
import useNow from '../lib/useNow'
import { printKOT } from '../lib/kot'
import { toast } from '../lib/toast'

const COLS = [
  { key: 'new', title: 'New', cta: 'Accept and start' },
  { key: 'preparing', title: 'Preparing', cta: 'Mark ready' },
  { key: 'ready', title: 'Ready to serve', cta: 'Mark served' },
]
const REASONS = ['Item unavailable', 'Kitchen is too busy', 'Restaurant is closing', 'Other']
const REQ_LABEL = { waiter: 'Call waiter', bill: 'Bring the bill', water: 'Water or cutlery' }

function OrderCard({ o, col, now }) {
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState(REASONS[0])
  const m = Math.max(0, Math.floor((now - o.t) / 60000))
  const late = col.key !== 'ready' && m >= 10

  return (
    <article className="flex flex-col gap-2.5 rounded-[14px] border border-line bg-white p-3">
      <header className="flex items-center gap-2.5">
        <span className="grid h-[46px] min-w-[46px] place-items-center rounded-xl bg-ink px-1.5 font-head text-xl font-bold text-cream">
          T{o.table}
        </span>
        <div className="min-w-0 flex-1">
          <b>#{o.id}</b>
          <small className={`block tabular-nums ${late ? 'font-bold text-bad' : 'text-mute'}`}>
            {m === 0 ? 'Just now' : `${m} min ago`}
          </small>
        </div>
        <span
          className={`whitespace-nowrap rounded-full px-2 py-1 text-[11.5px] font-bold ${
            o.pay === 'upi' ? 'bg-ok-soft text-ok' : 'bg-warn-soft text-warn'
          }`}
        >
          {o.pay === 'upi' ? 'Paid · UPI' : 'Collect cash'}
        </span>
      </header>
      <ul className="flex flex-col gap-0.5">
        {o.lines.map((l) => (
          <li key={l.id}>
            <b className="tabular-nums">{l.qty}×</b> {l.name}
            {l.note && <em className="block pl-6 text-[12.5px] not-italic text-mute">{l.note}</em>}
          </li>
        ))}
      </ul>
      {o.note && <p className="rounded-[10px] bg-warn-soft px-2.5 py-2 text-[13px] font-medium text-warn">{o.note}</p>}

      {rejecting ? (
        <div className="flex flex-col gap-2 rounded-xl bg-sand p-2.5">
          <label className="flex flex-col gap-1 text-[12.5px] font-medium">
            Reason for the customer
            <select className="input min-h-[38px]" value={reason} onChange={(e) => setReason(e.target.value)}>
              {REASONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          {o.pay === 'upi' && <span className="text-xs text-mute">This order was paid by UPI. A refund will be due.</span>}
          <div className="flex gap-2">
            <button
              className="btn btn-sm flex-1 bg-bad"
              onClick={() => {
                actions.rejectOrder(o.id, reason)
                toast(`Order #${o.id} rejected`)
              }}
            >
              Reject order
            </button>
            <button className="btn btn-sm btn-line" onClick={() => setRejecting(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-sm flex-1" onClick={() => actions.advanceOrder(o.id)}>
            {col.cta}
          </button>
          <button
            className="btn btn-sm btn-line"
            onClick={() => {
              if (!printKOT(o)) toast('Allow pop-ups to print the kitchen ticket')
            }}
          >
            Print KOT
          </button>
          {col.key === 'new' && (
            <button className="btn btn-sm btn-line text-bad" onClick={() => setRejecting(true)}>
              Reject
            </button>
          )}
        </div>
      )}
    </article>
  )
}

export default function LiveOrders() {
  const { orders, requests } = useShop()
  const now = useNow(30000)
  const open = requests.filter((r) => !r.done).sort((a, b) => a.t - b.t)

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {COLS.map((c) => (
          <div key={c.key} className="rounded-2xl bg-sand px-3.5 py-3">
            <small className="block text-mute">{c.title}</small>
            <b className="font-head text-[28px] leading-tight tabular-nums">
              {orders.filter((o) => o.status === c.key).length}
            </b>
          </div>
        ))}
      </div>

      <div className="grid items-start gap-3.5 md:grid-cols-3">
        {COLS.map((c) => {
          const list = orders.filter((o) => o.status === c.key).sort((a, b) => a.t - b.t)
          return (
            <div key={c.key} className="flex min-h-[120px] flex-col gap-2.5 rounded-2xl bg-sand p-3">
              <h3 className="flex items-center justify-between text-sm font-semibold">
                {c.title}
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs tabular-nums">{list.length}</span>
              </h3>
              {list.length === 0 && <div className="py-[18px] text-center text-[13px] text-mute">No orders here</div>}
              {list.map((o) => (
                <OrderCard key={o.id} o={o} col={c} now={now} />
              ))}
            </div>
          )
        })}
      </div>

      <section className="rounded-2xl border border-line p-3.5" aria-label="Table requests">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
          Table requests
          <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs tabular-nums">{open.length}</span>
        </h3>
        {open.length === 0 ? (
          <p className="text-[13px] text-mute">No open requests. Guests can call the waiter or ask for the bill from their phone.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {open.map((r) => {
              const m = Math.max(0, Math.floor((now - r.t) / 60000))
              return (
                <div key={r.id} className="flex items-center gap-3 rounded-xl bg-sand px-3 py-2.5">
                  <span className="grid h-9 min-w-9 place-items-center rounded-lg bg-ink px-1.5 font-head font-bold text-cream">
                    T{r.table}
                  </span>
                  <div className="min-w-0 flex-1">
                    <b>{REQ_LABEL[r.type]}</b>
                    <small className="block text-mute">{m === 0 ? 'Just now' : `${m} min ago`}</small>
                  </div>
                  <button className="btn btn-sm" onClick={() => actions.resolveRequest(r.id)}>
                    Done
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
