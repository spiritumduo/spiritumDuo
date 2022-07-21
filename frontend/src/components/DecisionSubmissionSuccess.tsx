import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Button } from 'nhsuk-react-components';
import { useAppDispatch } from 'app/hooks';
import { setIsTabDisabled } from 'components/ModalPatient.slice';

export interface DecisionSubmissionSuccessProps {
  clinicalRequests?: {
    id: string;
    name: string;
  }[];
  clinicalRequestResolutions?: string[];
  onClose: (() => void);
}

const DecisionSubmissionSuccess = (
  { clinicalRequests, clinicalRequestResolutions, onClose }: DecisionSubmissionSuccessProps,
): JSX.Element => {
  const clinicalRequestsElement: JSX.Element[] | undefined = clinicalRequests?.map(
    (m) => (<li key={ m.id }>{m.name}</li>),
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setIsTabDisabled(true));
    return () => {
      dispatch(setIsTabDisabled(false));
    };
  }, [dispatch]);
  return (
    <Container className="d-flex align-items-center justify-content-left mt-5">
      <div className="d-flex align-items-center">
        <div>
          <h2>Decision Submitted</h2>
          {
            clinicalRequestsElement
              ? (
                <>
                  <strong>Requests sent:</strong>
                  <ul>
                    { clinicalRequestsElement }
                  </ul>
                </>
              )
              : ''
          }
          {
            clinicalRequestResolutions
              ? (
                <div>These results have now been acknowledged:
                  <ul>
                    {
                      clinicalRequestResolutions?.map((m) => (
                        <li key={ Math.random() }>{m}</li>
                      ))
                    }
                  </ul>
                </div>
              )
              : false
          }
          <div className="mt-lg-4">
            <p>
              Your decision has now been submitted. You shall
              receive confirmation of any requests shortly.
            </p>
          </div>
          <Button className="float-end mt-lg-4" onClick={ () => onClose() }>
            OK
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default DecisionSubmissionSuccess;
