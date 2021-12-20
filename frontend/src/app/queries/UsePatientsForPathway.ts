import { gql, useQuery } from '@apollo/client';
import { DecisionPointType } from 'types/DecisionPoint';
import { getPatientOnPathwayConnection } from 'app/queries/__generated__/getPatientOnPathwayConnection';

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

export default usePatientsForPathwayQuery;
