import { Outlet } from 'react-router-dom'
import { useAuth } from '../../hook/auth.hook'
import { useEffect } from 'react'
import { Layout } from 'antd'
import { useSelector } from 'react-redux'
import { User } from '../../type/entity'
import { NotesMenu } from '../note/NotesMenu';
import { MainMenu } from './MainMenu'

const { Sider, Content, Header } = Layout

export const ProtectedLayout = () => {
  const auth = useAuth();
  const { currentUser } = useSelector(state => state) as { currentUser: User }

  useEffect(() => {
    auth.validate()
  }, [ currentUser ])

  return (
    <Layout className='bg-white'>
      <Header style={{background: 'transparent'}}>
        <MainMenu/>
      </Header>
      <Layout>
        <Content>
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  )
}
