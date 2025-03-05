import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { usePeer } from '../context/PeerContext'
import { IMessage, Message } from './Message'

interface ChatRoomProps {
    roomId: string
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
    const { peer, connecting, connected, error } = usePeer()
    const [messages, setMessages] = useState<IMessage[]>([])
    const [messageText, setMessageText] = useState('')
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
        if (!peer) return

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

        conn.on('error', (err) => {
            console.error('Connection error:', err)
            setConnectionError('Connection error: ' + err.message)
        })
    }

    const sendMessage = () => {
        if (!messageText.trim() || !connection) return

        const message: IMessage = {
            id: uuidv4(),
            content: messageText.trim(),
            sender: 'me',
            timestamp: Date.now()
        }

        // Add to local messages
        setMessages((prevMessages) => [...prevMessages, message])

        // Send to peer
        connection.send({
            type: 'chat-message',
            message: {
                id: message.id,
                content: message.content,
                timestamp: message.timestamp
            }
        })

        setMessageText('')
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    if (connecting) {
        return <div className="fixed flex size-full items-center justify-center">Connecting...</div>
    }

    if (error) {
        return <div className="fixed flex size-full items-center justify-center text-red-500">Error: {error.message}</div>
    }

    if (!connected) {
        return <div className="fixed flex size-full items-center justify-center text-red-500">Failed to connect to the chat room</div>
    }

    return (
        <div className="flex h-full flex-col">
            <div className="border-b p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Chat Room: {roomId}</h2>
                    <span className={`h-3 w-3 rounded-full ${connectedToPeer ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </div>
                {connectionError && <p className="mt-2 text-sm text-red-500">{connectionError}</p>}
                {!connectedToPeer && !connectionError && <p className="mt-2 text-sm text-gray-500">Waiting for someone to join...</p>}
                <p className="mt-1 text-sm text-gray-500">Share this room ID with others to chat</p>
            </div>

            <div className="flex-1 overflow-auto p-4">
                {messages.map((msg) => (
                    <Message key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
                {messages.length === 0 && <p className="py-8 text-center text-gray-400">No messages yet. Start the conversation!</p>}
            </div>

            <div className="border-t p-4">
                <div className="flex gap-2">
                    <textarea
                        className="flex-1 resize-none rounded border p-2"
                        placeholder="Type your message..."
                        rows={2}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        disabled={!connectedToPeer}
                    />
                    <button
                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                        onClick={sendMessage}
                        disabled={!messageText.trim() || !connectedToPeer}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}
