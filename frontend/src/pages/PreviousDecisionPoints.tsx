import React from 'react';
import './previousdecisionpoints.css';
import DecisionPoint from 'types/DecisionPoint';
import PageLayout, { PageLayoutProps } from 'components/PageLayout';

export interface PreviousDecisionPointsProps {
  pageLayoutProps: PageLayoutProps;
  decisions: DecisionPoint[];
}

const PreviousDecisionPoints = ({
  pageLayoutProps,
  decisions,
}: PreviousDecisionPointsProps): JSX.Element => {
  const page = (
    <div>
      <div className="container previous-decision-points-container">
        <div className="row previous-decision-points-header">
          <h3>Previous Decision Points</h3>
        </div>
        {
          decisions.map((d) => (
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
                Requests / referrals made: {d.requestsReferrals}
              </p>
            </div>
          ))
        }
      </div>
    </div>
  );

  return PageLayout({
    headerProps: pageLayoutProps.headerProps,
    footerProps: pageLayoutProps.footerProps,
    element: page,
  });
};

export default PreviousDecisionPoints;
