import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DemoPage from './pages/DemoPage'
import CustomerPage from './pages/CustomerPage'
import AdminPage from './pages/AdminPage'
import ToastHost from './components/ToastHost'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DemoPage />} />
        <Route path="/m" element={<CustomerPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <ToastHost />
    </BrowserRouter>
  )
}
