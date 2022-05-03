/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';
import fetchMock from 'fetch-mock';
import User from 'types/Users';
import { MemoryRouter } from 'react-router';
import AdministrationPage from './Administration';

const user: User = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  department: 'Respiratory',
  defaultPathwayId: '1',
  roles: [],
  token: 'token',
};

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
