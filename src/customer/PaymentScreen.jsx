import { useState } from 'react'
import { actions } from '../store/shopStore'
import { fmt } from '../lib/format'
import { beep, toast } from '../lib/toast'
import { useCart } from './CartContext'
import { Header } from './CartScreen'

const OPTIONS = [
  { key: 'upi', title: 'Pay with UPI', sub: 'Google Pay, PhonePe, Paytm or any UPI app' },
  { key: 'counter', title: 'Pay at counter', sub: 'Pay when you finish your meal' },
]

export default function PaymentScreen({ table, onBack, onPlaced }) {
  const cart = useCart()
  const [pay, setPay] = useState('upi')
  const { gst, total } = cart.totals

  const place = () => {
    if (!cart.lines.length) return
    // TODO: for UPI, open the Razorpay checkout here and place the order only after payment succeeds.
    const order = actions.placeOrder({ table, lines: cart.lines, note: cart.note, pay })
    cart.clear()
    beep()
    toast(`Order #${order.id} sent to the kitchen`)
    onPlaced(order.id)
  }

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Header title="Payment" table={table} onBack={onBack} />
        <div className="flex flex-col gap-3.5 px-4 pb-5 pt-1">
          <div className="card">
            <div className="flex justify-between text-base font-bold">
              <span>Amount to pay</span>
              <span className="tabular-nums">{fmt(total)}</span>
            </div>
            <div className="text-[12.5px] text-mute">
              {cart.count} item{cart.count > 1 ? 's' : ''} · incl. GST {fmt(gst)}
            </div>
          </div>

          {OPTIONS.map((o) => (
            <button
              key={o.key}
              onClick={() => setPay(o.key)}
              className={`flex w-full items-center gap-3 rounded-2xl border-[1.5px] p-3.5 text-left ${
                pay === o.key ? 'border-brand-600 bg-brand-100' : 'border-line bg-white'
              }`}
            >
              <span
                className={`grid h-5 w-5 flex-none place-items-center rounded-full border-2 ${
                  pay === o.key ? 'border-brand-600' : 'border-mute'
                }`}
              >
                {pay === o.key && <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />}
              </span>
              <span>
                <b className="block">{o.title}</b>
                <small className="text-mute">{o.sub}</small>
              </span>
            </button>
          ))}

          {pay === 'upi' && (
            <p className="text-[12.5px] text-mute">
              Demo mode: no real payment is taken. A payment gateway connects in the full build.
            </p>
          )}
        </div>
      </div>
      <div
        className="flex-none border-t border-line bg-cream px-4 pt-3"
        style={{ paddingBottom: 'calc(14px + env(safe-area-inset-bottom, 0px))' }}
      >
        <button className="btn w-full" onClick={place}>
          {pay === 'upi' ? `Pay ${fmt(total)}` : 'Place order'}
        </button>
      </div>
    </>
  )
}
