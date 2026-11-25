import { useState } from 'react'
import { ROLES, ROLE_LABEL } from './roles'

export default function Login({ onSignIn }) {
  const [role, setRole] = useState('owner')
  return (
    <div className="grid min-h-[780px] md:grid-cols-2">
      <div className="flex flex-col justify-center gap-3.5 bg-brand-100 p-9">
        <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-brand-600 font-head text-[13px] font-bold text-white">
          SR
        </span>
        <h2 className="text-[30px] font-semibold leading-tight">Run service with confidence</h2>
        <p className="text-mute">Orders, menu and every table in one place.</p>
        <ul className="flex list-disc flex-col gap-1 pl-[18px] text-mute">
          <li>Live orders with a timer</li>
          <li>Out-of-stock in one tap</li>
          <li>QR code for every table</li>
        </ul>
      </div>
      <form
        className="flex max-w-[420px] flex-col justify-center gap-3 p-9"
        onSubmit={(e) => {
          e.preventDefault()
          onSignIn(role)
        }}
      >
        <h2 className="text-lg font-semibold">Welcome back</h2>
        <label className="flex flex-col gap-1 font-medium">
          Email
          <input className="input font-normal" type="email" defaultValue="manager@spiceroute.in" />
        </label>
        <label className="flex flex-col gap-1 font-medium">
          Password
          <input className="input font-normal" type="password" defaultValue="demo-password" />
        </label>
        <label className="flex flex-col gap-1 font-medium">
          Sign in as
          <select className="input font-normal" value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </select>
        </label>
        <button className="btn" type="submit">
          Sign in
        </button>
        <p className="text-[12.5px] text-mute">
          Demo login. Any details work, and the role decides which tabs you see. Real sign-in comes with Firebase Auth.
        </p>
      </form>
    </div>
  )
}
