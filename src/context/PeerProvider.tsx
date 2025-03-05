import Peer from 'peerjs'
import { ReactNode, useEffect, useState } from 'react'

import { PeerContext } from './usePeer'

export const PeerProvider: React.FC<{ children: ReactNode; peerId?: string }> = ({ children, peerId }) => {
    const [peer, setPeer] = useState<Peer | null>(null)
    const [connecting, setConnecting] = useState(false)
    const [connected, setConnected] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (!peerId) {
            return
        }

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
