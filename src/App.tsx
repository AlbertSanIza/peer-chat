import type { DataConnection } from 'peerjs'
import { useEffect, useState } from 'react'

import { LoaderIcon } from 'lucide-react'
import Footer from './components/Footer'
import Header from './components/Header'
import { IMessage } from './components/Message'
import Messages from './components/Messages'
import { usePeer } from './context/usePeer'

export default function App() {
    const { peer, status } = usePeer()
    const [messages, setMessages] = useState<IMessage[]>([])
    const [peerId, setPeerId] = useState('')
    const [connection, setConnection] = useState<DataConnection | undefined>(undefined)
    const [connectedToPeer, setConnectedToPeer] = useState(false)
    const [connectionError, setConnectionError] = useState<string | null>(null)

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
        <div className="fixed flex size-full flex-col">
            <Header onConnect={connectToPeer} />
            <Messages messages={messages} />
            <Footer connection={connection} onSendMessage={(message) => sendMessage(message)} />
        </div>
    )
}
