import { ComponentStory, ComponentMeta } from '@storybook/react';
import PatientLink  from './PatientLink';
import StoryRouter from 'storybook-react-router';
import Patient from '../../types/Patient';


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
  patient: {
    patientId:"MRN0123456",
    firstName:"John",
    lastName:"Doe"
  }
};
