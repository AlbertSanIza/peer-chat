import Peer from 'peerjs'
import { createContext, useContext } from 'react'

export const PeerContext = createContext<{ peer: Peer | null; status: { loading: boolean; online: boolean; error: Error | null } }>({
    peer: null,
    status: {
        loading: false,
        online: false,
        error: null
    }
})

export const usePeer = () => useContext(PeerContext)
