import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($userLogin: LoginDTO!) {
    login(userLogin: $userLogin) {
      access_token
      token_type
    }
  }
`
