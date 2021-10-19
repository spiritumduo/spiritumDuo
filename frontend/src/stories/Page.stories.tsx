import React from 'react';
import StoryRouter from 'storybook-react-router';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Page } from './Page';

export default {
  title: 'Example/Page',
  component: Page,
  decorators: [ StoryRouter() ],
} as ComponentMeta<typeof Page>;

const Template: ComponentStory<typeof Page> = (args) => <Page {...args} />;

export const Standard = Template.bind({});