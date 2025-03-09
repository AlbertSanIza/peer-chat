import { LoaderIcon, SendHorizonal } from 'lucide-react'
import type { DataConnection } from 'peerjs'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import QRCode from 'react-qr-code'
import { v4 as uuidv4 } from 'uuid'

import { usePeer } from '../context/usePeer'
import { IMessage, Message } from './components/Message'

export function ChatRoom({ roomId }: { roomId: string }) {
    const { peer, status } = usePeer()
    const [messages, setMessages] = useState<IMessage[]>([])
    const [message, setMessage] = useState('')
    const [connection, setConnection] = useState<DataConnection | null>(null)
    const [connectedToPeer, setConnectedToPeer] = useState(false)
    const [connectionError, setConnectionError] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        if (!peer) {
            return
        }
        peer.on('connection', (conn) => {
            setupConnection(conn)
        })
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

    const setupConnection = (connection: DataConnection) => {
        connection.on('open', () => {
            setConnection(connection)
            setConnectedToPeer(true)
            setConnectionError(null)
        })
        connection.on('data', (data: unknown) => {
            const message = data as { type: string; message: IMessage }
            if (message.type === 'message') {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        ...message.message,
                        sender: 'peer'
                    }
                ])
            }
        })
        connection.on('close', () => {
            setConnectedToPeer(false)
        })
        connection.on('error', (error: Error) => {
            setConnectionError(error.message)
        })
    }

    const sendMessage = () => {
        if (!message.trim() || !connection) {
            return
        }
        const messageToSend: IMessage = {
            id: uuidv4(),
            content: message,
            sender: 'me',
            timestamp: Date.now()
        }
        connection.send({ type: 'message', message: messageToSend })
        setMessages((prevMessages) => [...prevMessages, messageToSend])
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
        <div className="fixed flex size-full h-full flex-col pb-[81px]">
            <div className="grid grid-cols-[80px_auto] gap-4 border-b border-gray-300 p-4">
                <QRCode value={window.location.href} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} />
                <div>
                    <div className="flex items-center justify-between">
                        <div className="text-xl font-bold">{roomId}</div>
                        <span
                            className={`size-3 min-w-3 ${connectedToPeer ? '' : 'animate-pulse'} rounded-full ${connectedToPeer ? 'bg-green-500' : 'bg-red-500'}`}
                        ></span>
                    </div>
                    {connectionError && <p className="mt-2 text-sm text-red-500">{connectionError}</p>}
                    {!connectedToPeer && !connectionError && <p className="mt-2 text-sm text-gray-500">Waiting for someone to join...</p>}
                </div>
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="size-full overflow-auto pt-2">
                    {messages.map((msg) => (
                        <Message key={msg.id} message={msg} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="absolute bottom-0 flex w-full border-t border-gray-300 p-4">
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
