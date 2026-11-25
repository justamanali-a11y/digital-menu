import { useState } from 'react'
import { actions, useShop } from '../store/shopStore'
import { toast } from '../lib/toast'
import { ACCESS, ROLES, ROLE_LABEL, TABS } from './roles'

export default function Staff() {
  const { staff } = useShop()
  const [name, setName] = useState('')
  const [role, setRole] = useState('waiter')
  const tabName = Object.fromEntries(TABS)

  const add = () => {
    if (!name.trim()) {
      toast('Enter the staff member name')
      return
    }
    actions.addStaff({ name, role })
    toast(`${name.trim()} added as ${ROLE_LABEL[role]}`)
    setName('')
  }

  return (
    <>
      <div>
        <h2 className="text-lg font-semibold">Staff and roles</h2>
        <span className="text-[12.5px] text-mute">Each role only sees the tabs it needs. Sign out and sign in as another role to try it.</span>
      </div>

      <div className="card flex flex-wrap items-end gap-2.5">
        <label className="flex min-w-[160px] flex-1 flex-col gap-1 text-[12.5px] font-medium">
          Name
          <input className="input min-h-[40px]" value={name} onChange={(e) => setName(e.target.value)} placeholder="Staff name" />
        </label>
        <label className="flex flex-col gap-1 text-[12.5px] font-medium">
          Role
          <select className="input min-h-[40px]" value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </select>
        </label>
        <button className="btn" onClick={add}>
          Add staff
        </button>
      </div>

      <div>
        {staff.map((s) => (
          <div key={s.id} className="flex flex-wrap items-center gap-3 border-b border-line py-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 font-head font-bold text-brand-600">
              {s.name.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-[160px] flex-1">
              <b>{s.name}</b>
              <small className="block text-mute">{ACCESS[s.role].map((k) => tabName[k]).join(', ')}</small>
            </div>
            <select
              className="input min-h-[38px] w-auto"
              aria-label={`Role of ${s.name}`}
              value={s.role}
              onChange={(e) => actions.setStaffRole(s.id, e.target.value)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r]}
                </option>
              ))}
            </select>
            <button className="rounded-[11px] border border-line px-3 py-2 font-semibold" onClick={() => actions.removeStaff(s.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
