/* eslint-disable comma-dangle */
import React from 'react';
import { act, waitFor, render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event'
import * as stories from './NewPatient.stories';

const { Standard } = composeStories(stories);

const doRenderStandard = () => render(<MockedProvider><Standard /></MockedProvider>);

test('Renders without error', () => {
  doRenderStandard();
});

test('Should have first name input', () => {
  doRenderStandard();
  expect(screen.getByRole('textbox', { name: 'First name' })).toBeInTheDocument();
});

test('Should have last name input', () => {
  doRenderStandard();
  expect(screen.getByRole('textbox', { name: 'Last name' })).toBeInTheDocument();
});

test('Should have Hospital Number input', () => {
  doRenderStandard();
  expect(screen.getByRole('textbox', { name: 'Hospital number' })).toBeInTheDocument();
});

test('Should have date of birth input', () => {
  doRenderStandard();
  expect(screen.getByLabelText('Date of birth')).toBeInTheDocument();
});

test('Should have communication methods input', () => {
  doRenderStandard();
  expect(screen.getByRole('Communication Method')).toBeInTheDocument();
});

/*
// This should probably all be wired up with a new Story in Storybook with the form in various
// states of being filled in w/appropriate assertions.
test('Form should submit correctly', () => {
  doRenderStandard();
  userEvent.click(screen.getByText('Register patient'));
});
*/
