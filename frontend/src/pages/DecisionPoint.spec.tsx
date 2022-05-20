import React from 'react';
import { waitFor, render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/testing-react';
import MockSdApolloProvider from 'test/mocks/mockApolloProvider';
import userEvent from '@testing-library/user-event';
import store from 'app/store';
import { RootState } from 'app/store';
import * as stories from './DecisionPoint.stories';

const { Default } = composeStories(stories);

describe('When page loads', () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    await act(async () => {
      render(
        <MockSdApolloProvider mocks={ Default.parameters?.apolloClient.mocks }>
          <Default />
        </MockSdApolloProvider>,
      );
      await waitFor(() => expect(screen.queryByText(/loading animation/i)).toBeInTheDocument());
      jest.advanceTimersByTime(2000);
    });
    await waitFor(() => expect(screen.queryByText(/loading animation/i)).not.toBeInTheDocument());
    jest.useRealTimers();
  });

  it('Should display the last clinical history', async () => {
    await waitFor(
      () => expect(
        (screen.getByRole('textbox', { name: /clinical history/i }) as HTMLTextAreaElement).value,
      ).toMatch(/clinic history 1/i),
    );
  });

  it('Should display the last comorbidities', async () => {
    await waitFor(
      () => expect(
        (screen.getByRole('textbox', { name: /co-morbidities/i }) as HTMLInputElement).value,
      ).toMatch(/comorbidities 1/i),
    );
  });

  it('Should display previous test results', async () => {
    await waitFor(() => {
      Default.parameters?.milestones.forEach((ms) => {
        if (ms.testResult) {
          expect(screen.getAllByRole('cell', {
            name: new RegExp(ms.milestoneType.name, 'i'),
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
    const clinician = Default
      .parameters?.apolloClient.mocks[0]
      .result.data.getPatient.onPathways?.[0].underCareOf;
    await waitFor(() => {
      expect(screen.getByRole('option', { name: new RegExp(`${clinician.firstName} ${clinician.lastName}`, 'i') }));
    });
  });
});
