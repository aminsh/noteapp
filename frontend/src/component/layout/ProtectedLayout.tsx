import { Outlet } from 'react-router-dom'
import { useAuth } from '../../hook/auth.hook'
import { useEffect, useState } from 'react'
import { Layout } from 'antd'
import { MainMenu } from './MainMenu'
import { Socket } from 'socket.io-client'
import { configure } from '../../config/socket-client'
import { SocketContext } from '../../socket'
import style from './ProtectedLayout.module.scss'

const {Content, Header} = Layout

export const ProtectedLayout = () => {
  const auth = useAuth()
  const [socket, setSocket] = useState<Socket>()

  const startSocket = async () => {
    const client = configure()
    setSocket(client)
  }

  useEffect(() => {
    auth.validate()
    startSocket()

    return () => {
      socket?.close()
    }
  }, [])

  return (
    <SocketContext.Provider value={{socket}}>
      <Layout className='bg-white'>
        <Header style={{background: 'transparent'}}>
          <MainMenu/>
        </Header>
        <Layout className={style.mainLayout}>
          <Content>
            <Outlet/>
          </Content>
        </Layout>
      </Layout>
    </SocketContext.Provider>
  )
}
