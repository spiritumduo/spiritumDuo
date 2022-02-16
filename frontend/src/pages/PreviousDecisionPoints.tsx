import React, { useContext } from 'react';
import './previousdecisionpoints.css';
import { gql, useQuery } from '@apollo/client';
import { previousDecisionPoints } from 'pages/__generated__/previousDecisionPoints';
import { PathwayContext } from 'app/context';
import { Link } from 'react-router-dom';

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
          <Link style={ { padding: '0' } } to={ `/decision/triage/${hospitalNumber}` }>Create new decision</Link>
          <p>{ error?.message }</p>
        </div>
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
                  <p><strong>Comormidities:</strong> {d.comorbidities}</p>
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
                      </div>
                    )
                    : null
                }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default PreviousDecisionPoints;
