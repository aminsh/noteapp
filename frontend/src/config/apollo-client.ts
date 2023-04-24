import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: process.env.REACT_APP_GQL_BASE_URL,
  cache: new InMemoryCache()
});
