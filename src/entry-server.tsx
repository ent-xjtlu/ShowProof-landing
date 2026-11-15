import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { MarketingPage } from './components/MarketingPage'

export function renderApp(): string {
  return renderToString(
    <StrictMode>
      <MarketingPage />
    </StrictMode>,
  )
}
