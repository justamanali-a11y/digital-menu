import { useState } from 'react'
import CustomerApp from '../customer/CustomerApp'
import AdminApp from '../admin/AdminApp'
import { actions, useShop } from '../store/shopStore'

// Pitch view: customer phone and restaurant dashboard side by side.
export default function DemoPage() {
  const [view, setView] = useState('customer') // only used below the lg breakpoint
  const [table, setTable] = useState(5)
  const { orders } = useShop()
  const nNew = orders.filter((o) => o.status === 'new').length

  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-8" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <header className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 py-4">
        <div>
          <h2 className="text-lg font-semibold">Spice Route · QR menu demo</h2>
          <p className="max-w-[60ch] text-mute">
            Order on the phone, then watch it arrive on the restaurant dashboard. Everything here is clickable.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-[11px] border border-line px-3 py-2 font-semibold" onClick={actions.resetDemo}>
            Reset demo
          </button>
          <div className="flex rounded-full bg-sand p-[3px] lg:hidden" role="tablist" aria-label="Choose view">
            <button
              onClick={() => setView('customer')}
              className={`rounded-full px-4 py-2 font-semibold ${view === 'customer' ? 'bg-brand-600 text-white' : 'text-mute'}`}
            >
              Customer
            </button>
            <button
              onClick={() => setView('admin')}
              className={`rounded-full px-4 py-2 font-semibold ${view === 'admin' ? 'bg-brand-600 text-white' : 'text-mute'}`}
            >
              Restaurant{nNew ? ` (${nNew} new)` : ''}
            </button>
          </div>
        </div>
      </header>

      <main className="grid gap-6 lg:grid-cols-[400px_minmax(0,1fr)] lg:items-start">
        <section className={`${view === 'customer' ? 'block' : 'hidden'} lg:block`} aria-label="Customer phone view">
          <div className="mx-auto h-[780px] max-h-[calc(100dvh-120px)] min-h-[560px] w-full max-w-[400px] overflow-hidden rounded-[30px] border border-line shadow-card">
            <CustomerApp table={table} />
          </div>
        </section>
        <section className={`${view === 'admin' ? 'block' : 'hidden'} lg:block`} aria-label="Restaurant dashboard">
          <AdminApp
            startSignedIn
            onPreview={(t) => {
              setTable(t)
              setView('customer')
            }}
          />
        </section>
      </main>

      <p className="mt-5 max-w-[80ch] text-xs text-mute">
        Dish pictures are placeholders. Payment is simulated. Data is saved in this browser only.
      </p>
    </div>
  )
}
