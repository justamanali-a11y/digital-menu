import { actions, useShop } from '../store/shopStore'
import useNow from '../lib/useNow'

const COLS = [
  { key: 'new', title: 'New', cta: 'Accept and start' },
  { key: 'preparing', title: 'Preparing', cta: 'Mark ready' },
  { key: 'ready', title: 'Ready to serve', cta: 'Mark served' },
]

export default function LiveOrders() {
  const { orders } = useShop()
  const now = useNow(30000)

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
              {list.map((o) => {
                const m = Math.max(0, Math.floor((now - o.t) / 60000))
                const late = c.key !== 'ready' && m >= 10
                return (
                  <article key={o.id} className="flex flex-col gap-2.5 rounded-[14px] border border-line bg-white p-3">
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
                    {o.note && (
                      <p className="rounded-[10px] bg-warn-soft px-2.5 py-2 text-[13px] font-medium text-warn">{o.note}</p>
                    )}
                    <button className="btn btn-sm" onClick={() => actions.advanceOrder(o.id)}>
                      {c.cta}
                    </button>
                  </article>
                )
              })}
            </div>
          )
        })}
      </div>
    </>
  )
}
