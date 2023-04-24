import { Outlet } from 'react-router-dom'
import styles from './AuthLayout.module.scss'

export const AuthLayout = () => {
  return (
    <div className={ styles.authContainer }>
      <div className={ styles.authMain }>
        <Outlet/>
      </div>
    </div>
  )
}
