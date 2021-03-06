import React, { useContext, useState } from 'react';
import { Breadcrumb, Button, Container, ErrorMessage, Table } from 'nhsuk-react-components';
import ReactPaginate from 'react-paginate';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { useNavigate } from 'react-router';

import '../components/patientlist.css';
import CreateMdtModal from 'features/MdtManagement/CreateMdtModal/CreateMdtModal';
import MdtManagement from 'features/MdtManagement/MdtManagement';
import { gql, useQuery } from '@apollo/client';
import { PathwayContext } from 'app/context';
import edgesToNodes from 'app/pagination';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { getMdtConnectionQuery } from './__generated__/getMdtConnectionQuery';

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
          patients{
            id
          }
          clinicians{
            id
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

const MDTListPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [showManageMdtModal, setShowManageMdtModal] = useState<boolean>(false);
  const [selectedMdtId, setSelectedMdtId] = useState<string>('');
  const [showCreateMdtModal, setShowCreateMdtModal] = useState<boolean>(false);
  const { currentPathwayId } = useContext(PathwayContext);
  const [maxFetchedPage, setMaxFetchedPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const {
    loading,
    error,
    data,
    fetchMore,
    refetch,
  } = useGetMdtConnectionQuery(currentPathwayId ? currentPathwayId?.toString() : '0', 10);

  const { nodes, pageCount, pageInfo } = edgesToNodes<getMdtConnectionQuery['getMdtConnection']['edges'][0]['node']>(
    data?.getMdtConnection, currentPage, 10,
  );

  let tableElements: {
    id: string; plannedAt: Date; location: string;
    numPatients: number; numClinicians: number;
  }[] = [];

  if (nodes) {
    tableElements = nodes.flatMap((node) => {
      if (!node) return [];
      return {
        id: node.id,
        plannedAt: node.plannedAt,
        location: node.location,
        numPatients: node.patients.length,
        numClinicians: node.clinicians.length,
      };
    });
  }

  return (
    <Container>
      <Breadcrumb style={ { backgroundColor: 'transparent' } }>
        <Breadcrumb.Item href="">MDTs</Breadcrumb.Item>
      </Breadcrumb>
      <CreateMdtModal
        showModal={ showCreateMdtModal }
        setShowModal={ setShowCreateMdtModal }
        refetch={ refetch }
      />
      <MdtManagement
        showModal={ showManageMdtModal }
        setShowModal={ setShowManageMdtModal }
        mdtId={ selectedMdtId }
        refetch={ refetch }
      />
      <Button secondary className="my-3" onClick={ () => setShowCreateMdtModal(true) }>Create MDT</Button>
      <Tabs>
        <TabList>
          <Tab>MDT by date</Tab>
        </TabList>
        <TabPanel>
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
                      <Table.Cell onClick={ () => navigate(`/mdt/${element.id}`) }>{new Date(element.plannedAt).toLocaleDateString()}</Table.Cell>
                      <Table.Cell onClick={ () => navigate(`/mdt/${element.id}`) }>{element.numClinicians}</Table.Cell>
                      <Table.Cell onClick={ () => navigate(`/mdt/${element.id}`) }>{element.location}</Table.Cell>
                      <Table.Cell onClick={ () => navigate(`/mdt/${element.id}`) }>{element.numPatients}</Table.Cell>
                      <Table.Cell
                        onClick={ () => {
                          setSelectedMdtId(element.id);
                          setShowManageMdtModal(true);
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
          </LoadingSpinner>
        </TabPanel>
      </Tabs>
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

export default MDTListPage;
