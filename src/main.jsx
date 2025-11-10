import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Global styles
import './index.css'
import './styles/theme.css'   // 👈 ye naya line add karo

createRoot(document.getElementById('root')).render(<App />)
