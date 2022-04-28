import React, { useState, useEffect, useContext } from 'react';

// LIBRARIES
import { gql, useQuery, useSubscription } from '@apollo/client';

// APP
import { getPatientOnPathwayConnection, getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_decisionPoints_milestones } from 'components/__generated__/getPatientOnPathwayConnection';
import User from 'types/Users';
import { AuthContext } from 'app/context';

// COMPONENTS
import PatientList, { PatientListProps } from 'components/PatientList';
import { useAppDispatch } from 'app/hooks';
import { setModalPatientHospitalNumber } from 'pages/HomePage.slice';

// GENERATED TYPES
import { onPathwayUpdated } from 'components/__generated__/onPathwayUpdated';

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
            decisionPoints {
              milestones {
                id
                updatedAt
                currentState
                milestoneType {
                  name
                }
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

function edgesToNodes(
  data: getPatientOnPathwayConnection | undefined, currentPage: number, patientsPerPage: number,
) {
  const pageCount = data
    ? Math.ceil(data.getPatientOnPathwayConnection.totalCount / patientsPerPage)
    : 0;

  const allNodes = data?.getPatientOnPathwayConnection.edges?.map((edge) => edge?.node);
  const pageInfo = data?.getPatientOnPathwayConnection.pageInfo;

  const start = currentPage * patientsPerPage;
  const end = start + patientsPerPage;
  const nodes = allNodes?.slice(start, end);

  return { nodes, pageCount, pageInfo };
}

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
    error: subscrError,
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

  // THIS IS THE SOURCE OF THE ACT WARNINGS!
  useEffect(() => {
    refetch();
  }, [subscrData, refetch]);

  let listElements: PatientListProps['data'];
  const { nodes, pageCount, pageInfo } = edgesToNodes(data, currentPage, patientsToDisplay);
  if (nodes) {
    listElements = nodes.flatMap(
      (n) => {
        if (!n) return []; // the type says we can have undefined nodes
        let lastMilestone = null;
        // eslint-disable-next-line camelcase, max-len
        type GraphQLMilestone = getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_decisionPoints_milestones;
        if (n.onPathways?.[0].decisionPoints) {
          const decisionPoints = n.onPathways?.[0].decisionPoints;

          /**
           * Compare two milestones - used in our map/reduce below
           * @param currentMilestone Current Milestone to compare
           * @param mostRecentCompletedMilestone Completed Milestone with most recent updatedAt
           * @returns Milestone that was completed most recently
           */
          const compareMilestones = (
            mostRecentCompletedMilestone: GraphQLMilestone | undefined,
            currentMilestone: GraphQLMilestone | undefined,
          ) => {
            let returnMilestone;
            if (mostRecentCompletedMilestone === undefined) {
              returnMilestone = currentMilestone;
            } else if (
              currentMilestone?.currentState === 'COMPLETED'
              // eslint-disable-next-line max-len
              && currentMilestone.updatedAt.valueOf() > mostRecentCompletedMilestone?.updatedAt.valueOf()
            ) {
              returnMilestone = currentMilestone;
            } else {
              returnMilestone = mostRecentCompletedMilestone;
            }
            return returnMilestone;
          };

          const milestone = decisionPoints.flatMap(
            (dp) => dp.milestones?.reduce(compareMilestones, undefined),
          ).reduce(compareMilestones, undefined);
          if (milestone) lastMilestone = milestone;
        }
        const mostRecentStage = lastMilestone ? lastMilestone.milestoneType.name : 'Triage';
        const updatedAt = lastMilestone?.updatedAt
          ? lastMilestone.updatedAt
          : n.onPathways?.[0].updatedAt;

        const isOnPathwayLockedByOther = n.onPathways?.[0].lockEndTime > new Date() && (
          n.onPathways?.[0]?.lockUser?.id
            ? n.onPathways?.[0]?.lockUser?.id !== user?.id
            : false
        );
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
