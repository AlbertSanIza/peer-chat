import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export const Route = createFileRoute('/')({ component: Index })

function Index() {
    const navigate = Route.useNavigate()
    const [roomId, setRoomId] = useState('')

    const createRoom = () => {
        navigate({ to: `/room/${uuidv4()}` })
    }

    const joinRoom = () => {
        navigate({ to: `/room/${roomId}` })
    }

    return (
        <div className="mx-auto flex max-w-lg flex-col gap-8 p-6">
            <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600" onClick={createRoom}>
                CREATE ROOM
            </button>
            <hr />
            <div className="flex flex-col gap-2">
                <input placeholder="Enter Room ID" className="rounded border p-2" value={roomId} onChange={(event) => setRoomId(event.target.value)} />
                <button
                    className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-70 disabled:hover:bg-green-500"
                    onClick={joinRoom}
                    disabled={!roomId.trim()}
                >
                    JOIN ROOM
                </button>
            </div>
        </div>
    )
}
