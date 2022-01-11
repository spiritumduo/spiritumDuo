import React from 'react';
import './previousdecisionpoints.css';
import { gql, useQuery } from '@apollo/client';
import { currentPathwayIdVar } from 'app/cache';
import { previousDecisionPoints } from 'pages/__generated__/previousDecisionPoints';

export interface PreviousDecisionPointsProps {
  hospitalNumber: string;
}

export const PREVIOUS_DECISION_POINTS_QUERY = gql`
  query previousDecisionPoints($hospitalNumber: String!, $pathwayId: ID!) {
    getPatient(hospitalNumber: $hospitalNumber) {
      onPathways(pathwayId: $pathwayId) {
        decisionPoints {
          id
          decisionType
          clinicHistory
          comorbidities
          clinician {
            firstName
            lastName
          }
          addedAt
          updatedAt
        }
      }
    }
  }
`;

const PreviousDecisionPoints = ({ hospitalNumber }: PreviousDecisionPointsProps): JSX.Element => {
  // TODO: FIX THIS WITH LOGIN!
  // const pathwayId = currentPathwayId();
  const pathwayId = currentPathwayIdVar();
  const { loading, error, data } = useQuery<previousDecisionPoints>(
    PREVIOUS_DECISION_POINTS_QUERY, {
      variables: {
        pathwayId: pathwayId,
        hospitalNumber: hospitalNumber,
        limit: 5,
      },
    },
  );
  if (loading) return <h1>Loading!</h1>;

  const decisions = data?.getPatient?.onPathways?.[0].decisionPoints;
  return (
    <div>
      <div className="container previous-decision-points-container">
        <div className="row previous-decision-points-header">
          <h3>Previous Decision Points</h3>
          <p>{ error?.message }</p>
        </div>
        {
          decisions?.map((d) => (
            <div className="previous-decision-points-row" key={ d.id }>
              <p>
                <strong>
                  Decision for {d.decisionType}
                  , {d.addedAt.toLocaleString()}
                  , Dr {d.clinician.firstName}
                  , {d.clinician.lastName}
                </strong>
                <br />
                Clinical History: {d.clinicHistory} <br />
                Comormidities: {d.comorbidities} <br />
                Requests / referrals made: TODO: change this
              </p>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default PreviousDecisionPoints;
