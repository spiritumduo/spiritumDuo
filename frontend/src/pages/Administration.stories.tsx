/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import AdministrationPage from './Administration';

export default {
  title: 'Pages/Administration',
  component: AdministrationPage,
  decorators: [
    (AdministrationPageStory) => (
      <MemoryRouter>
        <AdministrationPageStory />
      </MemoryRouter>
    ),
  ],
} as Meta<typeof AdministrationPage>;
