import QRCode from 'react-qr-code'

import { LoaderIcon, SendHorizonalIcon } from 'lucide-react'
import { usePeer } from './context/usePeer'

export default function App() {
    const { peer, status } = usePeer()

    return (
        <>
            <div>hello</div>
            <div className="fixed flex size-full flex-col items-center justify-center gap-6 p-6">
                <h1 className="text-center text-3xl font-bold">Peer Chat</h1>
                {status.loading ? (
                    <LoaderIcon className="animate-spin" />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div>ID: {peer?.id}</div>
                        <div className="flex size-30 items-center">
                            {status.online && peer && <QRCode value={peer.id} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} />}
                        </div>
                        <button className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Scan QR Code</button>
                    </div>
                )}
            </div>
            <div className="fixed bottom-0 flex w-full border-t border-gray-300 p-4">
                <input placeholder="Peer Chat" className="h-12 w-full rounded-3xl border border-gray-300 pr-11 pl-2.5" />
                <button className="absolute right-6 bottom-6 rounded-full bg-blue-500 p-2.5 text-white disabled:opacity-50">
                    <SendHorizonalIcon className="size-3" />
                </button>
            </div>
        </>
    )
}
