import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';

axios.defaults.baseURL = 'https://cordeiro360-back.onrender.com';
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import './App.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
