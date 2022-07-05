import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Button } from 'nhsuk-react-components';
import { useAppDispatch } from 'app/hooks';
import { setIsTabDisabled } from 'components/ModalPatient.slice';

export interface DecisionSubmissionConfirmationProps {
  cancelCallback: () => void;
  okCallback: () => void;
  clinicalRequests?: {
    id: string;
    name: string;
  }[];
  clinicalRequestResolutions?: string[];
}

const DecisionSubmissionConfirmation = (
  { clinicalRequests, clinicalRequestResolutions,
    cancelCallback, okCallback }: DecisionSubmissionConfirmationProps,
): JSX.Element => {
  const [disabledState, setDisabledState] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setIsTabDisabled(true));
    return () => {
      dispatch(setIsTabDisabled(false));
    };
  }, [dispatch]);
  return (
    <Container className="d-flex align-items-center justify-content-left mt-5">
      <div>
        <h2>Submit these requests?</h2>
        {
          clinicalRequests
            ? (
              <>
                <strong>Requests:</strong>
                <ul>
                  {
                    clinicalRequests?.map((m) => (
                      <li key={ m.id }>{m.name}</li>
                    ))
                  }
                </ul>
              </>
            )
            : ''
        }
        {
          clinicalRequestResolutions
            ? (
              <div>By clicking &apos;OK&apos; you are acknowledging:
                <ul>
                  {
                    clinicalRequestResolutions?.map((m, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <li key={ `resolution-${index}}` }>{m}</li>
                    ))
                  }
                </ul>
              </div>
            )
            : false
        }
        <Button
          disabled={ disabledState }
          className="float-end mt-lg-4"
          secondary
          onClick={ cancelCallback }
        >
          Cancel
        </Button>
        <Button
          disabled={ disabledState }
          className="float-end mt-lg-4 me-1"
          onClick={ () => {
            setDisabledState(true);
            okCallback();
          } }
        >
          OK
        </Button>
      </div>
    </Container>
  );
};

export default DecisionSubmissionConfirmation;
