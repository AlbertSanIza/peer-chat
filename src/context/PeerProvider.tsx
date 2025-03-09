import Peer from 'peerjs'
import { ReactNode, useEffect, useState } from 'react'

import { PeerContext } from './usePeer'

export function PeerProvider({ children }: { children: ReactNode }) {
    const [peer, setPeer] = useState<Peer | null>(null)
    const [status, setStatus] = useState<{ loading: boolean; online: boolean; error: Error | null }>({ loading: false, online: false, error: null })

    useEffect(() => {
        setStatus((prevStatus) => ({ ...prevStatus, loading: true, error: null }))
        const newPeer = new Peer()
        newPeer.on('open', () => {
            setStatus((prevStatus) => ({ ...prevStatus, loading: false, online: true }))
            setPeer(newPeer)
        })
        newPeer.on('error', (error) => {
            setStatus((prevStatus) => ({ ...prevStatus, loading: false, error }))
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
    }, [])

    return <PeerContext.Provider value={{ peer, status }}>{children}</PeerContext.Provider>
}
