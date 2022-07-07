import React, { useState, useEffect, useContext } from 'react';

// LIBRARIES
import { gql, useQuery, useSubscription } from '@apollo/client';

// APP
import User from 'types/Users';
import { AuthContext } from 'app/context';
import edgesToNodes from 'app/pagination';

// COMPONENTS
import PatientList, { PatientListProps } from 'components/PatientList';
import { useAppDispatch } from 'app/hooks';
import { setModalPatientHospitalNumber } from 'pages/HomePage.slice';
import { setOnMdtWorkflow } from 'features/DecisionPoint/DecisionPoint.slice';

// GENERATED TYPES
import { onPathwayUpdated } from 'components/__generated__/onPathwayUpdated';
import { getPatientOnPathwayConnection } from 'components/__generated__/getPatientOnPathwayConnection';

export const GET_PATIENT_ON_PATHWAY_CONNECTION_QUERY = gql`
  query getPatientOnPathwayConnection(
    $outstanding: Boolean, $pathwayId:ID!, $first:Int, $after: String, $underCareOf: Boolean, $includeDischarged: Boolean
  ) {
    getPatientOnPathwayConnection(
      outstanding: $outstanding, pathwayId:$pathwayId, first:$first, after: $after, underCareOf: $underCareOf, includeDischarged: $includeDischarged
    ) @connection(
        key: "getPatientOnPathwayConnection",
        filter: ["outstanding", "pathwayId", "underCareOf", "includeDischarged"]
        )
      {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          id
          firstName
          lastName
          hospitalNumber
          dateOfBirth
          onPathways(pathwayId: $pathwayId, includeDischarged: $includeDischarged) {
            id
            outstandingClinicalRequest: clinicalRequests(outstanding: true, limit: 1) {
              id
              updatedAt
              currentState
              clinicalRequestType {
                name
              }
            }
            clinicalRequest: clinicalRequests(outstanding: false, limit: 1) {
              id
              updatedAt
              currentState
              clinicalRequestType {
                name
              }
            }
            lockEndTime
            lockUser{
              id
              firstName
              lastName
            }
            updatedAt
          }
        }
      }
    }
  }
`;

export const ON_PATHWAY_UPDATED_SUBSCRIPTION = gql`
  subscription onPathwayUpdated(
    $pathwayId:ID!,
    $includeDischarged: Boolean
  ) {
    onPathwayUpdated(
      pathwayId: $pathwayId,
      includeDischarged: $includeDischarged
    ){
      id
    }
  }
`;

const usePatientsForPathwayQuery = (
  // eslint-disable-next-line max-len
  pathwayId: string, first: number, outstanding: boolean, underCareOf: boolean, includeDischarged: boolean, cursor?: string,
) => useQuery<getPatientOnPathwayConnection>(
  GET_PATIENT_ON_PATHWAY_CONNECTION_QUERY, {
    variables: {
      outstanding: outstanding,
      pathwayId: pathwayId,
      first: first,
      after: cursor,
      underCareOf: underCareOf,
      includeDischarged: includeDischarged,
    },
    notifyOnNetworkStatusChange: true,
  },
);

export interface WrappedPatientListProps {
  pathwayId: string;
  patientsToDisplay: number;
  outstanding?: boolean;
  underCareOf?: boolean;
  includeDischarged?: boolean;
}

const WrappedPatientList = ({
  pathwayId,
  patientsToDisplay,
  outstanding,
  underCareOf,
  includeDischarged,
}: WrappedPatientListProps): JSX.Element => {
  const {
    loading,
    error,
    data,
    fetchMore,
    refetch,
  // eslint-disable-next-line max-len
  } = usePatientsForPathwayQuery(pathwayId, patientsToDisplay, !!outstanding, !!underCareOf, !!includeDischarged);

  const {
    data: subscrData,
  } = useSubscription<onPathwayUpdated>(ON_PATHWAY_UPDATED_SUBSCRIPTION, {
    variables: {
      pathwayId: pathwayId,
      includeDischarged: includeDischarged,
    },
  });
  const [maxFetchedPage, setMaxFetchedPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const { user: contextUser } = useContext(AuthContext);
  const user = contextUser as User;
  const dispatch = useAppDispatch();

  useEffect(() => {
    refetch();
  }, [subscrData, refetch]);

  let listElements: PatientListProps['data'];
  type onPathwayNode = getPatientOnPathwayConnection['getPatientOnPathwayConnection']['edges'][0]['node'];
  const { nodes, pageCount, pageInfo } = edgesToNodes<onPathwayNode>(
    data?.getPatientOnPathwayConnection, currentPage, patientsToDisplay,
  );
  if (nodes) {
    listElements = nodes.flatMap(
      (n) => {
        if (!n) return []; // the type says we can have undefined nodes
        const pathway = n.onPathways?.[0];
        const lastClinicalRequest = (
          pathway?.outstandingClinicalRequest?.[0] || pathway?.clinicalRequest?.[0]
        );
        const mostRecentStage = lastClinicalRequest ? lastClinicalRequest.clinicalRequestType.name : 'Triage';
        const updatedAt = lastClinicalRequest?.updatedAt
          ? lastClinicalRequest.updatedAt
          : n.onPathways?.[0].updatedAt;

        let isOnPathwayLockedByOther = false;
        const lockUser = n.onPathways?.[0].lockUser;
        const lockEndTime = n.onPathways?.[0].lockEndTime;
        if (lockUser && lockEndTime) {
          if (lockUser.id !== user?.id && lockEndTime > Date.now()) {
            isOnPathwayLockedByOther = true;
          }
        }
        return {
          id: n.id,
          firstName: n.firstName,
          lastName: n.lastName,
          hospitalNumber: n.hospitalNumber,
          dateOfBirth: n.dateOfBirth,
          updatedAt: updatedAt,
          mostRecentStage: mostRecentStage,
          isOnPathwayLockedByOther: isOnPathwayLockedByOther,
          lockFirstName: n.onPathways?.[0].lockUser?.firstName,
          lockLastName: n.onPathways?.[0].lockUser?.lastName,
        };
      },
    );
  } else {
    listElements = [];
  }

  const onClickCallback = (hospitalNumber: string) => {
    dispatch(setModalPatientHospitalNumber(hospitalNumber));
    dispatch(setOnMdtWorkflow(undefined));
  };

  return (
    <>
      <div>{ error?.message }</div>
      <PatientList
        data={ listElements }
        onClickCallback={ onClickCallback }
        isLoading={ loading }
        updateData={ ({ selected }) => {
          setCurrentPage(selected);
          if (selected > maxFetchedPage) {
            if (pageInfo?.hasNextPage) {
              setMaxFetchedPage(selected);
              fetchMore({
                variables: {
                  after: pageInfo?.endCursor,
                },
              });
            }
          }
        } }
        pageCount={ pageCount }
      />
    </>
  );
};

export default WrappedPatientList;
