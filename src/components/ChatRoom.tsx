import { LoaderIcon, SendHorizonal } from 'lucide-react'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import QRCode from 'react-qr-code'
import { v4 as uuidv4 } from 'uuid'

import { usePeer } from '../context/usePeer'
import { IMessage, Message } from './Message'

export function ChatRoom({ roomId }: { roomId: string }) {
    const { peer, status } = usePeer()
    const [messages, setMessages] = useState<IMessage[]>([])
    const [message, setMessage] = useState('')
    const [connection, setConnection] = useState<Peer.DataConnection | null>(null)
    const [connectedToPeer, setConnectedToPeer] = useState(false)
    const [connectionError, setConnectionError] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Handle incoming connections
    useEffect(() => {
        if (!peer) {
            return
        }

        peer.on('connection', (conn) => {
            setupConnection(conn)
        })

        // Try to connect if we're not the creator of the room
        if (peer.id !== roomId) {
            try {
                const conn = peer.connect(roomId)
                setupConnection(conn)
            } catch (err) {
                console.error('Failed to connect to peer:', err)
                setConnectionError('Failed to connect to the other peer')
            }
        }
    }, [peer, roomId])

    const setupConnection = (conn: Peer.DataConnection) => {
        conn.on('open', () => {
            console.log('Connected to peer')
            setConnection(conn)
            setConnectedToPeer(true)
            setConnectionError(null)
        })

        conn.on('data', (data: any) => {
            if (typeof data === 'object' && data.type === 'chat-message') {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        ...data.message,
                        sender: 'peer'
                    }
                ])
            }
        })

        conn.on('close', () => {
            console.log('Connection closed')
            setConnectedToPeer(false)
            setConnectionError('Peer disconnected')
        })

        conn.on('error', (err: Error) => {
            console.error('Connection error:', err)
            setConnectionError('Connection error: ' + err.message)
        })
    }

    const sendMessage = () => {
        if (!message.trim('') || !connection) {
            return
        }

        const messageToSend: any = {
            id: uuidv4(),
            content: message.trim(),
            sender: 'me',
            timestamp: Date.now()
        }

        // Add to local messages
        setMessages((prevMessages) => [...prevMessages, messageToSend])

        // Send to peer
        connection.send({
            type: 'chat-message',
            message: {
                id: message.id,
                content: message.content,
                timestamp: message.timestamp
            }
        })

        setMessage('')
    }

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            sendMessage()
        }
    }

    if (status.loading) {
        return (
            <div className="fixed flex size-full items-center justify-center text-gray-300">
                <LoaderIcon className="animate-spin" />
            </div>
        )
    }

    if (status.error) {
        return <div className="fixed flex size-full items-center justify-center text-red-500">Error: {status.error.message}</div>
    }

    if (!status.online) {
        return <div className="fixed flex size-full items-center justify-center text-red-500">Failed to connect to the chat room</div>
    }

    return (
        <div className="fixed flex size-full h-full flex-col">
            <div className="grid grid-cols-[80px_auto] gap-4 border-b border-gray-300 p-4">
                <QRCode value={window.location.href} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} />
                <div>
                    <div className="flex items-center justify-between">
                        <div className="text-xl font-bold">{roomId}</div>
                        <span
                            className={`h-3 w-3 ${connectedToPeer ? '' : 'animate-pulse'} rounded-full ${connectedToPeer ? 'bg-green-500' : 'bg-red-500'}`}
                        ></span>
                    </div>
                    {connectionError && <p className="mt-2 text-sm text-red-500">{connectionError}</p>}
                    {!connectedToPeer && !connectionError && <p className="mt-2 text-sm text-gray-500">Waiting for someone to join...</p>}
                </div>
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="size-full overflow-auto">
                    {messages.map((msg) => (
                        <Message key={msg.id} message={msg} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="relative flex border-t border-gray-300 p-4">
                <input
                    placeholder="Peer Chat"
                    className="h-12 w-full rounded-3xl border border-gray-300 pr-11 pl-2.5"
                    value={message}
                    onKeyDown={handleKeyPress}
                    onChange={(event) => setMessage(event.target.value)}
                />
                <button
                    className="absolute right-6 bottom-6 rounded-full bg-blue-500 p-2.5 text-white disabled:opacity-50"
                    onClick={sendMessage}
                    disabled={!message || !connectedToPeer}
                >
                    <SendHorizonal className="size-3" />
                </button>
            </div>
        </div>
    )
}
