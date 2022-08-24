import React from 'react';
import { waitFor, render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/testing-react';
import MDT from 'types/MDT';
import * as stories from './DeleteMdtForm.stories';

const { MdtWithNoPatients, MdtWithPatients, MdtHasUserErrors } = composeStories(stories);

describe('The MDT does not have OnMDT/patient records', () => {
  async function renderPage() {
    render(<MdtWithNoPatients />);
  }

  it('Should show a notice no patients are on the MDT', async () => {
    await renderPage();
    expect(screen.getByText(/there are no patients on this mdt/i)).toBeInTheDocument();
  });

  it('Should show success when the form is submitted', async () => {
    await renderPage();
    const { click } = userEvent.setup();
    await click(screen.getByRole('button', { name: /delete mdt/i }));

    await waitFor(() => {
      expect(screen.getByText(/success/i));
    });
  });
});

describe('The MDT has OnMdt/patient records', () => {
  async function renderPage() {
    render(<MdtWithPatients />);
  }

  it('Should show a list of patients on the MDT', async () => {
    await renderPage();
    MdtWithPatients.parameters?.mdt.patients.forEach(
      (pt: {firstName: string; lastName: string; hospitalNumber: string;}) => {
        expect(screen.getByText(`${pt.firstName} ${pt.lastName} (${pt.hospitalNumber})`)).toBeInTheDocument();
      },
    );
  });

  it('Should show a dropdown with a list of other MDTs', async () => {
    await renderPage();
    const mdtSelectorOptions = Array.from(
      (screen.getByRole(
        'combobox',
        { name: /select mdt to move patients to/i },
      ) as HTMLSelectElement).options,
    );
    const mdtDateList = MdtWithPatients.parameters?.listOfMdts;

    mdtDateList.forEach((mdt: MDT) => {
      expect(
        mdtSelectorOptions.find((option) => option.value === mdt.id),
      );
    });
  });
});

describe('If the server is in an error state', () => {
  async function renderPage() {
    render(<MdtHasUserErrors />);
  }

  it('should show the error when the form is submitted', async () => {
    await renderPage();
    const { click } = userEvent.setup();
    await click(screen.getByRole('button', { name: /delete mdt/i }));

    await waitFor(() => {
      expect(screen.getByText(/an error has occured/i));
    });
  });

  it('Should show success when the form is submitted', async () => {
    await renderPage();
    const { click } = userEvent.setup();
    await click(screen.getByRole('button', { name: /delete mdt/i }));

    await waitFor(() => {
      expect(screen.getByText(/an error has occured/i));
    });
  });
});
