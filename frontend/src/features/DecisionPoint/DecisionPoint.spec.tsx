import React from 'react';
import { waitFor, render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/testing-react';
import * as stories from './DecisionPoint.stories';

const { Default } = composeStories(stories);

async function renderDefault() {
  jest.useFakeTimers();
  await act(() => {
    render(<Default />);
  });
  act(() => {
    jest.setSystemTime(Date.now() + 10000);
    jest.advanceTimersByTime(500);
  });
  jest.useRealTimers();
}

describe('When page loads', () => {
  it('Should display loading while waiting for data', async () => {
    await act(async () => {
      render(
        <Default />,
      );
    });
    expect(screen.getByText(/loading.svg/i)).toBeInTheDocument();
  });
  it('Should display the last clinical history', async () => {
    await renderDefault();
    expect(
      (screen.getByRole('textbox', { name: /clinical history/i }) as HTMLTextAreaElement).value,
    ).toMatch(/clinic history 1/i);
  });

  it('Should display the last comorbidities', async () => {
    await renderDefault();

    await waitFor(
      () => expect(
        (screen.getByRole('textbox', { name: /co-morbidities/i }) as HTMLInputElement).value,
      ).toMatch(/comorbidities 1/i),
    );
  });

  it('Should display previous test results', async () => {
    await renderDefault();

    await waitFor(() => {
      Default.parameters?.clinicalRequests.forEach((ms: any) => {
        if (ms.testResult) {
          expect(screen.getAllByRole('cell', {
            name: new RegExp(ms.clinicalRequestType.name, 'i'),
          }).length).toBeGreaterThan(0);
          expect(screen.getByRole('cell', {
            name: new RegExp(ms.testResult.description.slice(0, 75), 'i'),
          })).toBeVisible();
        }
      });
    });
  });

  /* disable this test for now, but note it needs to get done
  it('Should open test results when clicked', () => {
    // This probably requires visual regression testing, because getting computed CSS
    // in jest-dom is hard
    expect(false).toBeTruthy();
  });
  */
  it('Should show clinician under care of', async () => {
    await renderDefault();

    const clinician = Default.parameters?.clinician;
    await waitFor(() => {
      expect(screen.getByRole('option', { name: new RegExp(`${clinician.firstName} ${clinician.lastName}`, 'i') }));
    });
  });
});
