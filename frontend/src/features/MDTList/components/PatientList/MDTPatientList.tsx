import React, { useEffect, useMemo, useState } from 'react';

// LIBRARIES
import { Container, ErrorMessage, Table } from 'nhsuk-react-components';
import ReactPaginate from 'react-paginate';
import { gql, useMutation, useQuery } from '@apollo/client';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

// APP
import edgesToNodes from 'app/pagination';

// COMPONENTS
import { useHospitalNumberFormat, useNationalNumberFormat } from 'app/hooks/format-identifier';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import ModalPatient, { ModalPatientTab } from 'components/ModalPatient';
import OnMdtManagement from '../OnMdtManagement/OnMdtManagement';

// LOCAL IMPORTS
import { getOnMdtConnectionQuery } from './__generated__/getOnMdtConnectionQuery';
import { lockOnMdtForManagement } from './__generated__/lockOnMdtForManagement';
import { reorderOnMdt, reorderOnMdtVariables } from './__generated__/reorderOnMdt';

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
          order
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

export const REORDER_ON_MDT_MUTATION = gql`
  mutation reorderOnMdt($input: UpdateOnMdtListInput!) {
    updateOnMdtList(input: $input) {
      onMdtList {
        id
        order
      }
    }
  }
`;

export const LOCK_ON_MDT_MUTATION = gql`
  mutation lockOnMdtForManagement(
    $id: ID!
    $unlock: Boolean!
  ){
    lockOnMdt(
      input:{
        id: $id,
        unlock: $unlock
      }
    ){
      onMdt{
        id
        lockEndTime
        lockUser{
          id
          username
          firstName
          lastName
        }
      }
      userErrors{
        field
        message
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

interface OnMdtElement {
  id: string;
  onMdtId: string;
  firstName: string;
  lastName: string;
  hospitalNumber: string;
  nationalNumber: string;
  dateOfBirth: Date;
  mdtReason: string;
}

const reorder = (list: OnMdtElement[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

type MDTPatientListProps = {
  mdtId: string;
};

const MDTPatientList = ({ mdtId }: MDTPatientListProps): JSX.Element => {
  const [maxFetchedPage, setMaxFetchedPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [tableElements, setTableElements] = useState<OnMdtElement[]>([]);
  const [selectedOnMdt, setSelectedOnMdt] = useState<OnMdtElement | null>(null);
  const [selectedOnMdtToManage, setSelectedOnMdtToManage] = useState<OnMdtElement | null>(null);
  const [hasLock, setHasLock] = useState<string | null>(null);
  const hospitalNumberFormat = useHospitalNumberFormat();
  const nationalNumberFormat = useNationalNumberFormat();

  const [
    lockMutation, { data: lockData, error: lockError, loading: lockLoading },
  ] = useMutation<lockOnMdtForManagement>(LOCK_ON_MDT_MUTATION);

  const [
    reorderMutation, { data: reorderData, error: reorderError, loading: reorderLoading },
  ] = useMutation<reorderOnMdt>(REORDER_ON_MDT_MUTATION);

  useEffect(() => {
    if (selectedOnMdtToManage) {
      lockMutation({
        variables: {
          id: selectedOnMdtToManage.onMdtId,
          unlock: false,
        },
      });
    } else if (hasLock) {
      lockMutation({
        variables: {
          id: hasLock,
          unlock: true,
        },
      });
    }
  }, [lockMutation, selectedOnMdtToManage]);

  useEffect(() => {
    if (lockData?.lockOnMdt?.onMdt?.id && !lockData?.lockOnMdt?.userErrors) {
      setHasLock(lockData.lockOnMdt.onMdt.id);
    } else {
      setHasLock(null);
    }
  }, [lockData]);

  const {
    loading,
    error,
    data,
    fetchMore,
    refetch,
  } = useGetOnMdtConnectionQuery(mdtId || '0', 10);

  const { nodes, pageCount, pageInfo } = useMemo(() => edgesToNodes<getOnMdtConnectionQuery['getOnMdtConnection']['edges'][0]['node']>(
    data?.getOnMdtConnection, currentPage, 10,
  ), [currentPage, data?.getOnMdtConnection]);

  useEffect(() => {
    if (nodes) {
      const te = nodes.flatMap((node) => {
        if (!node) return [];
        return {
          id: node.patient.id,
          onMdtId: node.id,
          firstName: node.patient.firstName,
          lastName: node.patient.lastName,
          hospitalNumber: node.patient.hospitalNumber,
          nationalNumber: node.patient.nationalNumber,
          dateOfBirth: node.patient.dateOfBirth,
          mdtReason: node.reason,
          order: node.order,
        };
      });
      te.sort((a, b) => a.order - b.order);
      setTableElements(te);
    }
  }, [nodes]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    if (result.source.index === result.destination.index) {
      return;
    }
    const reordered = reorder(tableElements, result.source.index, result.destination.index);
    setTableElements(reordered);
    const newOrder: reorderOnMdtVariables = {
      input: {
        onMdtList: reordered.map((e, i) => ({
          id: e.onMdtId,
          order: i,
        })),
      },
    };
    reorderMutation({ variables: newOrder });
  };

  return (
    <Container>
      {
        selectedOnMdt
          ? (
            <ModalPatient
              hospitalNumber={ selectedOnMdt.hospitalNumber }
              defaultTab={ ModalPatientTab.MDT }
              mdtId={ mdtId }
              closeCallback={ () => setSelectedOnMdt(null) }
              lock
            />
          )
          : undefined
      }
      {
        lockData?.lockOnMdt?.userErrors?.map((e) => (
          <ErrorMessage key={ e.field }>{e.message}</ErrorMessage>
        ))
      }
      {
        selectedOnMdtToManage && hasLock
          ? (
            <OnMdtManagement
              onMdt={ selectedOnMdtToManage }
              closeCallback={ () => setSelectedOnMdtToManage(null) }
              refetch={ () => refetch() }
            />
          )
          : ''
      }
      <LoadingSpinner loading={ loading }>
        {
          error
            ? <ErrorMessage>{error.message}</ErrorMessage>
            : ''
        }
        <Table role="grid" aria-describedby="pt_todo_list_aria" aria-label="patient list">
          <Table.Head>
            <Table.Row>
              <Table.Cell>Name</Table.Cell>
              <Table.Cell>Patient number</Table.Cell>
              <Table.Cell>National number</Table.Cell>
              <Table.Cell>Date of birth</Table.Cell>
              <Table.Cell>Reason added</Table.Cell>
              <Table.Cell>&nbsp;</Table.Cell>
            </Table.Row>
          </Table.Head>
          <DragDropContext onDragEnd={ onDragEnd }>
            <Droppable droppableId="mdt-patient-list">
              { (droppableProvided) => (
                <tbody
                  { ...droppableProvided.droppableProps }
                  ref={ droppableProvided.innerRef }
                  className="nhsuk-table__body"
                >
                  { tableElements.map((element, index) => (
                    <Draggable
                      key={ element.id }
                      draggableId={ element.id }
                      index={ index }
                    >
                      { (draggableProvided) => (
                        <tr
                          { ...draggableProvided.draggableProps }
                          { ...draggableProvided.dragHandleProps }
                          className="active nhsuk-table__row"
                          onClick={ () => setSelectedOnMdt(element) }
                          ref={ draggableProvided.innerRef }
                        >
                          <td>
                            <button
                              type="button"
                              role="link"
                              className="sd-hidden-button"
                            >
                              {`${element.firstName} ${element.lastName}`}
                            </button>
                          </td>
                          <td>
                            {hospitalNumberFormat(element.hospitalNumber)}
                          </td>
                          <td>{nationalNumberFormat(element.nationalNumber)}</td>
                          <td>{new Date(element.dateOfBirth).toLocaleDateString()}</td>
                          <td>{element.mdtReason}</td>
                          <td>
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
                              onClick={ (e) => {
                                e.stopPropagation();
                                setSelectedOnMdtToManage(element);
                              } }
                            >
                              edit
                            </button>
                          </td>
                        </tr>
                      ) }
                    </Draggable>
                  ))}
                  { droppableProvided.placeholder }
                </tbody>
              )}
            </Droppable>
          </DragDropContext>
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

export default MDTPatientList;
