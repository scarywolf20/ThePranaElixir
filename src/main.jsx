import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { PromoProvider } from './context/PromoContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <PromoProvider>
            <App />
          </PromoProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  </StrictMode>,
)
