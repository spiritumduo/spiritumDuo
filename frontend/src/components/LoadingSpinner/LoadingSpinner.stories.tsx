/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { MemoryRouter } from 'react-router';
import { useEffect, useState } from '@storybook/addons';

export default {
  title: 'Components/Loading Spinner',
  component: LoadingSpinner,
  decorators: [(LoadingSpinnerStory) => (
    <MemoryRouter>
      <LoadingSpinnerStory />
    </MemoryRouter>
  )],
} as ComponentMeta<typeof LoadingSpinner>;

const Template: ComponentStory<
  typeof LoadingSpinner
> = (args) => <LoadingSpinner { ...args }>Loading Finished!</LoadingSpinner>;

export const Default = Template.bind({});
Default.args = {
  loading: true,
  delay: 100,
};

export const NotLoading = Template.bind({});
NotLoading.args = {
  loading: false,
  delay: 100,
};

const LoadThenStopStory = Template.bind({});
LoadThenStopStory.args = {
  loading: true,
  delay: 3000,
};

export const LoadThenStop = () => {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const timeout = setInterval(() => setLoading(!loading), 2000);
    return () => clearInterval(timeout);
  });
  return <LoadThenStopStory loading={ loading } />;
};
