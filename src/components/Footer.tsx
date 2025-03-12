import { SendHorizonalIcon } from 'lucide-react'
import type { DataConnection } from 'peerjs'
import { KeyboardEvent, useState } from 'react'

import { usePeer } from '../context/usePeer'
import { IMessage } from './Message'

export default function Footer({
    connected,
    connection,
    onSendMessage
}: {
    connected: boolean
    connection?: DataConnection
    onSendMessage: (message: IMessage) => void
}) {
    const { status } = usePeer()
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
        onSendMessage({ content: message.trim(), sender: 'me', timestamp: Date.now() })
        setMessage('')
    }

    return (
        <div className="flex border-t border-gray-300 p-4">
            <input
                placeholder="Type a message..."
                className="h-12 w-full rounded-3xl border border-gray-300 pr-11 pl-2.5 disabled:opacity-50"
                value={message}
                onKeyDown={handleKeyPress}
                disabled={!status.online || !connection}
                onChange={(event) => setMessage(event.target.value)}
            />
            <button
                className="absolute right-6 bottom-6 cursor-pointer rounded-full bg-blue-500 p-2.5 text-white disabled:cursor-default disabled:opacity-50"
                disabled={!status.online || !connection || !connected}
                onClick={handleSendMessage}
            >
                <SendHorizonalIcon className="size-3" />
            </button>
        </div>
    )
}
