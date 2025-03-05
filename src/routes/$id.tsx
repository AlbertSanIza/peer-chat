import { createFileRoute } from '@tanstack/react-router'

import { ChatRoom } from '../components/ChatRoom'
import { PeerProvider } from '../context/PeerProvider'

export const Route = createFileRoute('/$id')({ component: RouteComponent })

function RouteComponent() {
    const { id } = Route.useParams()

    return (
        <div className="h-screen">
            <PeerProvider peerId={id}>
                <ChatRoom roomId={id} />
            </PeerProvider>
        </div>
    )
}
