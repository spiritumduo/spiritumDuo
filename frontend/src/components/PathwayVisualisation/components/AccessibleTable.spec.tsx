import React from 'react';
import { composeStories } from '@storybook/testing-react';
import { render, screen, within } from '@testing-library/react';
import * as stories from './AccessibleTable.stories';

const { Default } = composeStories(stories);

const renderDefault = () => render(<Default />);

test('It should render', () => {
  renderDefault();
  expect(screen.getByRole('table', { name: /pathway\s+table/i })).toBeInTheDocument();
});

test('It should display the correct number of columns', () => {
  renderDefault();
  expect(screen.getAllByRole('columnheader').length).toBe(8);
});

test('It should display all the column headers', () => {
  renderDefault();
  expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /hospital\s+number/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /date\s+of\s+birth/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /periods/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /period\s+type/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /duration/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /outstanding\s+requests/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /awaiting\s+results/i })).toBeInTheDocument();
});

test('It should display the correct number of rows', () => {
  renderDefault();
  expect(screen.getAllByRole('row').length).toBe(14);
});

test('It should display the correct nubmer of row headers', () => {
  renderDefault();
  expect(screen.getAllByRole('rowheader').length).toBe(2);
});
