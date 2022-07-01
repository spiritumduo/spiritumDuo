import React from 'react';
import { composeStories } from '@storybook/testing-react';
import { render } from '@testing-library/react';
import * as stories from './PathwayVisualisation.stories';

const {
  Default,
  Medium,
  Small,
  WithNationalNumber,
  MediumWithNationalNumber,
  SmallWithNationalNumber
} = composeStories(stories);

it('It should render Default correctly', () => {
  const { container } = render(<Default />);
  expect(container).toMatchSnapshot();
});

it('It should render Medium correctly', () => {
  const { container } = render(<Medium />);
  expect(container).toMatchSnapshot();
});

it('It should render Small correctly', () => {
  const { container } = render(<Small />);
  expect(container).toMatchSnapshot();
});

it('It should render WithNationalNumber correctly', () => {
  const { container } = render(<WithNationalNumber />);
  expect(container).toMatchSnapshot();
});

it('It should render MediumWithNationalNumber correctly', () => {
  const { container } = render(<MediumWithNationalNumber />);
  expect(container).toMatchSnapshot();
});

it('It should render SmallWithNationalNumber correctly', () => {
  const { container } = render(<SmallWithNationalNumber />);
  expect(container).toMatchSnapshot();
});
