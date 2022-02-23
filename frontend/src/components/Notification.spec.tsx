import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';
import * as stories from './Notification.stories';

const { Standard, Error } = composeStories(stories);

it('Should show the notification when the subscription returns data', async () => {
  render(
    <MockSdApolloProvider mocks={ Standard.parameters?.apolloClient.mocks }>
      <Standard />
    </MockSdApolloProvider>,
  );
  waitFor(() => expect(screen.getByText(/test result returned/i)).toBeInTheDocument());
});

it('Should display the error when the subscription returns an error', async () => {
  render(
    <MockSdApolloProvider mocks={ Error.parameters?.apolloClient.mocks }>
      <Error />
    </MockSdApolloProvider>,
  );
  waitFor(() => expect(screen.getByText(/error!/i)).toBeInTheDocument());
});
