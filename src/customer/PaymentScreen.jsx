import { useState } from 'react'
import { actions } from '../store/shopStore'
import { fmt } from '../lib/format'
import { beep, toast } from '../lib/toast'
import { useT } from '../lib/i18n'
import { useCart } from './CartContext'
import PhoneHeader from './PhoneHeader'

export default function PaymentScreen({ table, onBack, onPlaced, onHelp }) {
  const t = useT()
  const cart = useCart()
  const [pay, setPay] = useState('upi')
  const { gst, total } = cart.totals

  const options = [
    { key: 'upi', title: t('upi'), sub: t('upiSub') },
    { key: 'counter', title: t('counter'), sub: t('counterSub') },
  ]

  const place = () => {
    if (!cart.lines.length) return
    // TODO: for UPI, open the Razorpay checkout here and place the order only after payment succeeds.
    const order = actions.placeOrder({
      table,
      lines: cart.lines,
      note: cart.note,
      pay,
      totals: cart.totals,
      couponCode: cart.coupon && cart.totals.discount > 0 ? cart.coupon.code : '',
    })
    cart.clear()
    beep()
    toast(`Order #${order.id} sent to the kitchen`)
    onPlaced(order.id)
  }

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PhoneHeader title={t('payment')} table={table} onBack={onBack} onHelp={onHelp} />
        <div className="flex flex-col gap-3.5 px-4 pb-5 pt-1">
          <div className="card">
            <div className="flex justify-between text-base font-bold">
              <span>{t('amountToPay')}</span>
              <span className="tabular-nums">{fmt(total)}</span>
            </div>
            <div className="text-[12.5px] text-mute">
              {cart.count} {cart.count > 1 ? t('items') : t('item')} · {t('inclGst')} {fmt(gst)}
            </div>
          </div>

          {options.map((o) => (
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

          {pay === 'upi' && <p className="text-[12.5px] text-mute">{t('demoPay')}</p>}
        </div>
      </div>
      <div
        className="flex-none border-t border-line bg-cream px-4 pt-3"
        style={{ paddingBottom: 'calc(14px + env(safe-area-inset-bottom, 0px))' }}
      >
        <button className="btn w-full" onClick={place}>
          {pay === 'upi' ? `${t('pay')} ${fmt(total)}` : t('placeOrder')}
        </button>
      </div>
    </>
  )
}
