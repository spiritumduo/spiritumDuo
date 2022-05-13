/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';

import SearchBar from 'features/SearchBar';
import { MemoryRouter } from 'react-router';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import { PATIENT_SEARCH_QUERY } from 'features/AllPatients/AllPatients';

const patients = [{
  id: '1',
  firstName: 'test',
  lastName: 'test',
  hospitalNumber: 'fMRN1234567',
  nationalNumber: 'fNHS1234567890',
}].flatMap((p) => {
  const returnArray = [];
  for (let i = 0; i < 5; ++i) {
    returnArray.push({
      id: i.toString(),
      firstName: `${p.firstName} ${i}`,
      lastName: `${p.lastName} ${i}`,
      hospitalNumber: `${p.hospitalNumber}-${i}`,
      nationalNumber: `${p.nationalNumber}-${i}`,
    });
  }
  return returnArray;
});

const searchPatientMock = {
  query: PATIENT_SEARCH_QUERY,
  mockFn: () => Promise.resolve({
    data: {
      patientSearch: patients,
    },
  }),
};

export default {
  title: 'features/SearchBar',
  component: SearchBar,
  decorators: [
    (SearchBarStory) => (
      <NewMockSdApolloProvider mocks={ [searchPatientMock] }>
        <MemoryRouter>
          <SearchBarStory />
        </MemoryRouter>
      </NewMockSdApolloProvider>
    ),
  ],
} as Meta<typeof SearchBar>;

const Template: Story = () => <SearchBar />;

export const Default = Template.bind({});
Default.parameters = {
  patientMock: patients,
};
