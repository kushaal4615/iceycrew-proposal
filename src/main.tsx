import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App.tsx'
import MockPreview from './mockPreview.tsx'
import { startTracking } from './tracker/tracker'

/* ?mock=1 shows every ProductMock screen in a grid (dev preview); the normal page otherwise. */
const preview = location.search.includes('mock=1')
if (!preview) startTracking()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      {preview ? <MockPreview /> : <App />}
    </MotionConfig>
  </StrictMode>,
)
