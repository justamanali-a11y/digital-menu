import { fmt } from '../lib/format'
import Stepper from '../components/Stepper'
import { useCart } from './CartContext'

function Header({ title, table, onBack }) {
  return (
    <div className="flex items-center gap-2.5 px-4 pb-2 pt-3.5">
      <button
        onClick={onBack}
        aria-label="Back"
        className="h-9 w-9 flex-none rounded-xl border border-line bg-white"
      >
        ←
      </button>
      <div className="flex-1 font-head text-base font-semibold">{title}</div>
      <span className="whitespace-nowrap rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-600">
        Table {table}
      </span>
    </div>
  )
}

export { Header }

export default function CartScreen({ table, onBack, onPay }) {
  const cart = useCart()
  const { sub, gst, total } = cart.totals

  if (!cart.lines.length) {
    return (
      <div className="flex-1">
        <Header title="Your order" table={table} onBack={onBack} />
        <div className="flex flex-col items-center gap-3 px-4 py-12 text-center text-mute">
          <h3 className="text-base text-ink">Your cart is empty</h3>
          <span>Pick something tasty from the menu.</span>
          <button className="btn" onClick={onBack}>
            Browse menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Header title="Your order" table={table} onBack={onBack} />
        <div className="flex flex-col gap-3.5 px-4 pb-5 pt-1">
          <div className="card flex flex-col gap-3">
            {cart.lines.map((l) => (
              <div key={l.id} className="flex items-center gap-2.5">
                <div className="min-w-0 flex-1">
                  <b>{l.name}</b>
                  <small className="block text-mute">
                    {fmt(l.price)} each{l.note ? ` · ${l.note}` : ''}
                  </small>
                </div>
                <Stepper qty={l.qty} onInc={() => cart.inc(l.id)} onDec={() => cart.dec(l.id)} />
                <b className="min-w-[56px] text-right tabular-nums">{fmt(l.price * l.qty)}</b>
              </div>
            ))}
          </div>

          <label className="flex flex-col gap-1.5 font-semibold">
            Note for the kitchen
            <textarea
              className="input min-h-[64px] resize-y font-normal"
              placeholder="Allergies, spice level, anything else"
              value={cart.note}
              onChange={(e) => cart.setNote(e.target.value)}
            />
          </label>

          <div className="card">
            <div className="flex justify-between py-0.5 text-mute">
              <span>Subtotal</span>
              <span className="tabular-nums">{fmt(sub)}</span>
            </div>
            <div className="flex justify-between py-0.5 text-mute">
              <span>GST (5%)</span>
              <span className="tabular-nums">{fmt(gst)}</span>
            </div>
            <div className="mt-1.5 flex justify-between border-t border-dashed border-line pt-2.5 text-base font-bold">
              <span>Total</span>
              <span className="tabular-nums">{fmt(total)}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex-none border-t border-line bg-cream px-4 pt-3"
        style={{ paddingBottom: 'calc(14px + env(safe-area-inset-bottom, 0px))' }}
      >
        <button className="btn w-full" onClick={onPay}>
          Proceed to pay · {fmt(total)}
        </button>
      </div>
    </>
  )
}
