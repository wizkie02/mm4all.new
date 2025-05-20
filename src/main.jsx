import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// We're not importing index.css as we're using styled-components

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
