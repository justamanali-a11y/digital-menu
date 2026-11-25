import { useState } from 'react'
import { CartProvider, useCart } from './CartContext'
import MenuScreen from './MenuScreen'
import ItemSheet from './ItemSheet'
import CartScreen from './CartScreen'
import PaymentScreen from './PaymentScreen'
import StatusScreen from './StatusScreen'
import HelpSheet from './HelpSheet'

// Customer phone app. Give it a parent with a fixed height (phone frame or h-[100dvh]).
export default function CustomerApp({ table }) {
  return (
    <CartProvider>
      <Screens table={table} />
    </CartProvider>
  )
}

function Screens({ table }) {
  const cart = useCart()
  const [screen, setScreen] = useState('menu') // menu | cart | pay | status
  const [orderId, setOrderId] = useState(null)
  const [sheetItem, setSheetItem] = useState(null)
  const [helpOpen, setHelpOpen] = useState(false)
  const onHelp = () => setHelpOpen(true)

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-cream">
      {screen === 'menu' && (
        <MenuScreen table={table} onOpen={setSheetItem} onGoCart={() => setScreen('cart')} onHelp={onHelp} />
      )}
      {screen === 'cart' && (
        <CartScreen table={table} onBack={() => setScreen('menu')} onPay={() => setScreen('pay')} onHelp={onHelp} />
      )}
      {screen === 'pay' && (
        <PaymentScreen
          table={table}
          onBack={() => setScreen('cart')}
          onHelp={onHelp}
          onPlaced={(id) => {
            setOrderId(id)
            setScreen('status')
          }}
        />
      )}
      {screen === 'status' && <StatusScreen orderId={orderId} onMore={() => setScreen('menu')} onHelp={onHelp} />}

      {sheetItem && (
        <ItemSheet
          item={sheetItem}
          onClose={() => setSheetItem(null)}
          onAdd={(qty, note) => {
            cart.add(sheetItem, qty, note)
            setSheetItem(null)
          }}
        />
      )}
      {helpOpen && <HelpSheet table={table} onClose={() => setHelpOpen(false)} />}
    </div>
  )
}
