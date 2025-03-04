import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
    component: () => (
        <>
            <div className="fixed flex h-10 w-full items-center justify-center border-b bg-white font-bold">Peer Chat</div>
            <div className="pt-10">
                <Outlet />
            </div>
            <TanStackRouterDevtools />
        </>
    )
})
