import { ApolloClient, ApolloLink, createHttpLink, from, InMemoryCache, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { Token } from '../type/auth'
import { AUTHENTICATION_TOKEN } from '../App.constant'
import { memory } from '../utils'
import { onError } from '@apollo/client/link/error'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { WebSocketLink } from '@apollo/client/link/ws'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { getMainDefinition } from '@apollo/client/utilities'

const getToken = () => {
  const token = memory.get<Token>(AUTHENTICATION_TOKEN)
  return token ? `${ token.token_type } ${ token.access_token }` : ''
}

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GQL_BASE_URL
})

const authLink = setContext((_, { headers }) => {

  return {
    headers: {
      ...headers,
      authorization: getToken()
    }
  }
})

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message }) => {
      if (message === 'Unauthorized') {
        memory.remove(AUTHENTICATION_TOKEN)
        /* eslint-disable */
        location.reload()
      }
    })
})

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:6060/graphql',
}))

/*const wsLink = new WebSocketLink(
  new SubscriptionClient('ws://localhost:6060/graphql', {
  }),
);*/

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  ApolloLink.from([authLink, errorLink, httpLink])
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})


