import { Outlet } from 'react-router-dom'

export const PublicLayout = () => {
  return (
    <div className='p-5'>
      <Outlet/>
    </div>
  )
}