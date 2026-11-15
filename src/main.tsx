import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/fonts.css'
import './styles/base.css'
import './styles/header.css'
import './styles/hero.css'
import './styles/sections.css'
import { MarketingPage } from './components/MarketingPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MarketingPage />
  </StrictMode>,
)
