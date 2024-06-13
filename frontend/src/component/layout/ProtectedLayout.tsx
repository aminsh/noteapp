import { Outlet } from 'react-router-dom'
import { useAuth } from '../../hook/auth.hook'
import { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import { Socket } from 'socket.io-client'
import { configure } from '../../config/socket-client'
import { SocketContext } from '../../socket'
import style from './ProtectedLayout.module.scss'
import { menuItems } from '../../config/menuItems'

const {Content, Sider} = Layout

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
        <Sider style={{background: 'transparent'}}>
          <Menu
            style={{ height: '100vh' }}
             mode='inline'
             inlineCollapsed={ false }
             items={menuItems}
          />
        </Sider>
        <Layout className={style.mainLayout}>
          <Content>
            <Outlet/>
          </Content>
        </Layout>
      </Layout>
    </SocketContext.Provider>
  )
}
