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

export const GET_USERS_SEARCH = gql`
    query GetUsersSearch($term: String!, $take: Int!) {
        UsersSearch(term: $term, take: $take) {
            id
            name
            email
        }
    }
`

export const GET_USERS_BY_IDS = gql`
    query GetUsersById($ids: [String!]!) {
        UsersFindById(ids: $ids) {
            id
            name
            email
        }
    }
`
