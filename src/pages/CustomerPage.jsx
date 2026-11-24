import { useSearchParams } from 'react-router-dom'
import CustomerApp from '../customer/CustomerApp'

// What a guest sees after scanning the table QR: /m?table=5
export default function CustomerPage() {
  const [params] = useSearchParams()
  const table = Number(params.get('table')) || 1
  return (
    <div className="mx-auto h-[100dvh] max-w-[480px]">
      <CustomerApp table={table} />
    </div>
  )
}
