/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';
import StoryRouter from 'storybook-react-router';
import Patient from 'types/Patient';
import { DefaultLayout } from 'components/PageLayout.stories';
import PageLayout, { PageLayoutProps } from 'components/PageLayout';
import { MockedProvider } from '@apollo/client/testing';
import { PATIENTS_FOR_PATHWAY_QUERY } from 'app/queries/UsePatientsForPathway';
import { DecisionPointType } from 'types/DecisionPoint';
import HomePage, { HomePageProps } from './HomePage';

// Dummy data for display
const patientArray: Patient[] = [];
const patient = {
  hospitalNumber: 'MRN1234567',
  firstName: 'John',
  lastName: 'Doe',
};

for (let i = 0; i < 50; ++i) {
  const newPatient = {
    id: i,
    hospitalNumber: `${patient.hospitalNumber}-${i + 1}`,
    firstName: patient.firstName,
    lastName: `${patient.lastName} ${i + 1}`,
  };
  patientArray.push(newPatient);
}

const edges = patientArray.map((p) => ({
  cursor: `${p.id}YXJyYXljb25uZWN0aW9uOjA=`,
  node: p,
}));

const apolloMocks = [
  {
    request: {
      query: PATIENTS_FOR_PATHWAY_QUERY,
      variables: {
        pathwayId: 1,
        last: 10,
        after: undefined,
        // filter: DecisionPointType.TRIAGE,
      },
    },
    result: {
      data: {
        getPatientsForPathway: {
          edges: edges.slice(0, 10),
          pageInfo: {
            hasNextPage: true,
            endCursor: 'YXJyYXljb25uZWN0aW9uOjA=',
          },
        },
      },
    },
  },
  {
    request: {
      query: PATIENTS_FOR_PATHWAY_QUERY,
      variables: {
        pathwayId: 1,
        limit: 10,
        after: 'YXJyYXljb25uZWN0aW9uOjA=',
        // filter: DecisionPointType.TRIAGE,
      },
    },
    result: {
      data: {
        getPatientsForPathway: {
          edges: edges.slice(10, 10),
          pageInfo: {
            hasNextPage: true,
            endCursor: 'YXJyYXljb25uZWN0aW9uOjA=',
          },
        },
      },
    },
  },
  {
    request: {
      query: PATIENTS_FOR_PATHWAY_QUERY,
      variables: {
        pathwayId: 1,
        limit: 10,
        after: 'YXJyYXljb25uZWN0aW9uOjA=',
        // filter: DecisionPointType.TRIAGE,
      },
    },
    result: {
      data: {
        getPatientsForPathway: {
          edges: edges.slice(20, 10),
          pageInfo: {
            hasNextPage: true,
            endCursor: 'YXJyYXljb25uZWN0aW9uOjA=',
          },
        },
      },
    },
  },
  {
    request: {
      query: PATIENTS_FOR_PATHWAY_QUERY,
      variables: {
        pathwayId: 1,
        limit: 10,
        cursor: 'YXJyYXljb25uZWN0aW9uOjA=',
        // filter: DecisionPointType.TRIAGE,
      },
    },
    result: {
      data: {
        getPatientsForPathway: {
          edges: edges.slice(30, 10),
          pageInfo: {
            hasNextPage: true,
            endCursor: 'YXJyYXljb25uZWN0aW9uOjA=',
          },
        },
      },
    },
  },
  {
    request: {
      query: PATIENTS_FOR_PATHWAY_QUERY,
      variables: {
        pathwayId: 1,
        limit: 10,
        cursor: 'YXJyYXljb25uZWN0aW9uOjA=',
        // filter: DecisionPointType.TRIAGE,
      },
    },
    result: {
      data: {
        getPatientsForPathway: {
          edges: edges.slice(40, 10),
          pageInfo: {
            hasNextPage: true,
            endCursor: 'YXJyYXljb25uZWN0aW9uOjA=',
          },
        },
      },
    },
  },
];

export default {
  title: 'Pages/Home Page',
  component: HomePage,
  decorators: [
    (HomePageStory) => (
      <MockedProvider mocks={ apolloMocks }>
        <PageLayout { ...DefaultLayout.args as PageLayoutProps }>
          <HomePageStory />
        </PageLayout>
      </MockedProvider>
    ),
    StoryRouter(), // for some reason this has to come last
  ],
} as Meta<typeof HomePage>;

const Template: Story<HomePageProps> = (args: HomePageProps) => <HomePage { ...args } />;

const patientsPerPage = 10;
const dataCallback = (selectedItem: { selected: number; }) => {
  const start = selectedItem.selected * patientsPerPage;
  const end = start + patientsPerPage;
  const data: Patient[] = patientArray.slice(start, end);
};

export const Default = Template.bind({});
Default.args = {
  patientsPerPage: patientsPerPage,
  triageData: patientArray.slice(0, patientsPerPage),
  updateTriage: dataCallback,
  clinicData: patientArray.slice(0, patientsPerPage),
  updateClinic: dataCallback,
};
