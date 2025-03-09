import { LoaderIcon } from 'lucide-react'
import { useState } from 'react'
import QRCode from 'react-qr-code'

import { usePeer } from '../context/usePeer'

export default function Header({ onConnect }: { onConnect: (peerId: string) => void }) {
    const { peer, status } = usePeer()
    const [peerId, setPeerId] = useState('')

    const handleConnect = () => {
        if (!peerId.trim()) {
            return
        }
        onConnect(peerId.trim())
    }

    return (
        <div className="border-b border-gray-300 p-4">
            {status.loading ? (
                <LoaderIcon className="animate-spin" />
            ) : (
                <div className="flex flex-col items-center justify-center gap-4">
                    <div>ID: {peer?.id}</div>
                    <div className="flex size-30 items-center">
                        {status.online && peer && <QRCode value={peer.id} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} />}
                    </div>
                    <input className="border border-gray-300" placeholder="Enter Peer ID" onChange={(event) => setPeerId(event.target.value)} />
                    <button className="rounded-md bg-blue-500 p-1 text-white" onClick={handleConnect}>
                        Connect
                    </button>
                </div>
            )}
        </div>
    )
}
