import { LoaderIcon, SendHorizonal } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { usePeer } from '../context/usePeer'
import { IMessage, Message } from './Message'

interface ChatRoomProps {
    roomId: string
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
    const { peer, status } = usePeer()
    const [messages, setMessages] = useState<IMessage[]>([])
    const [message, setMessage] = useState('')
    const [connection, setConnection] = useState<Peer.DataConnection | null>(null)
    const [connectedToPeer, setConnectedToPeer] = useState(false)
    const [connectionError, setConnectionError] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom when new messages arrive
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
        if (!message || !connection) return

        const messageToSend: IMessage = {
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

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
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
            <div className="border-b border-gray-300 p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Chat Room: {roomId}</h2>
                    <span className={`h-3 w-3 rounded-full ${connectedToPeer ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </div>
                {connectionError && <p className="mt-2 text-sm text-red-500">{connectionError}</p>}
                {!connectedToPeer && !connectionError && <p className="mt-2 text-sm text-gray-500">Waiting for someone to join...</p>}
                <p className="mt-1 text-sm text-gray-500">Share this room ID with others to chat</p>
            </div>
            <div className="flex-1 overflow-auto p-6">
                {messages.map((msg) => (
                    <Message key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
                {messages.length === 0 && <p className="py-8 text-center text-gray-400">No messages yet. Start the conversation!</p>}
            </div>
            <div className="relative flex border-t border-gray-300 p-4">
                <input
                    placeholder="Peer Chat"
                    className="h-12 w-full rounded-3xl border border-gray-300 pr-11 pl-2.5"
                    value={message}
                    onKeyDown={handleKeyPress}
                    onChange={(event) => setMessage(event.target.value.trim())}
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
