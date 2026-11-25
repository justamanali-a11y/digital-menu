// Which dashboard tabs each staff role can open. Enforce the same rules in Firestore security rules later.
export const ROLES = ['owner', 'manager', 'kitchen', 'waiter']

export const ROLE_LABEL = { owner: 'Owner', manager: 'Manager', kitchen: 'Kitchen', waiter: 'Waiter' }

export const TABS = [
  ['live', 'Live orders'],
  ['menu', 'Menu'],
  ['tables', 'Tables and QR'],
  ['offers', 'Offers'],
  ['reports', 'Reports'],
  ['feedback', 'Feedback'],
  ['inventory', 'Inventory'],
  ['staff', 'Staff'],
]

export const ACCESS = {
  owner: ['live', 'menu', 'tables', 'offers', 'reports', 'feedback', 'inventory', 'staff'],
  manager: ['live', 'menu', 'tables', 'offers', 'reports', 'feedback', 'inventory'],
  kitchen: ['live', 'menu', 'inventory'],
  waiter: ['live', 'tables'],
}
