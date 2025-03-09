import { useState } from 'react'
import QRCode from 'react-qr-code'

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
        <div className="flex h-28 gap-4 border-b border-gray-300 p-4">
            <div className="size-20 min-w-20">
                <QRCode value={peer?.id || 'loading'} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-2">
                <div className="font-bold">{peer?.id.toUpperCase()}</div>
                <div className="flex items-center gap-4">
                    <input
                        className="h-10 flex-1 rounded-sm border border-gray-300 px-2"
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
                    <div className="flex gap-2">
                        <button className="cursor-pointer rounded-md bg-blue-500 p-2 text-white disabled:cursor-default disabled:opacity-50">
                            Scan to Connect
                        </button>
                    </div>
                </div>
            </div>
            <div className="size-3 min-w-3 animate-pulse rounded-full bg-red-500"></div>
        </div>
    )
}
