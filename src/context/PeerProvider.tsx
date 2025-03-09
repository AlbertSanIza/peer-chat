import Peer from 'peerjs'
import { ReactNode, useEffect, useState } from 'react'

import { PeerContext } from './usePeer'

export function PeerProvider({ children, peerId }: { children: ReactNode; peerId: string }) {
    const [peer, setPeer] = useState<Peer | null>(null)
    const [status, setStatus] = useState<{ loading: boolean; online: boolean; error: Error | null }>({ loading: false, online: false, error: null })

    useEffect(() => {
        if (!peerId) {
            return
        }
        setStatus((prevStatus) => ({ ...prevStatus, loading: true, error: null }))

        const peerConfig = {
            config: {
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }, { urls: 'stun:stun2.l.google.com:19302' }]
            }
        }

        let newPeer = new Peer(peerId, peerConfig)
        newPeer.on('open', () => {
            setStatus((prevStatus) => ({ ...prevStatus, loading: false, online: true }))
            setPeer(newPeer)
        })
        newPeer.on('error', (error) => {
            if (error.type === 'unavailable-id') {
                newPeer.destroy()
                newPeer = new Peer()
                newPeer.on('open', () => {
                    setStatus((prevStatus) => ({ ...prevStatus, loading: false, online: true }))
                    setPeer(newPeer)
                })
                newPeer.on('error', (newError) => {
                    setStatus((prevStatus) => ({ ...prevStatus, loading: false, error: newError }))
                })
            } else {
                setStatus((prevStatus) => ({ ...prevStatus, loading: false, error }))
            }
        })
        newPeer.on('disconnected', () => {
            setStatus((prevStatus) => ({ ...prevStatus, online: false }))
        })
        newPeer.on('close', () => {
            setStatus((prevStatus) => ({ ...prevStatus, online: false }))
            setPeer(null)
        })

        return () => {
            newPeer.destroy()
        }
    }, [peerId])

    return <PeerContext.Provider value={{ peer, status }}>{children}</PeerContext.Provider>
}
