import { Outlet } from 'react-router-dom'
import { useAuth } from '../../hook/auth.hook'
import { useEffect } from 'react'
import { Layout } from 'antd'
import { useSelector } from 'react-redux'
import { User } from '../../type/entity'
import { NotesMenu } from '../note/NotesMenu';

const { Sider, Content } = Layout

export const ProtectedLayout = () => {
  const auth = useAuth();
  const { currentUser } = useSelector(state => state) as { currentUser: User }

  useEffect(() => {
    auth.validate()
  }, [ currentUser ])

  return (
    <Layout className='bg-white'>
      <Sider width={ 250 } className='bg-white'>
        <NotesMenu/>
      </Sider>
      <Layout>
        <div>

        </div>
        <Content>
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  )
}
