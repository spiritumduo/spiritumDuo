/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Notification, { NOTIFICATION_SUBSCRIPTION_QUERY } from 'components/Notification';

export default {
  title: 'Components/Notification',
  component: Notification,
} as ComponentMeta<typeof Notification>;

const Template: ComponentStory<typeof Notification> = () => <Notification />;

export const Standard = Template.bind({});
Standard.parameters = {
  apolloClient: {
    mocks: [
      {
        request: {
          query: NOTIFICATION_SUBSCRIPTION_QUERY,
        },
        result: {
          data: {
            clinicalRequestResolved: {
              id: 'first-1',
              clinicalRequestType: {
                name: 'Test Result',
              },
              onPathway: {
                patient: {
                  firstName: 'John',
                  lastName: 'Doe',
                },
              },
            },
          },
        },
      },
    ],
  },
};

export const Error = Template.bind({});
Error.parameters = {
  apolloClient: {
    mocks: [
      {
        request: {
          query: NOTIFICATION_SUBSCRIPTION_QUERY,
        },
        result: {
          errors: [
            {
              message: 'error message',
            },
          ],
        },
      },
    ],
  },
};
