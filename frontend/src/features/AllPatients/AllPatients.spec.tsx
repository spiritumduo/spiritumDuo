/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';

import * as stories from './AllPatients.stories';

const { Default, Search } = composeStories(stories);

it('Should render all patients list by default', async () => {
  render(
    <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
      <Default />
    </MockSdApolloProvider>,
  );

  await waitFor(
    () => expect(
      screen.getAllByRole('row').length,
    ).toEqual(11), // all patients plus header
  );
});

it('Should show the results when a search query exists', async () => {
  render(<Search />);
  await waitFor(
    () => expect(
      screen.getAllByRole('row').length,
    ).toEqual(2), // all patients plus header
  );
});
