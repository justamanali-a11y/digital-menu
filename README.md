# Spice Route: QR Menu (MVP demo)

Restaurant QR menu: guest scans a table QR, orders from the phone, restaurant sees the order live.
Built with **React 18 + Vite + Tailwind CSS 3**. No backend yet: data is dummy and saved in the browser.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Pages

| Route | Who | What |
|---|---|---|
| `/` | You (pitch) | Phone and restaurant dashboard side by side. Order on the left, see it arrive on the right. |
| `/m?table=5` | Guest | Customer app. This is the link inside each table QR. |
| `/admin` | Staff | Login, Live Orders, Menu management, Tables and QR. |

`/m` and `/admin` can be open in two tabs of the same browser. Orders sync between them through localStorage.
Use "Reset demo" on `/` to bring back the starting data.

## Folder map

```
src/
  data/menu.js          dummy menu and seed orders
  store/shopStore.js    shared items and orders + actions (the ONLY place to swap for Firebase)
  customer/             Menu, ItemSheet, Cart, Payment, Status, CartContext
  admin/                Login, LiveOrders, MenuManager, TablesQR, AdminApp
  pages/                DemoPage, CustomerPage, AdminPage
  components/           DishArt, VegDot, Stepper, Switch, ToastHost
  lib/                  format (₹, GST), toast and beep, useNow
```

## Next steps (in this order)

1. **Firebase Firestore.** Open `src/store/shopStore.js`. Replace each action body with a Firestore call and the state with an `onSnapshot` listener. Components keep using `useShop()` and `actions`, so they stay as they are.
   Data layout: keep `restaurantId` on every document so multi-restaurant SaaS works later:
   `restaurants/{rid}/items`, `restaurants/{rid}/orders`, `restaurants/{rid}/tables`.
2. **Firebase Auth** for the staff login (`src/admin/Login.jsx`). Guests need no login.
3. **Razorpay** in `src/customer/PaymentScreen.jsx` (see the TODO in `place`). Place the order only after payment succeeds.
4. **Real photos.** Replace `DishArt` with an `<img>` and store images in Firebase Storage.
5. **Deploy.** On Vercel, import the GitHub repo (Framework: Vite, build `npm run build`, output `dist`). `vercel.json` is already included so `/m` and `/admin` open directly. On Firebase Hosting instead, Add a rewrite of `**` to `/index.html`, otherwise `/m` and `/admin` show 404 on refresh. Then the QR codes in Tables and QR point to your real domain.
6. Later features (already designed): Reject order, Call waiter, offers, reports, staff roles, Hindi toggle.

## Notes

- Colors and fonts are in `tailwind.config.js` (`brand`, `cream`, `ink`, fonts Inter and Space Grotesk).
- GST rate is `GST_RATE` in `src/lib/format.js`.
- Table count (12) is the `TABLES` constant in `src/admin/TablesQR.jsx`.
