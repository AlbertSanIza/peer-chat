import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { PeerProvider } from './context/PeerProvider'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PeerProvider>
            <App />
        </PeerProvider>
    </StrictMode>
)
