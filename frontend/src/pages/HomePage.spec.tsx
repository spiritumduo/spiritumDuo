/* eslint-disable comma-dangle */
import React from 'react';
import { act, waitFor, render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import * as stories from './HomePage.stories';

const { Default } = composeStories(stories);

test('Renders without error', () => {
  render(
    <MockedProvider>
      <Default />
    </MockedProvider>
  );
});

test('Patient lists should display loading', () => {
  render(
    <MockedProvider>
      <Default />
    </MockedProvider>
  );

  expect(screen.getAllByText('Loading!').length).toEqual(2);
});

test('Patient lists should contain patients', async () => {
  render(
    <MockedProvider mocks={ Default.parameters.apolloClient.mocks }>
      <Default />
    </MockedProvider>
  );
  const { patientsPerPage } = Default.args;
  await waitFor(() => expect(screen.getAllByText('MRN123456', { exact: false }).length).toEqual(2 * patientsPerPage));
});
