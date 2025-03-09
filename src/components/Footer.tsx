import { KeyboardEvent, useState } from 'react'

import { SendHorizonalIcon } from 'lucide-react'
import { usePeer } from '../context/usePeer'

export default function Footer({ onSendMessage }) {
    const { status } = usePeer()
    const [message, setMessage] = useState('')

    const sendMessage = () => {
        if (!message.trim() || !connection) {
            return
        }
        const messageToSend: IMessage = {
            content: message,
            sender: 'me',
            timestamp: Date.now()
        }
        connection.send({ type: 'message', message: messageToSend })
        setMessages((prevMessages) => [...prevMessages, messageToSend])
        setMessage('')
    }

    const handleOnSendMessage = () => {
        onSendMessage(message)
        setMessage('')
    }

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            sendMessage()
        }
    }

    return (
        <div className="flex border-t border-gray-300 p-4">
            <input
                placeholder="Type a message..."
                className="h-12 w-full rounded-3xl border border-gray-300 pr-11 pl-2.5 disabled:opacity-50"
                value={message}
                disabled={!peer}
                onKeyDown={handleKeyPress}
                onChange={(event) => setMessage(event.target.value)}
            />
            <button className="absolute right-6 bottom-6 rounded-full bg-blue-500 p-2.5 text-white disabled:opacity-50" disabled={!message || !connectedToPeer}>
                <SendHorizonalIcon className="size-3" />
            </button>
        </div>
    )
}
