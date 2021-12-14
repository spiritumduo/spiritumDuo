/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DecisionPointType } from 'types/DecisionPoint';
import PageLayout, { PageLayoutProps } from 'components/PageLayout';
import { MockedProvider } from '@apollo/client/testing';
import { DefaultLayout } from 'components/PageLayout.stories';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import DecisionPointPage, { GET_PATIENT_QUERY } from './DecisionPoint';

const patientHospitalNumber = 'MRN1234567-36';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apolloMocks = [
  {
    request: {
      query: GET_PATIENT_QUERY,
      variables: {
        hospitalNumber: patientHospitalNumber,
        limit: 1,
      },
    },
    result: {
      data: {
        getPatient: {
          hospitalNumber: 'MRN1234567-36',
          id: '1637',
          communicationMethod: 'LETTER',
          firstName: 'John 36',
          lastName: 'Doe 36',
          dateOfBirth: new Date('1970-06-12'),
          decisionPoints: [
            {
              clinicHistory: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, arcu at tempus consequat, metus felis ornare tortor, et consectetur ipsum ipsum eget ex. Pellentesque molestie est ut magna tristique, in sollicitudin odio malesuada. Sed viverra, massa vitae imperdiet faucibus, ligula dui tristique turpis, eget efficitur elit erat nec ante.',
              comorbidities: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, arcu at tempus consequat, metus felis ornare tortor, et consectetur ipsum ipsum eget ex. Pellentesque molestie est ut magna tristique, in sollicitudin odio malesuada. Sed viverra, massa vitae imperdiet faucibus, ligula dui tristique turpis, eget efficitur elit erat nec ante.',
            },
            {
              clinicHistory: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, arcu at tempus consequat, metus felis ornare tortor, et consectetur ipsum ipsum eget ex. Pellentesque molestie est ut magna tristique, in sollicitudin odio malesuada. Sed viverra, massa vitae imperdiet faucibus, ligula dui tristique turpis, eget efficitur elit erat nec ante.',
              comorbidities: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, arcu at tempus consequat, metus felis ornare tortor, et consectetur ipsum ipsum eget ex. Pellentesque molestie est ut magna tristique, in sollicitudin odio malesuada. Sed viverra, massa vitae imperdiet faucibus, ligula dui tristique turpis, eget efficitur elit erat nec ante.',
            },
            {
              clinicHistory: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, arcu at tempus consequat, metus felis ornare tortor, et consectetur ipsum ipsum eget ex. Pellentesque molestie est ut magna tristique, in sollicitudin odio malesuada. Sed viverra, massa vitae imperdiet faucibus, ligula dui tristique turpis, eget efficitur elit erat nec ante.',
              comorbidities: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, arcu at tempus consequat, metus felis ornare tortor, et consectetur ipsum ipsum eget ex. Pellentesque molestie est ut magna tristique, in sollicitudin odio malesuada. Sed viverra, massa vitae imperdiet faucibus, ligula dui tristique turpis, eget efficitur elit erat nec ante.',
            },
            {
              clinicHistory: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, arcu at tempus consequat, metus felis ornare tortor, et consectetur ipsum ipsum eget ex. Pellentesque molestie est ut magna tristique, in sollicitudin odio malesuada. Sed viverra, massa vitae imperdiet faucibus, ligula dui tristique turpis, eget efficitur elit erat nec ante.',
              comorbidities: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida, arcu at tempus consequat, metus felis ornare tortor, et consectetur ipsum ipsum eget ex. Pellentesque molestie est ut magna tristique, in sollicitudin odio malesuada. Sed viverra, massa vitae imperdiet faucibus, ligula dui tristique turpis, eget efficitur elit erat nec ante.',
            },
          ],
        },
      },
    },
  },
];

export default {
  title: 'Pages/Decision point',
  component: DecisionPointPage,
  decorators: [
    (DecisionPointPageStory) => (
      <MemoryRouter>
        <MockedProvider mocks={ apolloMocks }>
          <MockAuthProvider>
            <MockPathwayProvider>
              <PageLayout { ...DefaultLayout.args as PageLayoutProps }>
                <DecisionPointPageStory />
              </PageLayout>
            </MockPathwayProvider>
          </MockAuthProvider>
        </MockedProvider>
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof DecisionPointPage>;

// eslint-disable-next-line max-len
const Template: ComponentStory<typeof DecisionPointPage> = (args) => <DecisionPointPage { ...args } />;

export const Standard = Template.bind({});
Standard.args = {
  hospitalNumber: patientHospitalNumber,
  decisionType: DecisionPointType.TRIAGE,
};
