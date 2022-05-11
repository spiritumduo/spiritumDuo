/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import * as stories from './AdminUser.stories';

const { Default } = composeStories(stories);

// DEFAULT TESTS
const renderDefault = async () => {
  render(
    <NewMockSdApolloProvider mocks={ Default.parameters?.apolloMocks }>
      <Default />
    </NewMockSdApolloProvider>,
  );
  await waitFor(() => new Promise((resolve) => setTimeout(resolve, 1)));
};

it('Should render the component', async () => {
  await renderDefault();
  expect(screen.getByText(/all/i)).toBeInTheDocument();
  expect(screen.getByText(/create\s+user/i)).toBeInTheDocument();
});

it('Should change tabs when clicked', async () => {
  await renderDefault();
  const { click } = userEvent.setup();
  await waitFor(() => click(screen.getByText(/create\s+user/i)));
  expect(screen.getByRole('textbox', { name: /first\s+name/i })).toBeInTheDocument();
  await waitFor(() => click(screen.getByText(/all/i)));
  expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
});
