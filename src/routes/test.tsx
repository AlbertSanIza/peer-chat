import { createFileRoute } from '@tanstack/react-router'
import Peer from 'peerjs'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/test')({ component: RouteComponent })

function RouteComponent() {
    const [peerId, setPeerId] = useState('')
    const [connectedPeerId, setConnectedPeerId] = useState('')
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const peerInstance = useRef(null)
    const connRef = useRef(null)

    const { id } = Route.useParams()

    useEffect(() => {
        // Initialize PeerJS
        const peer = new Peer()

        peer.on('open', (id) => {
            console.log('My peer ID is:', id)
            setPeerId(id)
        })

        // Handle incoming connections
        peer.on('connection', (conn) => {
            console.log('🚀 ~ peer.on ~ conn:', conn)
            connRef.current = conn

            conn.on('data', (data) => {
                console.log('Received:', data)
                setMessages((prev) => [...prev, { sender: 'peer', text: data }])
            })

            conn.on('close', () => {
                console.log('Connection closed')
                connRef.current = null
            })
        })

        peerInstance.current = peer

        return () => {
            peer.disconnect()
        }
    }, [])

    const connectToPeer = () => {
        if (!connectedPeerId) return

        const conn = peerInstance.current.connect(connectedPeerId)

        conn.on('open', () => {
            console.log('Connected to:', connectedPeerId)
            connRef.current = conn
        })

        conn.on('data', (data) => {
            console.log('Received:', data)
            setMessages((prev) => [...prev, { sender: 'peer', text: data }])
        })

        conn.on('close', () => {
            console.log('Connection closed')
            connRef.current = null
        })
    }

    const sendMessage = () => {
        if (connRef.current && message.trim() !== '') {
            connRef.current.send(message)
            setMessages((prev) => [...prev, { sender: 'me', text: message }])
            setMessage('')
        }
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>PeerJS Chat App</h1>
            <p>Your Peer ID: {peerId}</p>

            <div>
                <input type="text" placeholder="Enter peer ID to connect" value={connectedPeerId} onChange={(e) => setConnectedPeerId(e.target.value)} />
                <button onClick={connectToPeer}>Connect</button>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h2>Chat</h2>
                <div
                    style={{
                        border: '1px solid #ccc',
                        padding: '10px',
                        height: '200px',
                        overflowY: 'scroll'
                    }}
                >
                    {messages.map((msg, index) => (
                        <p key={index} style={{ textAlign: msg.sender === 'me' ? 'right' : 'left' }}>
                            <strong>{msg.sender}:</strong> {msg.text}
                        </p>
                    ))}
                </div>
                <div style={{ marginTop: '10px' }}>
                    <input type="text" placeholder="Type a message" value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    )
}
