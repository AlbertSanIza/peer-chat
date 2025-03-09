import { useState } from 'react'

import { usePeer } from '../context/usePeer'

export default function Header({ onConnect }: { onConnect: (peerId: string) => void }) {
    const { peer } = usePeer()
    const [peerId, setPeerId] = useState('')

    const handleConnect = () => {
        if (!peerId.trim()) {
            return
        }
        onConnect(peerId.trim().toLowerCase())
    }

    return (
        <div className="flex items-center justify-center border-b border-gray-300 p-4">
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-full text-center font-bold">{peer?.id.toUpperCase()}</div>
                <div className="flex items-center gap-2">
                    <input
                        className="h-10 rounded-sm border border-gray-300 px-2"
                        placeholder="Enter Peer ID"
                        onChange={(event) => setPeerId(event.target.value)}
                    />
                    <button
                        className="cursor-pointer rounded-md bg-blue-500 p-2 text-white disabled:cursor-default disabled:opacity-50"
                        onClick={handleConnect}
                        disabled={!peerId.trim()}
                    >
                        Connect
                    </button>
                </div>
            </div>
        </div>
    )
}
