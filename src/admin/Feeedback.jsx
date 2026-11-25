import { useShop } from '../store/shopStore'

const Stars = ({ n }) => (
  <span className="whitespace-nowrap text-brand-600" aria-label={`${n} out of 5`}>
    {'★'.repeat(n)}
    <span className="text-line">{'★'.repeat(5 - n)}</span>
  </span>
)

export default function Feedback() {
  const { feedback } = useShop()
  const avg = feedback.length ? feedback.reduce((a, f) => a + f.rating, 0) / feedback.length : 0
  const list = [...feedback].sort((a, b) => b.t - a.t)

  return (
    <>
      <div>
        <h2 className="text-lg font-semibold">Customer feedback</h2>
        <span className="text-[12.5px] text-mute">Guests can rate their meal after the order is marked served.</span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:max-w-md">
        <div className="rounded-2xl bg-sand px-3.5 py-3">
          <small className="block text-mute">Average rating</small>
          <b className="font-head text-[28px] leading-tight tabular-nums">{avg ? avg.toFixed(1) : '–'}</b>
        </div>
        <div className="rounded-2xl bg-sand px-3.5 py-3">
          <small className="block text-mute">Reviews</small>
          <b className="font-head text-[28px] leading-tight tabular-nums">{feedback.length}</b>
        </div>
      </div>

      <div>
        {list.length === 0 && <p className="text-mute">No feedback yet.</p>}
        {list.map((f) => (
          <div key={f.id} className="flex flex-col gap-1 border-b border-line py-3">
            <div className="flex flex-wrap items-center gap-x-3">
              <Stars n={f.rating} />
              <b>Table {f.table}</b>
              <small className="text-mute">Order #{f.orderId}</small>
            </div>
            {f.comment && <p>{f.comment}</p>}
          </div>
        ))}
      </div>
    </>
  )
}
