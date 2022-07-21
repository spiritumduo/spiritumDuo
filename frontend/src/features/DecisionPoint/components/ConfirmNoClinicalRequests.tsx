import { useAppDispatch } from 'app/hooks';
import { setIsTabDisabled } from 'components/ModalPatient.slice';
import { Button } from 'nhsuk-react-components';
import React, { useLayoutEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';

interface ConfirmNoClinicalRequestsProps {
  confirmFn: () => void;
  submitFn: () => void;
  cancelFn: () => void;
  clinicalRequestResolutions?: string[];
}

/**
 * Confirmation when user tries to submit without any clinicalRequests selected
 * @param {ConfirmNoClinicalRequestsProps} props Props
 * @returns JSX.Element
 */
const ConfirmNoClinicalRequests = (
  { confirmFn, submitFn, cancelFn, clinicalRequestResolutions }: ConfirmNoClinicalRequestsProps,
): JSX.Element => {
  const [disabledState, setDisabledState] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  useLayoutEffect(() => {
    dispatch(setIsTabDisabled(true));
    return () => {
      dispatch(setIsTabDisabled(false));
    };
  }, [dispatch]);
  return (
    <Container>
      <Row>
        <strong>No requests selected!</strong>
        <p>
          No requests have been selected. Are you sure
          you want to continue?
        </p>
      </Row>
      <Row>
        {
          clinicalRequestResolutions
            ? (
              <div>By clicking &apos;Submit&apos; you are acknowledging:
                <ul>
                  {
                    clinicalRequestResolutions?.map((m) => (
                      <li key={ m }>{m}</li>
                    ))
                  }
                </ul>
              </div>
            )
            : false
        }
      </Row>
      <Button
        className="float-end w-25 mt-lg-4 ms-4"
        disabled={ disabledState }
        onClick={ () => {
          setDisabledState(true);
          confirmFn();
          submitFn();
        } }
        secondary
      >
        Submit
      </Button>
      <Button
        disabled={ disabledState }
        onClick={ () => {
          cancelFn();
        } }
        className="float-end w-25 mt-lg-4"
      >
        Cancel
      </Button>
    </Container>
  );
};

export default ConfirmNoClinicalRequests;
