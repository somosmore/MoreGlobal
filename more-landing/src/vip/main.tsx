import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import '../i18n'
import { VipLanding } from './pages/VipLanding'

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <VipLanding />
    </StrictMode>,
  )
}

