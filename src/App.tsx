import { LoaderIcon } from 'lucide-react'
import type { DataConnection } from 'peerjs'
import { useEffect, useRef, useState } from 'react'
import QRCode from 'react-qr-code'

import { IMessage } from './Message'
import Footer from './components/Footer'
import Messages from './components/Messages'
import { usePeer } from './context/usePeer'

export default function App() {
    const { peer, status } = usePeer()
    const [messages, setMessages] = useState<IMessage[]>([])
    const [peerId, setPeerId] = useState('')
    const [connection, setConnection] = useState<DataConnection | undefined>(undefined)
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

    const sendMessage = (message: IMessage) => {
        if (!connection) {
            return
        }
        connection.send({ type: 'message', message })
        setMessages((prevMessages) => [...prevMessages, message])
    }

    return (
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
                        <button className="rounded-md bg-blue-500 p-1 text-white" onClick={() => connectToPeer(peerId)}>
                            Connect
                        </button>
                    </div>
                )}
            </div>
            <Messages messages={messages} />
            <Footer connection={connection} onSendMessage={(message) => sendMessage(message)} />
        </div>
    )
}
