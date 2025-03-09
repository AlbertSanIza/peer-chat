import { createHashHistory, createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { PeerProvider } from './context/PeerProvider'
import './index.css'
import { routeTree } from './routeTree.gen'

const hashHistory = createHashHistory()
const router = createRouter({ routeTree, history: hashHistory })

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PeerProvider>
            <RouterProvider router={router} />
        </PeerProvider>
    </StrictMode>
)
