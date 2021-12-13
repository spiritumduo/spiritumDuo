/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import PageLayout, { PageLayoutProps } from 'components/PageLayout';
import { actions } from '@storybook/addon-actions';
import PathwayOption from 'types/PathwayOption';
import { MemoryRouter } from 'react-router-dom';

export default {
  title: 'Components/Page Layout',
  component: PageLayout,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof PageLayout>;

// eslint-disable-next-line max-len
const Template: ComponentStory<typeof PageLayout> = (args: PageLayoutProps) => <PageLayout { ...args } />;

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

export const DefaultLayout = Template.bind({});
DefaultLayout.args = {
  headerProps: {
    pathwayOptions: pathways,
    currentPathwayId: pathways[0].id,
    pathwayOnItemSelect: (name: string) => console.log(name),
    searchOnSubmit: (e: React.FormEvent<EventTarget>) => {
      e.preventDefault();
      actions('grr');
    },
  },
  footerProps: { name: 'John Doe' },
};
