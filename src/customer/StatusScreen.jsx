import { useShop } from '../store/shopStore'
import { fmt } from '../lib/format'

const STEP = { new: 0, preparing: 1, ready: 2, served: 2 }
const MSG = {
  new: 'We sent your order to the kitchen.',
  preparing: 'The kitchen is cooking your order.',
  ready: 'Your order is ready and on its way to your table.',
  served: 'Served. Enjoy your meal!',
}
const ETA = { new: '15 to 20 min', preparing: '8 to 12 min', ready: 'Ready now', served: 'Done' }
const NAMES = ['Received', 'Preparing', 'Ready']

export default function StatusScreen({ orderId, onMore }) {
  const { orders } = useShop()
  const o = orders.find((x) => x.id === orderId)
  if (!o) return null
  const idx = STEP[o.status]

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="flex items-center gap-2.5 px-4 pb-2 pt-3.5">
        <span className="grid h-8 w-8 flex-none place-items-center rounded-[10px] bg-brand-600 font-head text-[13px] font-bold text-white">
          SR
        </span>
        <div className="flex-1 font-head text-base font-semibold">Order #{o.id}</div>
        <span className="whitespace-nowrap rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-600">
          Table {o.table}
        </span>
      </div>

      <div className="flex flex-col gap-3.5 px-4 pb-5 pt-1">
        <div className="flex flex-col items-center gap-1.5 px-2 pt-3 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-ok-soft text-3xl font-bold text-ok">✓</div>
          <h1 className="text-2xl font-semibold leading-tight">Thanks for ordering</h1>
          <span className="text-[12.5px] text-mute">{MSG[o.status]}</span>
        </div>

        <div className="card">
          <div className="my-2 flex items-start">
            {NAMES.map((n, i) => {
              const active = i <= idx
              return (
                <div
                  key={n}
                  className={`relative flex flex-1 flex-col items-center gap-1.5 text-center text-xs ${
                    active ? 'font-bold text-ink' : 'font-medium text-mute'
                  }`}
                >
                  {i > 0 && (
                    <span
                      className={`absolute right-1/2 top-[15px] h-[3px] w-full ${i <= idx ? 'bg-brand-600' : 'bg-line'}`}
                    />
                  )}
                  <span
                    className={`relative z-[1] grid h-8 w-8 place-items-center rounded-full border-2 font-bold ${
                      active ? 'border-brand-600 bg-brand-600 text-white' : 'border-line bg-sand'
                    }`}
                  >
                    {active ? '✓' : ''}
                  </span>
                  {n}
                </div>
              )
            })}
          </div>
          <div className="flex justify-between py-0.5 text-mute">
            <span>Estimated time</span>
            <b className="tabular-nums text-ink">{ETA[o.status]}</b>
          </div>
          <div className="flex justify-between py-0.5 text-mute">
            <span>Payment</span>
            <b className="text-ink">{o.pay === 'upi' ? 'Paid by UPI' : 'Pay at counter'}</b>
          </div>
        </div>

        <div className="card">
          <b>Order summary</b>
          <div className="mt-2">
            {o.lines.map((l) => (
              <div key={l.id} className="flex justify-between py-0.5">
                <span>
                  {l.qty} × {l.name}
                </span>
                <span className="tabular-nums">{fmt(l.qty * l.price)}</span>
              </div>
            ))}
            <div className="mt-1.5 flex justify-between border-t border-dashed border-line pt-2.5 text-base font-bold">
              <span>Total</span>
              <span className="tabular-nums">{fmt(o.total)}</span>
            </div>
          </div>
        </div>

        <button className="btn btn-line w-full" onClick={onMore}>
          Order more
        </button>
      </div>
    </div>
  )
}
