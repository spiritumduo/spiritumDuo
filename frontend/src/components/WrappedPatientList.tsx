/* eslint-disable camelcase */
import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import PatientList from 'components/PatientList';
import { getPatientOnPathwayConnection, getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node, getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_decisionPoints_milestones } from 'components/__generated__/getPatientOnPathwayConnection';

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
          }
        }
      }
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

type QueryPatient = getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node;

export interface WrappedPatientListProps {
  pathwayId: string;
  patientsToDisplay: number;
  linkFactory: (patient: QueryPatient) => JSX.Element;
  outstanding?: boolean;
  underCareOf?: boolean;
  includeDischarged?: boolean;
}

const WrappedPatientList = ({
  pathwayId,
  patientsToDisplay,
  linkFactory,
  outstanding = true,
  underCareOf = true,
  includeDischarged = true,
}: WrappedPatientListProps): JSX.Element => {
  const {
    loading,
    error,
    data,
    fetchMore,
  // eslint-disable-next-line max-len
  } = usePatientsForPathwayQuery(pathwayId, patientsToDisplay, outstanding, underCareOf, includeDischarged);
  const [maxFetchedPage, setMaxFetchedPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  let listElements: JSX.Element[];

  const { nodes, pageCount, pageInfo } = edgesToNodes(data, currentPage, patientsToDisplay);
  if (nodes) {
    listElements = nodes.flatMap(
      (n) => {
        if (!n) return []; // the type says we can have undefined nodes
        let lastMilestoneName = 'Triage';
        // eslint-disable-next-line max-len
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

          // This is kind of bad. I really just want to look at all the milestones
          // and find the most recent, so DFS would be better?
          const milestone = decisionPoints.flatMap(
            (dp) => dp.milestones?.reduce(compareMilestones, undefined),
          ).reduce(compareMilestones, undefined);
          if (milestone) lastMilestoneName = milestone.milestoneType.name;
        }

        return (
          <tr className="border-0" key={ `patient-list-key${n.id}` }>
            <td className="">{lastMilestoneName}</td>
            <td className="">{linkFactory(n)}</td>
            <td className="d-none d-md-table-cell">{n.hospitalNumber}</td>
            <td className="d-none d-lg-table-cell">{n.dateOfBirth?.toLocaleDateString()}</td>
          </tr>
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
