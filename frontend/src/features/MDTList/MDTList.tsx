import React, { useState } from 'react';
import { Button, ErrorMessage, Table } from 'nhsuk-react-components';
import { gql, useQuery } from '@apollo/client';
import ReactPaginate from 'react-paginate';

import LoadingSpinner from 'components/LoadingSpinner';
import edgesToNodes from 'app/pagination';

import MdtManagementModal from 'features/MDTList/components/MdtManagement/MdtManagementModal';
import CreateMdtModal from 'features/MDTList/components/CreateMdtModal/CreateMdtModal';

import MDT from 'types/MDT';
import Patient from 'types/Patient';
import User from 'types/Users';

import { getMdtConnectionQuery } from './__generated__/getMdtConnectionQuery';
import MDTPatientList from './components/PatientList/MDTPatientList';

export const GET_MDT_CONNECTION_QUERY = gql`
  query getMdtConnectionQuery(
    $first: Int, $after: String, $pathwayId: ID!
  ) {
    getMdtConnection(
      first: $first, after: $after, pathwayId: $pathwayId
    ) @connection(
        key: "getMdtConnection",
        filter: ["pathwayId"]
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
          patients {
            id
            firstName
            lastName
            hospitalNumber
          }
          clinicians {
            id
            firstName
            lastName
            username
          }
          createdAt
          plannedAt
          updatedAt
          location
        }
      }
    }
  }
`;

const useGetMdtConnectionQuery = (
  pathwayId: string, first: number, after?: string,
) => useQuery<getMdtConnectionQuery>(
  GET_MDT_CONNECTION_QUERY, {
    variables: {
      pathwayId: pathwayId,
      first: first,
      after: after,
    },
  },
);

type MDTListProps = {
  pathwayId: string;
  selectedMdt: MDT | null;
  setSelectedMdt: (mdt: MDT | null) => void;
};

const MDTList = ({ pathwayId, selectedMdt, setSelectedMdt }: MDTListProps) => {
  const [selectedMdtToManage, setSelectedMdtToManage] = useState<MDT | null>();
  const [showCreateMdtModal, setShowCreateMdtModal] = useState<boolean>(false);
  const [maxFetchedPage, setMaxFetchedPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const {
    loading,
    error,
    data,
    fetchMore,
    refetch,
  } = useGetMdtConnectionQuery(pathwayId, 10);

  const { nodes, pageCount, pageInfo } = edgesToNodes<getMdtConnectionQuery['getMdtConnection']['edges'][0]['node']>(
    data?.getMdtConnection, currentPage, 10,
  );

  let tableElements: {
    id: string; plannedAt: Date; location: string;
    patients: Patient[]; clinicians: User[];
  }[] = [];

  if (nodes) {
    tableElements = nodes.flatMap((node) => {
      if (!node) return [];
      return {
        id: node.id,
        plannedAt: node.plannedAt,
        location: node.location,
        patients: node.patients as unknown as Patient[],
        clinicians: node.clinicians as unknown as User[],
      };
    });
  }

  if (selectedMdt) {
    return (
      <MDTPatientList
        mdtId={ selectedMdt.id }
      />
    );
  }

  return (
    <>
      <CreateMdtModal
        showModal={ showCreateMdtModal }
        setShowModal={ setShowCreateMdtModal }
      />
      {
        selectedMdtToManage ? (
          <MdtManagementModal
            closeCallback={ () => setSelectedMdtToManage(null) }
            mdt={ selectedMdtToManage }
            onSuccess={ () => refetch() }
          />
        ) : null
      }
      <Button secondary className="my-3" onClick={ () => setShowCreateMdtModal(true) }>Create MDT</Button>

      <LoadingSpinner loading={ loading }>
        {
          error
            ? <ErrorMessage>{error.message}</ErrorMessage>
            : ''
        }
        <Table responsive role="grid" aria-describedby="pt_todo_list_aria" aria-label="patient list">
          <Table.Head>
            <Table.Row>
              <Table.Cell>Date</Table.Cell>
              <Table.Cell>Clinicians present</Table.Cell>
              <Table.Cell>Location</Table.Cell>
              <Table.Cell>Number of patients</Table.Cell>
              <Table.Cell>&nbsp;</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {
              tableElements.map((element) => (
                <Table.Row key={ element.id } className="active">
                  <Table.Cell onClick={ () => setSelectedMdt(
                    nodes?.find((node) => node.id === element.id) as MDT,
                  ) }
                  >
                    <button
                      className="sd-hidden-button"
                      type="button"
                      tabIndex={ 0 }
                      onClick={ () => setSelectedMdt(
                        nodes?.find((node) => node.id === element.id) as MDT,
                      ) }
                      role="link"
                    >
                      {element.plannedAt.toLocaleDateString()}
                    </button>
                  </Table.Cell>
                  <Table.Cell onClick={ () => setSelectedMdt(
                    nodes?.find((node) => node.id === element.id) as MDT,
                  ) }
                  >
                    {element.clinicians.length}
                  </Table.Cell>
                  <Table.Cell onClick={ () => setSelectedMdt(
                    nodes?.find((node) => node.id === element.id) as MDT,
                  ) }
                  >
                    {element.location}
                  </Table.Cell>
                  <Table.Cell onClick={ () => setSelectedMdt(
                    nodes?.find((node) => node.id === element.id) as MDT,
                  ) }
                  >
                    {element.patients.length}
                  </Table.Cell>
                  <Table.Cell
                    onClick={ () => {
                      setSelectedMdtToManage(nodes?.find((node) => node.id === element.id) as MDT);
                    } }
                  >
                    <button
                      type="button"
                      style={ {
                        background: 'none',
                        border: 'none',
                        padding: '0',
                        color: '#069',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      } }
                    >
                      edit
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))
            }
          </Table.Body>
        </Table>
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
      </LoadingSpinner>
    </>
  );
};

export default MDTList;
