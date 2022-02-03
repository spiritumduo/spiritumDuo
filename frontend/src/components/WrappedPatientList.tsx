/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import client from 'app/sdApolloClient';
import { gql, useQuery } from '@apollo/client';
import PatientList from 'components/PatientList';
import { getPatientOnPathwayConnection, getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node, getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_decisionPoints_milestones } from 'components/__generated__/getPatientOnPathwayConnection';

export const GET_PATIENT_ON_PATHWAY_CONNECTION_QUERY = gql`
  query getPatientOnPathwayConnection(
    $pathwayId:ID!, $first:Int, $after: String, $outstanding: Boolean, $underCareOf: Boolean
  ){
    getPatientOnPathwayConnection(
      pathwayId:$pathwayId, first:$first, after: $after, outstanding: $outstanding, underCareOf: $underCareOf
    ) {
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
          onPathways(pathwayId: $pathwayId) {
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
  pathwayId: string, first: number, outstanding: boolean, underCareOf: boolean, cursor?: string,
) => useQuery<getPatientOnPathwayConnection>(
  GET_PATIENT_ON_PATHWAY_CONNECTION_QUERY, {
    variables: {
      pathwayId: pathwayId,
      first: first,
      after: cursor,
      outstanding: outstanding,
      underCareOf: underCareOf,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
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
}

const WrappedPatientList = ({
  pathwayId,
  patientsToDisplay,
  linkFactory,
  outstanding = true,
  underCareOf = false,
}: WrappedPatientListProps): JSX.Element => {
  const {
    loading,
    error,
    data,
    fetchMore,
  } = usePatientsForPathwayQuery(pathwayId, patientsToDisplay, outstanding, underCareOf);
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
            currentMilestone: GraphQLMilestone | undefined,
            mostRecentCompletedMilestone: GraphQLMilestone | undefined,
          ) => (
            currentMilestone?.currentState === 'COMPLETED'
            && currentMilestone.updatedAt > mostRecentCompletedMilestone?.updatedAt
              ? currentMilestone
              : mostRecentCompletedMilestone
          );

          // This is kind of bad. I really just want to look at all the milestones
          // and find the most recent, so DFS would be better?
          const milestone = decisionPoints.flatMap(
            (dp) => dp.milestones?.reduce(compareMilestones, undefined),
          ).reduce(compareMilestones, undefined);
          if (milestone) lastMilestoneName = milestone.milestoneType.name;
        }
        return (
          <div className="row justify-content-start" key={ n.id }>
            <div className="col-2">{lastMilestoneName}</div>
            <div className="col-2">{ linkFactory(n) }</div>
            <div className="col-2">{n.hospitalNumber}</div>
            <div className="col-5">{n.dateOfBirth?.toLocaleDateString()}</div>
          </div>
        );
      },
    );
  } else {
    listElements = [<div key="emptyListElement" />];
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
