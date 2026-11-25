import { useEffect, useRef, useState } from 'react'
import { useShop } from '../store/shopStore'
import { fmt } from '../lib/format'
import { beep, toast } from '../lib/toast'
import Login from './Login'
import LiveOrders from './LiveOrders'
import MenuManager from './MenuManager'
import TablesQR from './TablesQR'
import Offers from './Offers'
import Reports from './Reports'
import Feedback from './Feeedback'
import Inventory from './inventory'
import Staff from './Staff'
import { ACCESS, ROLE_LABEL, TABS } from './roles'

const SCREENS = {
  live: LiveOrders,
  menu: MenuManager,
  offers: Offers,
  reports: Reports,
  feedback: Feedback,
  inventory: Inventory,
  staff: Staff,
}

export default function AdminApp({ startSignedIn = false, onPreview }) {
  const [role, setRole] = useState(startSignedIn ? 'owner' : null)
  const [tab, setTab] = useState('live')
  const { orders, requests } = useShop()

  // Alert when a new order or table request arrives (also from another browser tab).
  const maxId = Math.max(0, ...orders.map((o) => o.id))
  const openReq = requests.filter((r) => !r.done).length
  const seen = useRef({ order: maxId, req: openReq })
  useEffect(() => {
    if (role) {
      if (maxId > seen.current.order) {
        const o = orders.find((x) => x.id === maxId)
        if (o) {
          beep()
          toast(`New order #${o.id} · Table ${o.table} · ${fmt(o.total)}`)
        }
      } else if (openReq > seen.current.req) {
        const r = requests.find((x) => !x.done)
        beep()
        toast(`Table ${r.table} needs help`)
      }
    }
    seen.current = { order: maxId, req: openReq }
  }, [maxId, openReq, role, orders, requests])

  const nNew = orders.filter((o) => o.status === 'new').length
  const allowed = role ? ACCESS[role] : []
  const current = allowed.includes(tab) ? tab : 'live'
  const Screen = SCREENS[current]

  const badge = (k) => (k === 'live' && nNew + openReq > 0 ? ` (${nNew + openReq})` : '')

  return (
    <div className="min-h-[780px] overflow-hidden rounded-3xl border border-line bg-white shadow-card">
      {!role ? (
        <Login
          onSignIn={(r) => {
            setRole(r)
            setTab('live')
          }}
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 border-b border-line px-[18px] py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-brand-600 font-head text-[13px] font-bold text-white">
                SR
              </span>
              <div>
                <b>Spice Route</b>
                <small className="block text-mute">Signed in as {ROLE_LABEL[role]}</small>
              </div>
            </div>
            <nav className="flex flex-1 flex-wrap gap-1">
              {TABS.filter(([k]) => allowed.includes(k)).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`rounded-[11px] px-3.5 py-2 font-semibold ${
                    current === k ? 'bg-brand-100 text-brand-600' : 'text-mute'
                  }`}
                >
                  {label}
                  {badge(k)}
                </button>
              ))}
            </nav>
            <button className="rounded-[11px] border border-line px-3 py-2 font-semibold" onClick={() => setRole(null)}>
              Sign out
            </button>
          </div>
          <div className="flex flex-col gap-[18px] p-[18px]">
            {current === 'tables' ? <TablesQR onPreview={onPreview} /> : <Screen />}
          </div>
        </>
      )}
    </div>
  )
}
