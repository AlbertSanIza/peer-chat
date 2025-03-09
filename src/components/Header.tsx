import { useState } from 'react'
import QRCode from 'react-qr-code'

import { usePeer } from '../context/usePeer'

export default function Header({ connected, onConnect }: { connected: boolean; onConnect: (peerId: string) => void }) {
    const { peer } = usePeer()
    const [peerId, setPeerId] = useState('')

    const handleConnect = () => {
        if (!peerId.trim()) {
            return
        }
        onConnect(peerId.trim())
    }

    return (
        <div className="flex gap-4 border-b border-gray-300 p-4">
            <div className="size-20 min-w-20">
                <QRCode value={peer?.id || 'loading'} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-2">
                <div className="flex justify-between gap-4 text-sm font-bold sm:text-lg">
                    <button className="cursor-pointer" onClick={() => navigator.clipboard.writeText(peer?.id || '')}>
                        {peer?.id}
                    </button>
                    <div className={`size-3 min-w-3 ${connected ? '' : 'animate-pulse'} rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
                <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
                    <input
                        className="h-10 min-h-10 w-full rounded-sm border border-gray-300 px-2"
                        placeholder="Enter Peer ID"
                        onChange={(event) => setPeerId(event.target.value)}
                    />
                    <button
                        className="w-full cursor-pointer rounded-md bg-blue-500 p-2 text-white disabled:cursor-default disabled:opacity-50 sm:w-fit"
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
