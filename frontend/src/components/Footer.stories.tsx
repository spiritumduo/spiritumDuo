import React from 'react';
import Footer from "./Footer";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import StoryRouter from "storybook-react-router";

export default {
    title: 'Footer',
    component: Footer,
    decorators: [ StoryRouter() ]
} as ComponentMeta<typeof Footer>

const Template: ComponentStory<typeof Footer> = (args) => <Footer {...args} />;

export const Default = Template.bind({});
Default.args = {
    name: "John Smith"
}