import { io, Socket } from 'socket.io-client'
import { TokenResponse } from '../type/dto'
import { memory } from '../utils'
import { AUTHENTICATION_TOKEN } from '../App.constant'

export const configure = (): Socket => {
  const token = memory.get<TokenResponse>(AUTHENTICATION_TOKEN)

  if(!token)
    throw new Error

  const client = io(process.env.REACT_APP_API_BASE_URL as string, {
    auth: {
      token: `${token.token_type} ${token.access_token}`,
    }
  })

  client.on('connect', () => {
    console.log('[SOCKET]', 'connected');
  })

  return client
}