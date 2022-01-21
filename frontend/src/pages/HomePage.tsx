/* eslint-disable camelcase */
import React, { useContext, useState } from 'react';
import './homepage.css';
import Patient from 'types/Patient';
import PatientList from 'components/PatientList';
import { DecisionPointType } from 'types/DecisionPoint';
import { getPatientOnPathwayConnection, getPatientOnPathwayConnection_getPatientOnPathwayConnection_edges_node_onPathways_decisionPoints_milestones } from 'pages/__generated__/getPatientOnPathwayConnection';
import { PatientLink } from 'components/Link';
import { PathwayContext } from 'app/context';
import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

export const GET_PATIENT_ON_PATHWAY_CONNECTION_QUERY = gql`
  query getPatientOnPathwayConnection(
    $pathwayId:ID!, $awaitingDecisionType:DecisionType!,
    $first:Int, $after: String
  ){
    getPatientOnPathwayConnection(
      pathwayId:$pathwayId, awaitingDecisionType:$awaitingDecisionType,
      first:$first, after: $after
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
  pathwayId: string, awaitingDecisionType: DecisionPointType,
  first: number, cursor?: string,
) => useQuery<getPatientOnPathwayConnection>(
  GET_PATIENT_ON_PATHWAY_CONNECTION_QUERY, {
    variables: {
      pathwayId: pathwayId,
      awaitingDecisionType: awaitingDecisionType,
      first: first,
      after: cursor,
    },
    notifyOnNetworkStatusChange: true,
  },
);

export interface HomePageProps {
  patientsPerPage: number;
}

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

const WrappedPatientList = ({
  pathwayId,
  patientsPerPage,
  decisionPointType,
}: {
  pathwayId: number,
  patientsPerPage: number,
  decisionPointType: DecisionPointType,
}): JSX.Element => {
  const {
    loading,
    error,
    data,
    fetchMore,
  } = usePatientsForPathwayQuery(pathwayId.toString(), decisionPointType, patientsPerPage);
  const [maxFetchedPage, setMaxFetchedPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const { nodes, pageCount, pageInfo } = edgesToNodes(data, currentPage, patientsPerPage);
  let listElements: JSX.Element[];
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
            <div className="col-2"><Link to={ `/decision/triage/${n.hospitalNumber}` }>{ `${n?.firstName} ${n?.lastName}` }</Link></div>
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

const HomePage = ({ patientsPerPage }: HomePageProps): JSX.Element => {
  const { currentPathwayId } = useContext(PathwayContext);
  const pathwayId = currentPathwayId || 1;

  return (
    <div className="container">
      <div className="row mt-1 justify-content-start">
        <div className="col">
          <h3>Oustanding Decisions</h3>
          <WrappedPatientList
            pathwayId={ pathwayId }
            patientsPerPage={ patientsPerPage }
            decisionPointType={ DecisionPointType.TRIAGE }
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
