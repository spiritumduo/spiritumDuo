import React from 'react';

// LIBRARIES
import '@testing-library/jest-dom';
import { render, screen, act, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import userEvent from '@testing-library/user-event';

// LOCAL IMPORTS
import * as stories from './MDTList.stories';

const { Default } = composeStories(stories);

describe('When the page loads', () => {
  it('Should display the loading spinner and then disappear', async () => {
    jest.useFakeTimers();
    render(
      <Default />,
    );
    expect(screen.getByText(/loading.svg/i)).toBeInTheDocument();

    await act(async () => {
      jest.setSystemTime(Date.now() + 10000);
      jest.advanceTimersByTime(1000);
    });
    expect(screen.queryByText(/loading.svg/i)).not.toBeInTheDocument();
  });
});

const renderDefault = async () => {
  jest.useFakeTimers();
  render(
    <Default />,
  );
  expect(screen.getByText(/loading.svg/i)).toBeInTheDocument();

  await act(async () => {
    jest.setSystemTime(Date.now() + 10000);
    jest.advanceTimersByTime(1000);
  });
  expect(screen.queryByText(/loading.svg/i)).not.toBeInTheDocument();
};

const renderEditModalUpdateTab = async () => {
  // setup
  const { click } = userEvent.setup();
  await renderDefault();

  await waitFor(() => {
    expect(screen.queryAllByText(/edit/i).length).toBeGreaterThan(0);
  });

  click(screen.queryAllByText(/edit/i)[0]);

  await waitFor(() => {
    expect(screen.getByRole('tab', { name: /update mdt/i }));
  });

  click(screen.getByRole('tab', { name: /update mdt/i }));

  await waitFor(() => {
    expect(screen.getByText(/update mdt/i)).toHaveAttribute('aria-selected', 'true');
  });
};

const renderEditModalDeleteTab = async () => {
  // setup
  const { click } = userEvent.setup();
  await renderDefault();

  await waitFor(() => {
    expect(screen.queryAllByText(/edit/i).length).toBeGreaterThan(0);
  });

  click(screen.queryAllByText(/edit/i)[0]);

  await waitFor(() => {
    expect(screen.getByRole('tab', { name: /delete mdt/i }));
  });

  click(screen.getByRole('tab', { name: /delete mdt/i }));

  await waitFor(() => {
    expect(screen.getByRole('tab', { name: /delete mdt/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: /delete mdt/i })).toBeInTheDocument();
  });
};

const renderCreateModal = async () => {
  // setup
  const { click } = userEvent.setup();
  await renderDefault();

  click(screen.getByRole('button', { name: /create mdt/i }));

  await waitFor(() => {
    expect(screen.getByLabelText(/date of mdt/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });
};

test('Edit MDT: details should be autofilled when pressing edit', async () => {
  // setup
  await renderEditModalUpdateTab();

  await waitFor(() => {
    expect((screen.getByRole('textbox', { name: /location/i }) as HTMLInputElement).value).toMatch(/test location/i);
    expect((screen.getByRole('textbox', { name: /date/i }) as HTMLInputElement).value).toMatch('02/01/2025');
    expect(screen.getByText(/john1 doe1 \(john.doe1\)/i)).toBeInTheDocument();
  });
});

test('Edit MDT: valid inputs should show success page', async () => {
  // setup
  const { click, keyboard } = userEvent.setup();
  await renderEditModalUpdateTab();

  await waitFor(() => {
    expect((screen.getByRole('textbox', { name: /location/i }) as HTMLInputElement).value).toMatch(/test location/i);
    expect((screen.getByRole('textbox', { name: /date/i }) as HTMLInputElement).value).toMatch('02/01/2025');
    expect(screen.getByText(/john1 doe1 \(john.doe1\)/i)).toBeInTheDocument();
  });

  expect(screen.getByLabelText(/Location/)).toBeInTheDocument();
  click(screen.getByLabelText(/Location/));
  keyboard('new data go brrt');

  click(screen.getByRole('button', { name: /update/i }));

  await waitFor(() => {
    expect(screen.getByText(/success/i));
  });
});

test('Delete MDT: valid inputs should show success page', async () => {
  // setup
  const { click, selectOptions } = userEvent.setup();
  await renderEditModalDeleteTab();

  await waitFor(() => selectOptions(screen.getByLabelText(/select mdt to move patients to/i), ['1']));

  click(screen.getByRole('button', { name: /delete mdt/i }));

  await waitFor(() => {
    expect(screen.getByText(/success/i));
  });
});

test('Create MDT: the date selector should show when clicking input element', async () => {
  await renderCreateModal();

  const { click } = userEvent.setup();
  expect(
    screen.getByLabelText(/date of mdt/i),
  );
  expect(screen.queryByText(/23/)).not.toBeInTheDocument();
  click(screen.getByLabelText(/date of mdt/i));
  await waitFor(() => {
    expect(screen.getByText(/23/));
  });
});

test('Create MDT: not selecting date or inputting location should show errors', async () => {
  await renderCreateModal();

  const { click } = userEvent.setup();
  expect(screen.getByLabelText(/date of mdt/i));
  expect(screen.getByLabelText(/location/i));

  click(screen.getByRole('button', { name: 'Create' }));
  await waitFor(() => {
    expect(screen.getByText(/a date is required/i));
    expect(screen.getByText(/a location is required/i));
  });
});

test('Create MDT: valid inputs should show success page', async () => {
  await renderCreateModal();

  const { click, type } = userEvent.setup();
  expect(
    screen.getByLabelText(/date of mdt/i),
  );
  click(screen.getByLabelText(/date of mdt/i));
  await waitFor(() => {
    expect(screen.getByText(/23/));
  });
  click(screen.getByText(/23/));
  type(screen.getByLabelText(/location/i), 'test location');

  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  click(screen.getByRole('button', { name: 'Create' }));

  await waitFor(() => {
    expect(screen.getByText(/success/i));
  });
});
