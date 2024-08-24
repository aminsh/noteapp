import { Outlet } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import style from './ProtectedLayout.module.scss'
import { menuItems } from '../../config/menuItems'

const {Content, Sider} = Layout

export const ProtectedLayout = () => {
  return (
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
  )
}
