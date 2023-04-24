import { useDispatch, useSelector } from 'react-redux';
import { User } from '../../type/entity';
import { setCurrentUser } from '../../store/redux/reducer';

export const ProtectedLayout = () => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector(state => state) as { currentUser: User }

  const setUser = (e: any) => dispatch(setCurrentUser({ name: e.target.value } as User));
  return (
    <></>
  )
}
