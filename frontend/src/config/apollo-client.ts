import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Token } from '../type/auth';
import { AUTHENTICATION_TOKEN } from '../App.constant';
import { memory } from '../utils';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GQL_BASE_URL
});

const authLink = setContext((_, { headers }) => {
  const token = memory.get<Token>(AUTHENTICATION_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `${ token.token_type } ${ token.access_token }` : "",
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  }
});
