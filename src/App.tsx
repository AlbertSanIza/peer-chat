import { LoaderIcon } from 'lucide-react'
import type { DataConnection } from 'peerjs'
import { useEffect, useState } from 'react'

import Footer from './components/Footer'
import Header from './components/Header'
import { IMessage } from './components/Message'
import Messages from './components/Messages'
import { usePeer } from './context/usePeer'

export default function App() {
    const { peer, status } = usePeer()
    const [messages, setMessages] = useState<IMessage[]>([])
    const [lastConnection, setLastConnection] = useState<DataConnection | undefined>(undefined)
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        if (!peer) {
            return
        }
        peer.on('connection', (connection) => {
            setupConnection(connection) // changed from conn to connection
        })
    }, [peer])

    const handleOnConnect = (peerId: string) => {
        if (!peer) {
            return
        }
        setupConnection(peer.connect(peerId))
    }

    const setupConnection = (connection: DataConnection) => {
        connection.on('open', () => {
            setLastConnection(connection)
            setConnected(true)
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
            setConnected(false)
        })
    }

    const sendMessage = (message: IMessage) => {
        if (!lastConnection) {
            return
        }
        lastConnection.send({ type: 'message', message })
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

    return (
        <div className="fixed flex size-full flex-col">
            <Header connected={connected} onConnect={handleOnConnect} />
            <Messages messages={messages} />
            <Footer connection={lastConnection} onSendMessage={(message) => sendMessage(message)} />
        </div>
    )
}
