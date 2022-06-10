import React from 'react';
import { waitFor, render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/testing-react';
import userEvent from '@testing-library/user-event';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import * as stories from './ContextMenu.stories';
import ContextMenu from './ContextMenu';

const { Default } = composeStories(stories);

async function renderDefault() {
  render(<Default />);
}

describe('When the page loads', () => {
  it('Should display nothing', async () => {
    await renderDefault();
    expect(screen.queryByText(/send feedback/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('Should display a menu when right clicking', async () => {
    await renderDefault();
    fireEvent.contextMenu(document);
    await waitFor(() => {
      expect(screen.queryByRole('menu')).toBeInTheDocument();
    });
  });

  it('Should display the feedback modal with image when button pressed', async () => {
    await renderDefault();
    fireEvent.contextMenu(document);
    await waitFor(() => {
      expect(screen.queryByRole('menu')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Send feedback'));
    await waitFor(() => {
      expect(screen.getByAltText(/screenshot/i)).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /please provide a comment/i })).toBeInTheDocument();
    });
  });

  it('Correct submission of form should result in successful feedback', async () => {
    const screenshotFn = jest.fn().mockReturnValue('test');
    await render(
      <NewMockSdApolloProvider
        mocks={ Default.parameters?.mocks }
      >
        <ContextMenu
          takeScreenshotFn={ screenshotFn }
        />
      </NewMockSdApolloProvider>,
    );
    fireEvent.contextMenu(document);
    await waitFor(() => {
      expect(screen.queryByRole('menu')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Send feedback'));
    await waitFor(() => {
      expect(screen.getByAltText(/screenshot/i)).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /please provide a comment/i })).toBeInTheDocument();
    });
    await userEvent.type(screen.getByLabelText(/please provide a comment explaining your feedback/i), 'test go brrrt');

    await fireEvent.click(screen.getByRole(
      'button',
      { name: 'Submit' },
    ));

    expect(screenshotFn).toBeCalledTimes(1);

    await waitFor(async () => {
      expect(screen.queryByRole('textbox', { name: /please provide a comment/i })).not.toBeInTheDocument();
      expect(screen.getByText(/thank you for your feedback/i)).toBeInTheDocument();
    });
  });
});
