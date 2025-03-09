import type { DataConnection } from 'peerjs'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import QRCode from 'react-qr-code'

import { LoaderIcon, SendHorizonalIcon } from 'lucide-react'
import { IMessage, Message } from './Message'
import { usePeer } from './context/usePeer'

export default function App() {
    const { peer, status } = usePeer()
    const [messages, setMessages] = useState<IMessage[]>([])
    const [message, setMessage] = useState('')
    const [peerId, setPeerId] = useState('')
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
    }, [peer])

    const connectToPeer = (peerId: string) => {
        if (!peer) {
            return
        }
        const conn = peer.connect(peerId)
        setupConnection(conn)
    }

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

    return (
        <>
            <div className="absolute flex size-full items-center justify-center text-3xl font-bold opacity-10">Peer Chat</div>
            <div className="fixed flex size-full flex-col">
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
                            <button className="rounded-md bg-blue-500 text-white" onClick={() => connectToPeer(peerId)}>
                                Connect
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex-1 overflow-hidden">
                    <div className="size-full overflow-auto pt-2">
                        {messages.map((msg, index) => (
                            <Message key={index} message={msg} />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                <div className="flex border-t border-gray-300 p-4">
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
                        disabled={!message || !connectedToPeer}
                    >
                        <SendHorizonalIcon className="size-3" />
                    </button>
                </div>
            </div>
        </>
    )
}
