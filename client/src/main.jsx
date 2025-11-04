import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import './index.css'
import App from './App.jsx'
import  { AuthProvider } from './Context/AuthContext.jsx'

// Configure axios base URL for production (Render) and development
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || ''

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
   <AuthProvider>
    <App/>
   </AuthProvider>
  </BrowserRouter>,
)
