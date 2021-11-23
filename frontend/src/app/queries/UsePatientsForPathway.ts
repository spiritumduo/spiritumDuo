import { gql, useQuery } from '@apollo/client';
import { DecisionPointType } from 'types/DecisionPoint';
import { getPatientOnPathwayConnection } from 'app/queries/__generated__/getPatientOnPathwayConnection';

export const PATIENTS_FOR_PATHWAY_QUERY = gql`
  query getPatientOnPathwayConnection(
    $pathwayId:ID!, $awaitingDecisionType:DecisionPointType!,
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
  pathwayId: number, awaitingDecisionType: DecisionPointType,
  first: number,
) => useQuery<getPatientOnPathwayConnection>(
  PATIENTS_FOR_PATHWAY_QUERY, {
    variables: {
      pathwayId: pathwayId,
      awaitingDecisionType: awaitingDecisionType,
      first: first,
    },
  },
);

export default usePatientsForPathwayQuery;
