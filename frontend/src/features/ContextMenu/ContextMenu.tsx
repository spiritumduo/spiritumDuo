import { Button, ErrorMessage } from 'nhsuk-react-components';
import React, { useState, useCallback, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Textarea } from 'components/nhs-style';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { gql, useMutation } from '@apollo/client';
import { BsX } from 'react-icons/bs';

import { submitFeedback } from './__generated__/submitFeedback';

export interface FeedbackInput {
  screenshotBase64: string;
  feedback: string;
}

export const SUBMIT_FEEDBACK_MUTATION = gql`
  mutation submitFeedback($input: FeedbackInput!){
    submitFeedback(input: $input){
      success
    }
  }
`;

// add rect svg graphic for area under cursor before screenshot
// transparent

type ContextMenuProps = {
  takeScreenshotFn: () => Promise<string>;
};

const ContextMenu = ({ takeScreenshotFn }: ContextMenuProps): JSX.Element => {
  const [isContextMenuShown, setContextMenuShown] = useState<boolean>(false);
  const [anchorPoint, setAnchorPoint] = useState<{x: number, y: number}>({ x: 0, y: 0 });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [screenshotBase64, setScreenshotB64] = useState<string>('');
  const [showConfirmationDialog, setShowConfirmationDialog] = useState<boolean>(false);

  const schema = yup.object({
    screenshotBase64: yup.string().required(),
    feedback: yup.string().required('This is a required field'),
  }).required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<FeedbackInput>({ resolver: yupResolver(schema) });

  async function handleFeedbackMenu() {
    await setContextMenuShown(false);
    const image = await takeScreenshotFn();
    setScreenshotB64(image);
    setShowModal(true);
  }

  const handleContextMenu = useCallback(
    (event) => {
      // I've had to put this check in because RTL/JestDOM doesn't have layouts to
      // support this function
      const overElement: Element | null = document.elementFromPoint
        ? document.elementFromPoint(event.pageX, event.pageY)
        : null;
      if (
        overElement?.nodeName === 'TEXTAREA'
        || overElement?.nodeName === 'INPUT'
      ) {
        setContextMenuShown(false);
        return;
      }
      event.preventDefault();
      setAnchorPoint({ x: event.pageX, y: event.pageY });
      setContextMenuShown(true);
    },
    [setAnchorPoint, setContextMenuShown],
  );

  const handleClick = useCallback(
    () => (isContextMenuShown ? setContextMenuShown(false) : null), [isContextMenuShown],
  );

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  });

  useEffect(() => {
    reset({
      feedback: '',
    });
  }, [reset, showModal]);

  const [submitFeedbackMutation, {
    data, loading, error,
  }] = useMutation<submitFeedback>(SUBMIT_FEEDBACK_MUTATION);

  const onSubmitFn = (
    mutation: typeof submitFeedbackMutation,
    values: FeedbackInput,
  ) => {
    mutation({
      variables: {
        input: values,
      },
    });
    setShowConfirmationDialog(true);
  };

  if ((loading || data?.submitFeedback.success === true) && showModal && showConfirmationDialog) {
    return (
      <Modal
        size="lg"
        show={ showModal }
        onHide={ () => {
          setShowModal(false);
          setShowConfirmationDialog(false);
        } }
      >
        <Modal.Header>
          <Modal.Title>Feedback</Modal.Title>
        </Modal.Header>
        <LoadingSpinner loading={ loading }>
          <Modal.Body>
            Submitted! Thank you for your feedback
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="mb-1"
              onClick={ () => {
                setShowModal(false);
                setShowConfirmationDialog(false);
              } }
            >
              Close
            </Button>
          </Modal.Footer>
        </LoadingSpinner>
      </Modal>
    );
  }

  return (
    <>
      {
        isContextMenuShown
          ? (
            <div
              className="contextmenu"
              role="menu"
              style={ {
                top: anchorPoint.y,
                left: anchorPoint.x,
              } }
            >
              <button type="button" onClick={ async () => { await handleFeedbackMenu(); } }>Send feedback</button>
            </div>
          ) : <></>
      }
      {
        showModal
          ? (
            <Modal size="lg" show={ showModal } onHide={ () => setShowModal(false) }>
              <Modal.Header>
                <Modal.Title>Feedback</Modal.Title>
                <button
                  type="button"
                  className="bg-transparent"
                  style={ { border: 'none' } }
                  onClick={ () => setShowModal(false) }
                >
                  <BsX size="2rem" />
                </button>
              </Modal.Header>
              {
                error
                  ? <ErrorMessage>{error?.message}</ErrorMessage>
                  : <></>
              }
              <form onSubmit={ handleSubmit( () => {
                onSubmitFn(submitFeedbackMutation, getValues());
              } ) }
              >
                <div className="mx-2">
                  <img
                    src={ screenshotBase64 }
                    alt="screenshot"
                    width="100%"
                  />
                </div>
                <Modal.Body>
                  <input
                    type="hidden"
                    value={ screenshotBase64 }
                    { ...register('screenshotBase64', { required: true }) }
                  />
                  <Textarea
                    label="Please provide a comment explaining your feedback"
                    hint="This may include a list of steps to help us recreate an error"
                    { ...register('feedback', { required: true }) }
                    error={ errors.feedback?.message }
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button className="mb-1" type="submit">Submit</Button>
                </Modal.Footer>
              </form>
            </Modal>
          ) : <></>
      }
    </>
  );
};

export default ContextMenu;
