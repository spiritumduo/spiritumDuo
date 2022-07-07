import React from 'react';
import { waitFor, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import * as stories from './DeleteMdtTab.stories';

const { Default, MdtHasRelations } = composeStories(stories);

test('valid inputs should show success page', async () => {
  render(<Default />);

  const { click } = userEvent.setup();

  await click(screen.getByRole('button', { name: /delete/i }));

  await waitFor(() => {
    expect(screen.getByText(/success/i));
  });
});

test('error state displayed properly', async () => {
  render(<MdtHasRelations />);

  const { click } = userEvent.setup();

  await click(screen.getByRole('button', { name: /delete/i }));

  await waitFor(() => {
    expect(screen.getByText(/you cannot delete an mdt with a relation/i));
  });
});
