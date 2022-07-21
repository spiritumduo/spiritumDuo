import React, { useMemo, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import edgesToNodes from 'app/pagination';

import PathwayVisualisation, { PATIENT_PARTS_FOR_GRP, patientToVisData, PatientVisData } from 'components/PathwayVisualisation';
import { ParentSize } from '@visx/responsive';
import ReactPaginate from 'react-paginate';

import { useAppDispatch } from 'app/hooks';
import { setModalPatientHospitalNumber } from 'pages/HomePage.slice';
import { getPatientOnPathwayConnectionForGrp } from './__generated__/getPatientOnPathwayConnectionForGrp';

export const GET_PATIENT_ON_PATHWAY_CONNECTION_QUERY = gql`
  ${PATIENT_PARTS_FOR_GRP}
  query getPatientOnPathwayConnectionForGrp(
    $outstanding: Boolean, $pathwayId:ID!, $first:Int!, $after: String, $underCareOf: Boolean, $includeDischarged: Boolean
  ) {
    getPatientOnPathwayConnection(
      outstanding: $outstanding, pathwayId:$pathwayId, first:$first, after: $after, underCareOf: $underCareOf, includeDischarged: $includeDischarged
    ) @connection(
        key: "getPatientOnPathwayConnectionForGrp",
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
          ...GrpPatientFields
        }
      }
    }
  }
`;

interface PatientPathwayListProps {
  outstanding?: boolean;
  pathwayId: string;
  patientsToDisplay: number;
  underCareOf?: boolean;
  includeDischarged?: boolean;
}

const PatientPathwayList = ({
  outstanding, pathwayId, patientsToDisplay, underCareOf, includeDischarged,
}: PatientPathwayListProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [maxFetchedPage, setMaxFetchedPage] = useState(0);
  const { loading, error, data, fetchMore } = useQuery<getPatientOnPathwayConnectionForGrp>(
    GET_PATIENT_ON_PATHWAY_CONNECTION_QUERY,
    { variables: {
      pathwayId: pathwayId,
      outstanding: outstanding,
      first: patientsToDisplay,
      underCareOf: underCareOf,
      includeDischarged: includeDischarged,
    } },
  );

  const dispatch = useAppDispatch();

  type PatientNode = getPatientOnPathwayConnectionForGrp['getPatientOnPathwayConnection']['edges'][0]['node'];
  const { nodes, pageCount, pageInfo } = edgesToNodes<PatientNode>(
    data?.getPatientOnPathwayConnection, currentPage, patientsToDisplay,
  );

  const patientData = useMemo(() => nodes?.map((n) => patientToVisData(n)), [nodes]);
  const rowClicked = (patient: PatientVisData): void => {
    dispatch(setModalPatientHospitalNumber(patient.hospitalNumber));
  };
  if (patientData) {
    return (
      <div>
        <ParentSize>
          {({ width: parentWidth }) => (
            <PathwayVisualisation
              data={ patientData }
              maxDays={ 80 }
              onClick={ rowClicked }
              showName
              // showNationalNumber
              width={ parentWidth }
              margin={ { top: 40, right: 15, bottom: 30, left: 15 } }
            />
          )}
        </ParentSize>
        <ReactPaginate
          previousLabel="previous"
          nextLabel="next"
          breakLabel="..."
          breakClassName="break-me"
          pageCount={ Math.ceil(pageCount) }
          marginPagesDisplayed={ 2 }
          pageRangeDisplayed={ 5 }
          onPageChange={ ({ selected }) => {
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
          containerClassName="pagination justify-content-center"
          activeClassName="bkcolour-nhs-blue"
          pageClassName="page-item"
          previousClassName="page-item"
          nextClassName="page-item"
          previousLinkClassName="page-link colour-nhs-blue paginator-button"
          nextLinkClassName="page-link colour-nhs-blue paginator-button"
          pageLinkClassName="page-link colour-nhs-blue paginator-button"
          activeLinkClassName="bkcolour-nhs-blue text-white paginator-button"
        />
      </div>
    );
  }
  return <div>Loading</div>;
};

export default PatientPathwayList;
