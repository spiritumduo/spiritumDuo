/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import PageLayout, { PageLayoutProps } from 'components/PageLayout';
import PathwayOption from 'types/PathwayOption';
import { MemoryRouter } from 'react-router-dom';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';

const pathways: PathwayOption[] = [
  {
    id: 0,
    name: 'Lung Cancer',
  },
  {
    id: 1,
    name: 'Bronchieactasis',
  },
];

export default {
  title: 'Components/Page Layout',
  component: PageLayout,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <MockAuthProvider>
          <MockPathwayProvider>
            <Story />
          </MockPathwayProvider>
        </MockAuthProvider>
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof PageLayout>;

// eslint-disable-next-line max-len
const Template: ComponentStory<typeof PageLayout> = (args: PageLayoutProps) => <PageLayout { ...args } />;

export const DefaultLayout = Template.bind({});
DefaultLayout.args = {
  headerProps: {
    pathwayOptions: pathways,
    currentPathwayId: pathways[0].id,
    pathwayOnItemSelect: (name: string) => console.log(name),
    searchOnSubmit: (e: React.FormEvent<EventTarget>) => {
      e.preventDefault();
    },
  },
};
