import { HttpLink, ApolloClient, from, ServerError } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { cache } from 'app/cache';
import Cookies from 'js-cookie';
import scalarLink from 'app/scalars';

const link = new HttpLink({
  uri: `${window.location.protocol}//${window.location.host}/api/graphql`,
  credentials: 'include',
});

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
      Cookies.remove('SDSESSION');
      window.location.reload();
    }
  }

  return forward(operation);
});

const client = new ApolloClient({
  link: from([scalarLink, errorLink, link]),
  cache: cache,
  connectToDevTools: true,
});

export default client;
