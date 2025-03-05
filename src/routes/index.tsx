import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export const Route = createFileRoute('/')({ component: Index })

function Index() {
    const navigate = Route.useNavigate()
    const [roomId, setRoomId] = useState('')

    const createRoom = () => {
        navigate({ to: `/${uuidv4()}` })
    }

    const joinRoom = () => {
        navigate({ to: `/${roomId}` })
    }

    return (
        <div className="fixed flex size-full items-center justify-center p-6">
            <div className="grid w-100 gap-6">
                <h1 className="text-center text-3xl font-bold">Peer Chat</h1>
                <button className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600" onClick={createRoom}>
                    New Room
                </button>
                <hr className="text-gray-300" />
                <div className="flex flex-col gap-4">
                    <input
                        placeholder="Room ID"
                        className="h-10 rounded border border-gray-300 px-2"
                        value={roomId}
                        onChange={(event) => setRoomId(event.target.value)}
                    />
                    <button
                        className="cursor-pointer rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:cursor-auto disabled:opacity-70 disabled:hover:bg-green-500"
                        onClick={joinRoom}
                        disabled={!roomId.trim()}
                    >
                        Join Room
                    </button>
                </div>
            </div>
        </div>
    )
}
