/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';
import * as stories from './SearchBar.stories';

const { Default } = composeStories(stories);

const renderDefault = async () => {
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <Default />
    </MockSdApolloProvider>,
  );
  await waitFor(() => new Promise((resolve) => setTimeout(resolve, 1)));
};

it('Should render properly', () => {
  renderDefault();
  expect(screen.getByRole('textbox', { name: /^search$/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /^submit\s+search$/i })).toBeInTheDocument();
});
