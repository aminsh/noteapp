import { createContext } from 'react'
import { SocketContextProps } from './type'

export const SocketContext = createContext<SocketContextProps>({} as SocketContextProps)