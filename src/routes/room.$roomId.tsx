import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/room/$roomId')({ component: RouteComponent })

function RouteComponent() {
    const { roomId } = Route.useParams()

    return <div>Hello "/room/{roomId}"!</div>
}
