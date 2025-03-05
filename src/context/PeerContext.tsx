import Peer from 'peerjs'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface PeerContextType {
    peer: Peer | null
    connecting: boolean
    connected: boolean
    error: Error | null
}

const PeerContext = createContext<PeerContextType>({
    peer: null,
    connecting: false,
    connected: false,
    error: null
})

export const usePeer = () => useContext(PeerContext)

interface PeerProviderProps {
    children: ReactNode
    peerId?: string
}

export const PeerProvider: React.FC<PeerProviderProps> = ({ children, peerId }) => {
    const [peer, setPeer] = useState<Peer | null>(null)
    const [connecting, setConnecting] = useState(false)
    const [connected, setConnected] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (!peerId) return

        setConnecting(true)
        setError(null)

        const newPeer = new Peer(peerId)

        newPeer.on('open', () => {
            console.log('Peer connection established')
            setConnecting(false)
            setConnected(true)
            setPeer(newPeer)
        })

        newPeer.on('error', (err) => {
            console.error('Peer connection error:', err)
            setConnecting(false)
            setError(err)
        })

        newPeer.on('disconnected', () => {
            console.log('Peer disconnected')
            setConnected(false)
        })

        newPeer.on('close', () => {
            console.log('Peer connection closed')
            setConnected(false)
            setPeer(null)
        })

        return () => {
            newPeer.destroy()
        }
    }, [peerId])

    return <PeerContext.Provider value={{ peer, connecting, connected, error }}>{children}</PeerContext.Provider>
}
