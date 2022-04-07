import React, { ReactNode, useContext } from 'react';

// LIBRARIES
import { split, HttpLink, ApolloClient, from, ServerError, ApolloProvider } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';

// APP
import { cache, loggedInUserVar } from 'app/cache';
import scalarLink from 'app/scalars';
import { AuthContext } from 'app/context';

interface SdApolloProviderProps {
  children: ReactNode;
}

const SdApolloProvider = ({ children }: SdApolloProviderProps): JSX.Element => {
  const { user } = useContext(AuthContext);

  if (!user) return <>{children}</>;

  const httpLink = new HttpLink({
    uri: `${window.location.protocol}//${window.location.host}/api/graphql`,
    credentials: 'include',
  });

  const wsUrl = window.location.host === 'localhost'
    ? 'ws://localhost/api/subscription'
    : `wss://${window.location.host}/api/subscription`;

  const wsLink = new WebSocketLink(
    new SubscriptionClient(
      wsUrl,
      {
        reconnect: true,
        connectionParams: {
          token: user?.token,
        },
      },
    ),
  );

  // The split function takes three parameters:
  //
  // * A function that's called for each operation to execute
  // * The Link to use for an operation if the function returns a "truthy" value
  // * The Link to use for an operation if the function returns a "falsy" value
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition'
        && definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

  const errorLink = onError(({ graphQLErrors, networkError, forward, operation }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
      });
    }

    if (networkError) {
      const e = networkError as ServerError;
      console.log(`[Network error]: ${e?.response?.status}`);
      if (e?.response?.status === 401) {
        loggedInUserVar(null);
        window.location.reload();
      }
    }
    return forward(operation);
  });

  const client = new ApolloClient({
    link: from([scalarLink, errorLink, splitLink]),
    cache: cache,
    connectToDevTools: true,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  });

  return (
    <ApolloProvider client={ client }>
      {children}
    </ApolloProvider>
  );
};

export default SdApolloProvider;
