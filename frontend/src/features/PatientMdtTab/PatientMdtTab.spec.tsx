import React from 'react';
import { waitFor, render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import * as stories from './PatientMdtTab.stories';

const { Default, RecordLocked } = composeStories(stories);

async function renderDefault() {
  jest.useFakeTimers();
  render(
    <Default />,
  );
  await waitFor(() => new Promise((resolve) => setTimeout(resolve, 0)));
  await waitFor(() => expect(screen.getByText(/loading.svg/i)).toBeInTheDocument());

  await act(async () => {
    jest.setSystemTime(Date.now() + 10000);
    jest.advanceTimersByTime(1000);
  });
  expect(screen.queryByText(/loading.svg/i)).not.toBeInTheDocument();
}

async function renderLocked() {
  jest.useFakeTimers();
  render(
    <RecordLocked />,
  );
  await waitFor(() => new Promise((resolve) => setTimeout(resolve, 0)));
  await act(async () => {
    expect(screen.getByText(/loading.svg/i)).toBeInTheDocument();
  });

  await act(async () => {
    jest.setSystemTime(Date.now() + 10000);
    jest.advanceTimersByTime(1000);
  });
  expect(screen.queryByText(/loading.svg/i)).not.toBeInTheDocument();
}

test('on load it autofills information as read-only', async () => {
  await renderDefault();

  await waitFor(() => {
    expect((screen.getByText(/test user/i))).toBeInTheDocument();
    expect((screen.getByText(/review reason goes here/i))).toBeInTheDocument();
    expect((screen.getByText(/outcomes goes here/i))).toBeInTheDocument();
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBeTruthy();

    expect(screen.queryAllByRole(/textbox/i).length).toEqual(0);
  });
});

test('when pressing edit button text fields become text areasd', async () => {
  await renderDefault();
  const { click } = userEvent.setup();

  await waitFor(() => {
    expect(screen.getByText(/edit/i)).toBeInTheDocument();
  });

  click(screen.getByText(/edit/i));

  await waitFor(() => {
    expect(screen.queryAllByRole(/textbox/i).length).toEqual(2);
  });
});

test('when pressing save after edit, the fields go back to read-only', async () => {
  await renderDefault();
  const { click, type } = userEvent.setup();

  await act(async () => {
    click(screen.getByText(/edit/i));
  });

  expect((await screen.findAllByRole('textbox')).length).toEqual(2);

  await act(async () => {
    screen.getAllByRole(/textbox/i).forEach((element) => {
      type(element, 'new data');
    });
  });

  click(screen.getByText(/save/i));

  await waitFor(() => expect(screen.queryAllByRole(/textbox/i).length).toEqual(0));
  await waitFor(() => expect((screen.getByRole('checkbox') as HTMLInputElement).disabled).toBeTruthy());
});

test('locked error presented when attempted to edit locked record', async () => {
  await renderLocked();
  const { click } = userEvent.setup();

  click(screen.getByText(/edit/i));

  await waitFor(() => {
    expect(screen.getByText(/locked by someone else/i)).toBeInTheDocument();
  });
});
