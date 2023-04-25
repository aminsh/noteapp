import { gql } from '@apollo/client';

export const EXECUTE_LOGIN = gql`
  mutation Login($userLogin: LoginDTO!) {
    login(userLogin: $userLogin) {
      access_token
      token_type
    }
  }
`

export const EXECUTE_REGISTER = gql`
  mutation ExecuteRegister($userRegister: RegisterDTO!) {
    register(userRegister: $userRegister) {
      id
    }
  }
`

export const GET_USER_CURRENT = gql`
  query GetUserCurrent {
    UserCurrent {
      id
      name
      email
    }
  }
`
