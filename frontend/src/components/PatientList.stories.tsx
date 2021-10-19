import { ComponentStory, ComponentMeta } from '@storybook/react';
import PatientList, { PatientListProps, PatientListDataFn }  from './PatientList';
import StoryRouter from 'storybook-react-router';
import Patient from '../types/Patient';


// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Patient List',
  component: PatientList,
  decorators: [ StoryRouter() ],
} as ComponentMeta<typeof PatientList>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PatientList> = (args: PatientListProps) => <PatientList {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
const patientArray: Patient[] = [];
const patient = {
    patientId: "MRN1234567",
    name: "John Doe"
};

for (let i = 0; i < 50; ++i) {
    const newPatient = {
        patientId: patient.patientId + `-${i + 1}`,
        name: patient.name + ` ${i + 1}`
    }
    patientArray.push(newPatient);
}

const updateFn = function (offset: number, limit: number): PatientListDataFn {
    const data: Patient[] = patientArray.slice(offset, limit);
    return { data: data, totalCount: patientArray.length};
}

Default.args = {
    patients: patientArray,
    pageLimit: 10,
    updateData: updateFn
};
