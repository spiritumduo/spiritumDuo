import React, { useState, useEffect, useContext } from 'react';

// LIBRARIES
import { gql, useQuery, useSubscription } from '@apollo/client';
import { Table } from 'nhsuk-react-components';
import { LockFill } from 'react-bootstrap-icons';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
// APP
import { getPatientOnPathwayConnection, getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_decisionPoints_milestones } from 'components/__generated__/getPatientOnPathwayConnection';
import Patient from 'types/Patient';
import User from 'types/Users';
import { AuthContext } from 'app/context';

// COMPONENTS
import PatientList from 'components/PatientList';
import { onPathwayUpdated } from './__generated__/onPathwayUpdated';

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
  patientOnClick?: (hospitalNumber: Patient) => void;
}

const WrappedPatientList = ({
  pathwayId,
  patientsToDisplay,
  outstanding,
  underCareOf,
  includeDischarged,
  patientOnClick,
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

  let listElements: JSX.Element[];

  useEffect(() => {
    refetch();
  }, [subscrData, refetch]);

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
          ? `${lastMilestone.updatedAt.toLocaleDateString()} ${lastMilestone.updatedAt.toLocaleTimeString()}`
          : `${n.onPathways?.[0].updatedAt.toLocaleDateString()} ${n.onPathways?.[0].updatedAt.toLocaleTimeString()}`;

        const isOnPathwayLockedByOther = n.onPathways?.[0].lockEndTime > new Date() && (
          n.onPathways?.[0]?.lockUser?.id
            ? parseInt(n.onPathways?.[0]?.lockUser?.id, 10) !== user?.id
            : false
        );

        const lockIconElementDesktop = isOnPathwayLockedByOther
          ? <LockFill data-testid={ `lock-icon-desktop-${n.id}` } size="1em" style={ { boxSizing: 'content-box', marginTop: '-3px' } } color="black" />
          : <></>;
        const lockIconElementResponsive = isOnPathwayLockedByOther
          ? <LockFill data-testid={ `lock-icon-responsive-${n.id}` } size="1em" style={ { boxSizing: 'content-box', marginTop: '-3px' } } color="black" />
          : <></>;
        let lockIconTooltipElement = <></>;
        if (isOnPathwayLockedByOther) {
          lockIconTooltipElement = (
            <OverlayTrigger
              overlay={ (
                <Tooltip className="d-none d-md-inline-block" id="tooltip-disabled">
                  This patient is locked by
                  &nbsp;{n.onPathways?.[0].lockUser?.firstName}
                  &nbsp;{n.onPathways?.[0].lockUser?.lastName}
                </Tooltip>
              ) }
            >
              { lockIconElementDesktop }
            </OverlayTrigger>
          );
        }

        return (
          <Table.Row
            tabIndex={ 0 }
            aria-label={ `${n.firstName} ${n.lastName}` }
            className={ isOnPathwayLockedByOther ? 'disabled' : 'active' }
            key={ `patient-list-key${n.id}` }
            onClick={ () => !isOnPathwayLockedByOther && patientOnClick && patientOnClick(n) }
          >
            <Table.Cell>
              <div>
                {`${n.firstName} ${n.lastName}`}
                <span className="d-md-none ps-2">{ lockIconElementResponsive }</span>
              </div>
            </Table.Cell>
            <Table.Cell>{n.hospitalNumber}</Table.Cell>
            <Table.Cell>{n.dateOfBirth?.toLocaleDateString()}</Table.Cell>
            <Table.Cell>{mostRecentStage}</Table.Cell>
            <Table.Cell>{updatedAt}</Table.Cell>
            <Table.Cell>
              <div className="d-none d-md-block pt-0 pe-3 text-center">
                { lockIconTooltipElement }
              </div>
            </Table.Cell>
          </Table.Row>
        );
      },
    );
  } else {
    listElements = [<tr key="emptyListElement" />];
  }
  return (
    <>
      <div>{ error?.message }</div>
      <PatientList
        data={ listElements }
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
