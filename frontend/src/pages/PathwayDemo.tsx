import { gql, useQuery } from '@apollo/client';
import { getPatientWithReferrals } from 'pages/__generated__/getPatientWithReferrals';
import React from 'react';

const GET_PATIENT_WITH_REFERRALS_QUERY = gql`
query getPatientWithReferrals($hospitalNumber: String!) {
  getPatient(hospitalNumber: $hospitalNumber) {
    firstName
    lastName
    dateOfBirth
    hospitalNumber
    onPathways { 
      id
      referredAt
      decisionPoints {
        id
        milestones {
          id
          milestoneType {
            name
          }
          addedAt
          updatedAt
          currentState
        }
      }
    }
  }
}`;

interface PathwayDemoProps {
  hospitalNumber: string;
}

const PathwayDemo = ({ hospitalNumber }: PathwayDemoProps ): JSX.Element => {
  const { loading, error, data } = useQuery<getPatientWithReferrals>(
    GET_PATIENT_WITH_REFERRALS_QUERY,
    { variables: { hospitalNumber } },
  );

  if (loading) return <h1>Loading!</h1>;
  // Just turn data into a string so we can see it
  const dataJSON = JSON.stringify(data);
  return (
    <div>
      <h1>Data</h1>
      <p>{ error?.message }</p>
      <p> { dataJSON }</p>
    </div>
  );
};

export default PathwayDemo;
