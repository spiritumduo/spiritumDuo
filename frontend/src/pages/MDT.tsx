import React, { useState } from 'react';
import { Breadcrumb, Container, ErrorMessage, Table } from 'nhsuk-react-components';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

import '../components/patientlist.css';
import { gql, useQuery } from '@apollo/client';
import edgesToNodes from 'app/pagination';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { getOnMdtConnectionQuery } from './__generated__/getOnMdtConnectionQuery';

export const GET_ON_PATIENTS_ON_MDT_CONNECTION_QUERY = gql`
  query getOnMdtConnectionQuery(
    $first: Int, $after: String, $id: ID!
  ) {
    getOnMdtConnection(
      first: $first, after: $after, mdtId: $id
    ) @connection(
        key: "getOnMdtConnection",
        filter: ["id"]
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
          reason
          patient{
              id
              firstName
              lastName
              hospitalNumber
              nationalNumber
              dateOfBirth
            }
        }
      }
    }
  }
`;

const useGetOnMdtConnectionQuery = (
  id: string, first: number, after?: string,
) => useQuery<getOnMdtConnectionQuery>(
  GET_ON_PATIENTS_ON_MDT_CONNECTION_QUERY, {
    variables: {
      id: id,
      first: first,
      after: after,
    },
  },
);

const MDTPage = (): JSX.Element => {
  const [maxFetchedPage, setMaxFetchedPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const { mdtId } = useParams();
  const navigate = useNavigate();
  if (!mdtId) {
    navigate('/mdt');
  }

  const {
    loading,
    error,
    data,
    fetchMore,
  } = useGetOnMdtConnectionQuery(mdtId || '0', 10);

  const { nodes, pageCount, pageInfo } = edgesToNodes<getOnMdtConnectionQuery['getOnMdtConnection']['edges'][0]['node']>(
    data?.getOnMdtConnection, currentPage, 10,
  );

  let tableElements: {
    id: string; firstName: string; lastName: string;
    hospitalNumber: string; nationalNumber: string;
    dateOfBirth: Date; mdtReason: string;
  }[] = [];

  if (nodes) {
    tableElements = nodes.flatMap((node) => {
      if (!node) return [];
      return {
        id: node.patient.id,
        firstName: node.patient.firstName,
        lastName: node.patient.lastName,
        hospitalNumber: node.patient.hospitalNumber,
        nationalNumber: node.patient.nationalNumber,
        dateOfBirth: node.patient.dateOfBirth,
        mdtReason: node.reason,
      };
    });
  }

  return (
    <Container>
      <Breadcrumb style={ { backgroundColor: 'transparent' } }>
        <Breadcrumb.Item href="../mdt">MDTs</Breadcrumb.Item>
        <Breadcrumb.Item href="">Patient list</Breadcrumb.Item>
      </Breadcrumb>
      <LoadingSpinner loading={ loading }>
        {
          error
            ? <ErrorMessage>{error.message}</ErrorMessage>
            : ''
        }
        <Table responsive role="grid" aria-describedby="pt_todo_list_aria" aria-label="patient list">
          <Table.Head>
            <Table.Row>
              <Table.Cell>Name</Table.Cell>
              <Table.Cell>Patient number</Table.Cell>
              <Table.Cell>National number</Table.Cell>
              <Table.Cell>Date of birth</Table.Cell>
              <Table.Cell>Reason added</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {
              tableElements.map((element) => (
                <Table.Row key={ element.id } className="active" onClick={ () => navigate(`/patient/${element.hospitalNumber}`) }>
                  <Table.Cell>{`${element.firstName} ${element.lastName}`}</Table.Cell>
                  <Table.Cell>{element.hospitalNumber}</Table.Cell>
                  <Table.Cell>{element.nationalNumber}</Table.Cell>
                  <Table.Cell>{new Date(element.dateOfBirth).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{element.mdtReason}</Table.Cell>
                </Table.Row>
              ))
            }
          </Table.Body>
        </Table>
      </LoadingSpinner>
      <br />
      <ReactPaginate
        previousLabel="previous"
        nextLabel="next"
        breakLabel="..."
        breakClassName="break-me"
        pageCount={ pageCount }
        marginPagesDisplayed={ 2 }
        pageRangeDisplayed={ 5 }
        onPageChange={ (({ selected }) => {
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
        }) }
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
    </Container>
  );
};

export default MDTPage;
