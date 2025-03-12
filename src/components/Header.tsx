import { useEffect, useState } from 'react'

import { usePeer } from '../context/usePeer'

export default function Header({ connected, onConnect, onDisconnect }: { connected: boolean; onConnect: (peerId: string) => void; onDisconnect?: () => void }) {
    const { peer } = usePeer()
    const [peerId, setPeerId] = useState('')

    useEffect(() => {
        if (!connected) {
            setPeerId('')
        }
    }, [connected])

    const handleConnect = () => {
        if (!peerId.trim()) {
            return
        }
        onConnect(peerId.trim())
    }

    return (
        <div className="flex flex-col gap-4 border-b border-gray-300 p-4">
            <div className="flex justify-between gap-4 text-sm font-bold sm:text-lg">
                <button className="cursor-pointer" onClick={() => navigator.clipboard.writeText(peer?.id || '')}>
                    {peer?.id}
                </button>
                <div className={`size-3 min-w-3 ${connected ? '' : 'animate-pulse'} rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-4">
                {!connected && (
                    <input
                        className="h-10 min-h-10 w-full rounded-sm border border-gray-300 px-2"
                        placeholder="Enter Peer ID"
                        value={peerId}
                        onChange={(event) => setPeerId(event.target.value)}
                    />
                )}
                <button
                    className={`w-full cursor-pointer rounded-md ${connected ? 'bg-red-500' : 'bg-blue-500'} p-2 text-white disabled:cursor-default disabled:opacity-50 ${connected ? '' : 'sm:w-fit'}`}
                    disabled={!peerId.trim() && !connected}
                    onClick={connected ? onDisconnect : handleConnect}
                >
                    {connected ? 'Disconnect' : 'Connect'}
                </button>
            </div>
        </div>
    )
}
