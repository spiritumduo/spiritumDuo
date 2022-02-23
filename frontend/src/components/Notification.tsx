import React, { useEffect, useReducer } from 'react';
import { gql, useSubscription } from '@apollo/client';
import { Toast, ToastContainer } from 'react-bootstrap';
import { notificationSubscription } from 'components/__generated__/notificationSubscription';

export const NOTIFICATION_SUBSCRIPTION_QUERY = gql`
    subscription notificationSubscription {
      milestoneResolved {
        id
        milestoneType {
          name
        }
        onPathway {
          patient {
            firstName
            lastName
          }
        }
      }
    }
`;

interface ToastData {
  id: string;
  header: JSX.Element;
  body: JSX.Element;
  display: boolean;
}

function notificationDataReducer(
  state: ToastData[],
  action: ToastData,
) {
  const matchingElementIndex = state.findIndex((e) => e.id === action.id);
  // if we already have it
  if (matchingElementIndex !== -1) {
    const newState: ToastData[] = [...state];
    // do we want to remove it?
    if (!action.display) {
      newState.splice(matchingElementIndex, 1);
    } else {
      newState[matchingElementIndex] = action;
    }
    return newState;
  }
  // otherwise add it to the end
  return [...state, action];
}

const Notification = (): JSX.Element => {
  const {
    data,
    error,
  } = useSubscription<notificationSubscription>(NOTIFICATION_SUBSCRIPTION_QUERY);
  const [notificationData, updateNotificationData] = useReducer(
    notificationDataReducer, [],
  );

  useEffect(() => {
    if (data) {
      const headerElement = <strong className="me-auto">Test Result Returned</strong>;
      const bodyElement = (
        <>
          Name: {`${data.milestoneResolved.onPathway.patient.firstName} ${data.milestoneResolved.onPathway.patient.lastName}`} <br />
          Result: {data.milestoneResolved.milestoneType.name}
        </>
      );
      updateNotificationData({
        id: data.milestoneResolved.id,
        header: headerElement,
        body: bodyElement,
        display: true,
      });
    }

    if (error) {
      updateNotificationData({
        id: 'error-toast-id',
        header: <strong className="me-auto">Error!</strong>,
        body: <>{error.message}</>,
        display: true,
      });
    }
  }, [data, error]);

  return (
    <ToastContainer position="bottom-end">
      {
        notificationData.map((notification) => (
          <Toast
            className="sd-notification"
            animation
            key={ `sd-toast-${notification.id}` }
            onClose={ () => updateNotificationData(
              { ...notification, display: !notification.display },
            ) }
          >
            <Toast.Header>
              {notification.header}
            </Toast.Header>
            <Toast.Body>
              {notification.body}
            </Toast.Body>
          </Toast>
        ))
      }
    </ToastContainer>
  );
};

export default Notification;
