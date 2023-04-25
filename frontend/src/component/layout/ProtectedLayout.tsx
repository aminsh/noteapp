import { useAuth } from '../../hook/auth.hook';
import { useEffect } from 'react';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { User } from '../../type/entity';

export const ProtectedLayout = () => {
  const auth = useAuth();
  const { currentUser } = useSelector(state => state) as { currentUser: User }

  useEffect(() => {
    auth.validate()
  }, [ currentUser ])

  return (
    <>
      Protected

      <h1>{ currentUser.name }</h1>

      <Button onClick={ auth.logout }>
        Logout
      </Button>
    </>
  )
}
