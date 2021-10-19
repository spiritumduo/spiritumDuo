import { Story, Meta } from '@storybook/react';
import HomePage, { HomePageProps } from './HomePage';
import StoryRouter from 'storybook-react-router';

export default {
    title: 'Pages/Home Page',
    component: HomePage,
    decorators: [ StoryRouter() ]
} as Meta<typeof HomePage>

const Template: Story<typeof HomePage> = (args: HomePageProps) => <HomePage {...args} />;

const dataCallback = (e) => {
    console.log(e);
}

const searchCallback = (e) => {
    console.log(e);
}

const pathwayCallback = (e) => {
    console.log(e);
}

export const Default = Template.bind({});
Default.args = {
    user: {
        name: "John Smith"
    },
    pathwayOptions: ["Lung cancer", "Bronchieactasis"],
    triageData: dataCallback,
    clinicData: dataCallback,
    pathwayOptionsCallback: pathwayCallback,
    searchCallback: searchCallback
}