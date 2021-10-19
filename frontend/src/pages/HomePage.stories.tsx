import { Story, Meta } from '@storybook/react';
import HomePage, { HomePageProps } from './HomePage';
import StoryRouter from 'storybook-react-router';
import Patient from '../types/Patient';
import { PatientListDataFn } from '../components/PatientList';

export default {
    title: 'Pages/Home Page',
    component: HomePage,
    decorators: [ StoryRouter() ]
} as Meta<typeof HomePage>

const Template: Story<HomePageProps> = (args: HomePageProps) => <HomePage {...args} />;

// Dummy data for display
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

const dataCallback = (offset: number, limit: number) => {
    const data: Patient[] = patientArray.slice(offset, limit);
    return { data: data, totalCount: patientArray.length};
}

const searchCallback = (e: React.FormEvent<EventTarget>) => {
    console.log(e);
}

const pathwayCallback = (name: string) => {
    console.log(name);
}

export const Default = Template.bind({});
Default.args = {
    user: {
        userId: "MRN123467",
        name: "John Smith"
    },
    pathwayOptions: ["Lung cancer", "Bronchieactasis"],
    triageData: dataCallback,
    clinicData: dataCallback,
    pathwayOptionsCallback: pathwayCallback,
    searchCallback: searchCallback,
    clinicPatients: patientArray,
    triagePatients: patientArray,
    patientsPerPage: 10
}