import { useState } from 'react';
import { ApolloError, gql, useMutation, useQuery } from '@apollo/client';
import { pathwayOptionsVar, loggedInUserVar } from 'app/cache';
import User from 'types/Users';
import { PatientListDataFn } from 'components/PatientList';
import { HomePageProps } from 'pages/HomePage';

export default function homePageProps() {
  const patientsForPathwayQuery = gql`
    query getPatientsForPathway($pathwayId: ID!, $filter: DecisionPointType) {
      getPatientsForPathway (pathwayId: $pathwayId, filter: $filter) {
          patients {
              id
              firstName
              lastName
              hospitalNumber
          }
        }
      }
    `;

  const {loading, error, data } = useQuery(patientsForPathwayQuery);
}
