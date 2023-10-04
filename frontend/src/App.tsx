import React from 'react';
import { AppRoutes } from './component/AppRoutes';
import { Provider } from 'react-redux';
import { store } from './store';
import { ApolloProvider } from '@apollo/client';
import { client } from './config/apollo-client';

function App() {
  return (
    <ApolloProvider client={ client }>
      <Provider store={ store }>
        <AppRoutes/>
      </Provider>
    </ApolloProvider>
  )
}

export default App;
