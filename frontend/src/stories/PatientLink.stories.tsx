import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import PatientLink  from './PatientLink';
import StoryRouter from 'storybook-react-router';


// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Patient Link',
  component: PatientLink,
  decorators: [ StoryRouter() ],
} as ComponentMeta<typeof PatientLink>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PatientLink> = (args) => <PatientLink {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
    patientId: "MRN1234567",
    name: "John Doe"
};
