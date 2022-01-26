import React from 'react';
import { Link } from 'react-router-dom';

export interface DecisionSubmissionSuccessProps {
  milestones?: {
    id: string;
    name: string;
  }[]
}

const DecisionSubmissionSuccess = (
  { milestones }: DecisionSubmissionSuccessProps,
): JSX.Element => {
  const milestonesElement: JSX.Element[] | undefined = milestones?.map(
    (m) => (<div className="row" key={ m.id }>{m.name}</div>),
  );
  return (
    <div className="container">
      <div className="row">
        <h2>Decision submitted successfully</h2>
      </div>
      <div>
        {
          milestonesElement
            ? (
              <>
                <h5 className="row">Requests Sent:</h5>
                { milestonesElement }
              </>
            )
            : ''
          }
        <Link to="/">
          <button type="button" className="btn btn-outline-secondary w-25 ms-1 float-end">
            OK
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DecisionSubmissionSuccess;
