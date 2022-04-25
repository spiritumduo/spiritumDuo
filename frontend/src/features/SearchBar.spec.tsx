/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';

import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';
import userEvent from '@testing-library/user-event';
import * as stories from './SearchBar.stories';

const { Default } = composeStories(stories);

const renderDefault = () => {
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <Default />
    </MockSdApolloProvider>,
  );
};

it('Should render properly', () => {
  renderDefault();
  expect(screen.getByRole('textbox', { name: /^search$/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /^submit\s+search$/i })).toBeInTheDocument();
});
