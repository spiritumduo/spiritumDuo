import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { PatientInfoLonghand } from './PatientInfoLonghand';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Patient Information (longhand)',
  component: PatientInfoLonghand,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    options: { 
      name:"Options",
      type:{name:"array", required:true}
    },
  },
} as ComponentMeta<typeof PatientInfoLonghand>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PatientInfoLonghand> = (args) => <PatientInfoLonghand {...args} />;

export const Standard = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Standard.args = {
    hospitalIdentifier: "MRN0000000",
    name: "first last",
    dateOfBirth: "01/01/1970"
};