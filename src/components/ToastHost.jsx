import { useToast } from '../lib/toast'

export default function ToastHost() {
  const message = useToast()
  if (!message) return null
  return (
    <div
      role="status"
      className="fixed left-1/2 z-50 max-w-[calc(100vw-32px)] -translate-x-1/2 rounded-2xl bg-ink px-4 py-3 font-semibold text-cream shadow-card"
      style={{ bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' }}
    >
      {message}
    </div>
  )
}
