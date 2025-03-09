import { useState } from 'react'
import QRCode from 'react-qr-code'

import { CameraIcon } from 'lucide-react'
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
        <div className="flex gap-4 border-b border-gray-300 p-4">
            <div className="size-20 min-w-20">
                <QRCode value={peer?.id || 'loading'} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} />
            </div>
            <div className="flex flex-1 flex-col gap-2">
                <div className="flex justify-between gap-4 text-sm font-bold sm:text-lg">
                    {peer?.id.toUpperCase()}
                    <div className="size-3 min-w-3 animate-pulse rounded-full bg-red-500"></div>
                </div>
                <div className="flex flex-col items-center gap-4 sm:flex-row">
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
                    <button className="cursor-pointer rounded-md bg-blue-500 p-2 text-white disabled:cursor-default disabled:opacity-50">
                        <CameraIcon className="" />
                    </button>
                </div>
            </div>
        </div>
    )
}
