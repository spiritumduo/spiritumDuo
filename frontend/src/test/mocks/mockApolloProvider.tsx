import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { cache } from 'app/cache';

interface MockSdApolloProviderProps{
  children: JSX.Element;
  mocks: MockedResponse<Record<string, any>>[] | undefined;
}

const MockSdApolloProvider = ({ children, mocks }: MockSdApolloProviderProps) => {
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

export default MockSdApolloProvider;
