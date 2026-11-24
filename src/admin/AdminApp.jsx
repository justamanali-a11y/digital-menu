import { useEffect, useRef, useState } from 'react'
import { useShop } from '../store/shopStore'
import { fmt } from '../lib/format'
import { beep, toast } from '../lib/toast'
import Login from './Login'
import LiveOrders from './LiveOrders'
import MenuManager from './MenuManager'
import TablesQR from './TablesQR'

export default function AdminApp({ startSignedIn = false, onPreview }) {
  const [signedIn, setSignedIn] = useState(startSignedIn)
  const [tab, setTab] = useState('live')
  const { orders } = useShop()

  // Alert when a new order arrives (also from another browser tab).
  const maxId = Math.max(0, ...orders.map((o) => o.id))
  const seen = useRef(maxId)
  useEffect(() => {
    if (signedIn && maxId > seen.current) {
      const o = orders.find((x) => x.id === maxId)
      if (o) {
        beep()
        toast(`New order #${o.id} · Table ${o.table} · ${fmt(o.total)}`)
      }
    }
    seen.current = maxId
  }, [maxId, signedIn, orders])

  const nNew = orders.filter((o) => o.status === 'new').length
  const tabs = [
    ['live', 'Live orders' + (nNew ? ` (${nNew} new)` : '')],
    ['menu', 'Menu'],
    ['tables', 'Tables and QR'],
  ]

  return (
    <div className="min-h-[780px] overflow-hidden rounded-3xl border border-line bg-white shadow-card">
      {!signedIn ? (
        <Login onSignIn={() => setSignedIn(true)} />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 border-b border-line px-[18px] py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-brand-600 font-head text-[13px] font-bold text-white">
                SR
              </span>
              <div>
                <b>Spice Route</b>
                <small className="block text-mute">Restaurant dashboard</small>
              </div>
            </div>
            <nav className="flex flex-1 flex-wrap gap-1">
              {tabs.map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`rounded-[11px] px-3.5 py-2 font-semibold ${
                    tab === k ? 'bg-brand-100 text-brand-600' : 'text-mute'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
            <button
              className="rounded-[11px] border border-line px-3 py-2 font-semibold"
              onClick={() => setSignedIn(false)}
            >
              Sign out
            </button>
          </div>
          <div className="flex flex-col gap-[18px] p-[18px]">
            {tab === 'live' && <LiveOrders />}
            {tab === 'menu' && <MenuManager />}
            {tab === 'tables' && <TablesQR onPreview={onPreview} />}
          </div>
        </>
      )}
    </div>
  )
}
