import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User } from '../type/entity';
import { useLazyQuery, useMutation } from '@apollo/client';
import { EXECUTE_LOGIN, GET_USER_CURRENT } from '../gql/user';
import { setCurrentUser } from '../store/redux/reducer';
import { AUTHENTICATION_TOKEN, UNAUTHORIZED_MESSAGE } from '../App.constant';
import { memory } from '../utils';
import { Token } from '../type/auth';
import { LoginDTO } from '../type/dto';

export const useAuth = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [ getCurrentUser ] = useLazyQuery<{ UserCurrent: User }>(GET_USER_CURRENT);
  const [ executeLogin, { loading, error } ] = useMutation<{ login: Token }>(EXECUTE_LOGIN);
  const { currentUser } = useSelector(state => state) as { currentUser: User }

  const goToLogin = () => {
    dispatch(setCurrentUser({ id: undefined, name: undefined, email: undefined }))
    navigate('/login')
  }

  const validate = async () => {
    if (currentUser.id)
      return

    const token = memory.get<Token>(AUTHENTICATION_TOKEN);

    if (!token) {
      goToLogin()
      return
    }

    try {
      const result = await getCurrentUser();

      if (result.error) {
        const [ { message } ] = result.error.graphQLErrors
        if (message === UNAUTHORIZED_MESSAGE)
          return goToLogin();
      }

      dispatch(setCurrentUser(result.data?.UserCurrent!));
    } catch (e) {
      debugger
    }
  }

  const login = async (dto: LoginDTO) => {
    const result = await executeLogin({ variables: { userLogin: dto } })

    if (result.errors)
      throw result.errors;

    memory.set(AUTHENTICATION_TOKEN, result.data?.login)
    navigate('/')
  }

  const logout = () => {
    memory.remove(AUTHENTICATION_TOKEN)
    goToLogin()
  }

  return {
    validate,
    login: {
      loading,
      error,
      execute: login
    },
    logout
  }
}
