/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import StoryRouter from 'storybook-react-router';
import PageLayout, { PageLayoutProps } from 'components/PageLayout';
import { actions } from '@storybook/addon-actions';

export default {
  title: 'Components/Page Layout',
  component: PageLayout,
  decorators: [StoryRouter()],
} as ComponentMeta<typeof PageLayout>;

// eslint-disable-next-line max-len
const Template: ComponentStory<typeof PageLayout> = (args: PageLayoutProps) => <PageLayout { ...args } />;

export const DefaultLayout = Template.bind({});
DefaultLayout.args = {
  headerProps: {
    pathwayOptions: ['Lung cancer', 'Bronchieactasis'],
    pathwayOnItemSelect: (name: string) => console.log(name),
    searchOnSubmit: (e: React.FormEvent<EventTarget>) => {
      e.preventDefault();
      actions('grr');
    },
  },
  footerProps: { name: 'John Doe' },
  element: (<> <h1>Page Layout!</h1> </>),
};
