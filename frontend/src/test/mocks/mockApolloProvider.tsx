/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { ApolloProvider, DocumentNode } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { createMockClient, RequestHandler } from 'mock-apollo-client';
import { cache } from 'app/cache';

interface MockSdApolloProviderProps{
  children: JSX.Element;
  mocks: MockedResponse<Record<string, any>>[] | undefined;
}

const MockSdApolloProvider = ({ children, mocks }: MockSdApolloProviderProps): JSX.Element => {
  cache.reset();
  return (
    <MockedProvider
      mocks={ mocks }
      cache={ cache }
    >
      { children }
    </MockedProvider>
  );
};

interface NewMockSdApolloProviderProps{
  children: JSX.Element;
  mocks: {
    query: DocumentNode;
    mockFn: RequestHandler<any, any>;
  }[];
}

export const NewMockSdApolloProvider = (
  { children, mocks }: NewMockSdApolloProviderProps,
): JSX.Element => {
  cache.reset();
  const client = createMockClient();
  mocks.forEach((m) => client.setRequestHandler(m.query, m.mockFn));
  return (
    <ApolloProvider client={ client }>
      { children }
    </ApolloProvider>
  );
};

export default MockSdApolloProvider;
