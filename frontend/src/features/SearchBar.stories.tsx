/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';

import SearchBar, { PATIENT_SEARCH_QUERY } from 'features/SearchBar';

export default {
  title: 'features/SearchBar',
  component: SearchBar,
} as Meta<typeof SearchBar>;

const Template: Story = () => <SearchBar />;

export const Default = Template.bind({});

export const WithResults = Template.bind({});
WithResults.parameters = {
  apolloClient: {
    mocks: [
      {
        request: {
          query: PATIENT_SEARCH_QUERY,
          variables: {
            query: 'test',
          },
        },
        result: {
          data: {
            patientSearch: [
              {
                id: '1',
                firstName: 'test 1',
                lastName: 'test 1',
                hospitalNumber: 'fMRN1234567',
                nationalNumber: 'fNHS1234567890',
              },
              {
                id: '2',
                firstName: 'test 2',
                lastName: 'test 2',
                hospitalNumber: 'fMRN1234567',
                nationalNumber: 'fNHS1234567890',
              },
              {
                id: '3',
                firstName: 'test 3',
                lastName: 'test 3',
                hospitalNumber: 'fMRN1234567',
                nationalNumber: 'fNHS1234567890',
              },
              {
                id: '4',
                firstName: 'test 3',
                lastName: 'test 3',
                hospitalNumber: 'fMRN1234567',
                nationalNumber: 'fNHS1234567890',
              },
            ],
          },
        },
      },
    ],
  },
};
