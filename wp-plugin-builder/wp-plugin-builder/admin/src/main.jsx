import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const rootEl = document.getElementById('wpb-root') || document.createElement('div')
if (!document.getElementById('wpb-root')) {
  rootEl.id = 'wpb-root'
  document.body.prepend(rootEl)
}
const root = createRoot(rootEl)
root.render(<App />)
