import React, { useContext, useState } from 'react';
import './previousdecisionpoints.css';
import { gql, useQuery } from '@apollo/client';
import { previousDecisionPoints } from 'pages/__generated__/previousDecisionPoints';
import { PathwayContext } from 'app/context';
import { ErrorMessage } from 'nhsuk-react-components';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';

export interface PreviousDecisionPointsProps {
  hospitalNumber: string;
}

export const PREVIOUS_DECISION_POINTS_QUERY = gql`
  query previousDecisionPoints($hospitalNumber: String!, $pathwayId: ID!, $includeDischarged: Boolean = false) {
    getPatient(hospitalNumber: $hospitalNumber) {
      onPathways(pathwayId: $pathwayId, includeDischarged: $includeDischarged) {
        id
        decisionPoints {
          id
          decisionType
          clinicHistory
          comorbidities
          clinician {
            firstName
            lastName
          }
          milestones {
            id
            currentState
            milestoneType {
              name
            }
          }
          addedAt
          updatedAt
        }
      }
    }
  }
`;

/**
 * Previous Decisions Point Page
 * @param {PreviousDecisionPointsProps} props Props for this page
 * @returns {JSX.Element} Page element
 */
const PreviousDecisionPoints = ({ hospitalNumber }: PreviousDecisionPointsProps): JSX.Element => {
  const { currentPathwayId } = useContext(PathwayContext);
  const { loading, error, data } = useQuery<previousDecisionPoints>(
    PREVIOUS_DECISION_POINTS_QUERY, {
      variables: {
        pathwayId: currentPathwayId,
        hospitalNumber: hospitalNumber,
        limit: 5,
        includeDischarged: true,
      },
    },
  );

  const decisions = data?.getPatient?.onPathways?.[0]?.decisionPoints;
  if (!loading && !decisions) return <h1>Patient not on this pathway!</h1>;

  return (
    <LoadingSpinner loading={ loading }>
      <div className="container previous-decision-points-container">
        { error ? <ErrorMessage>{error.message}</ErrorMessage> : null}
        {
          decisions?.map((d) => (
            <div className="row row-cols-3 p-2" key={ d.id }>
              <div className="col-9">
                <strong className="row p-1">
                  Decision for {d.decisionType}
                  , {d.addedAt.toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric' })}
                  , Dr {d.clinician.firstName}
                  , {d.clinician.lastName}
                </strong>
                <div className="row p-1">
                  <p><strong>Clinical History:</strong> {d.clinicHistory}</p>
                </div>
                <div className="row p-1">
                  <p><strong>Comorbidities:</strong> {d.comorbidities}</p>
                </div>
                {
                  d.milestones?.length !== 0
                    ? (
                      <div className="row">
                        <div className="col" id={ `request-tbl-${d.id}` }>
                          <b>Requests / referrals made:</b>
                        </div>
                        <div className="col" role="table" aria-label="Milestone Requests" aria-describedby={ `request-tbl-${d.id}` }>
                          <div className="row" role="row">
                            <div className="col" role="columnheader">
                              <strong>Milestone</strong>
                            </div>
                            <div className="col" role="columnheader">
                              <strong>Status</strong>
                            </div>
                          </div>
                        </div>
                        {
                          d.milestones?.map((m) => (
                            <div key={ `m-id-${m.id}` } className="row" role="row">
                              <div className="col" role="cell">
                                {m.milestoneType.name}
                              </div>
                              <div className="col" role="cell">
                                {m.currentState}
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    )
                    : null
                  }
              </div>
            </div>
          ))
        }
      </div>
    </LoadingSpinner>
  );
};

export default PreviousDecisionPoints;
