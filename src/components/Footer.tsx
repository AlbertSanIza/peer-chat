import { SendHorizonalIcon } from 'lucide-react'
import type { DataConnection } from 'peerjs'
import { KeyboardEvent, useState } from 'react'

import { usePeer } from '../context/usePeer'

export default function Footer({ connection, onSendMessage }: { connection?: DataConnection; onSendMessage: (message: string) => void }) {
    const { peer, status } = usePeer()
    const [message, setMessage] = useState('')

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            handleSendMessage()
        }
    }

    const handleSendMessage = () => {
        if (!message.trim()) {
            return
        }
        onSendMessage(message)
        setMessage('')
    }

    return (
        <div className="flex border-t border-gray-300 bg-amber-50 p-4">
            <input
                placeholder="Type a message..."
                className="h-12 w-full rounded-3xl border border-gray-300 pr-11 pl-2.5 disabled:opacity-50"
                value={message}
                disabled={!peer}
                onKeyDown={handleKeyPress}
                onChange={(event) => setMessage(event.target.value)}
            />
            <button
                className="absolute right-6 bottom-6 rounded-full bg-blue-500 p-2.5 text-white disabled:opacity-50"
                disabled={!message.trim() || !status.online || !connection}
            >
                <SendHorizonalIcon className="size-3" />
            </button>
        </div>
    )
}
