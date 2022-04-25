/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';

import SearchResults, { SearchResultProps } from './SearchResults';

export default {
  title: 'features/SearchBar/SearchResults',
  component: SearchResults,
  decorators: [
    (SearchResultsStory) => (
      <MemoryRouter>
        <SearchResultsStory />
      </MemoryRouter>
    ),
  ],
  argTypes: {
    onClickCallback: { action: 'clicked' },
  },
} as ComponentMeta<typeof SearchResults>;

const Template: ComponentStory<typeof SearchResults> = (
  props: SearchResultProps,
) => <SearchResults { ...props } />;

const result = {
  id: '1',
  firstName: 'test-firstname',
  lastName: 'test-lastname',
  hospitalNumber: 'fMRN123456',
  nationalNumber: 'fNHS12345678',
};

const resultsList: SearchResultProps['results'] = [];

for (let i = 0; i < 10; ++i) {
  resultsList.push({
    id: `${result.id}${i}`,
    firstName: `${result.firstName}${i}`,
    lastName: `${result.lastName}${i}`,
    hospitalNumber: `${result.hospitalNumber}${i}`,
    nationalNumber: `${result.nationalNumber}${i}`,
  });
}

export const Default = Template.bind({});
Default.args = {
  results: resultsList,
};
