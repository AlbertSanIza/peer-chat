import Peer from 'peerjs'
import { createContext, useContext } from 'react'

export const PeerContext = createContext<{ peer: Peer | null; connecting: boolean; connected: boolean; error: Error | null }>({
    peer: null,
    connecting: false,
    connected: false,
    error: null
})

const usePeer = () => useContext(PeerContext)

export default usePeer
