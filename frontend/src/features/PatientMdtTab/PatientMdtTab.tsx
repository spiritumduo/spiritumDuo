import React, { useContext, useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { AuthContext, PathwayContext } from 'app/context';
import edgesToNodes from 'app/pagination';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { CheckboxBox, Textarea } from 'components/nhs-style';
import { ErrorMessage, Table } from 'nhsuk-react-components';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import ReactPaginate from 'react-paginate';
import { lockOnMdt } from './__generated__/lockOnMdt';
import { updateOnMdtForPtModal } from './__generated__/updateOnMdtForPtModal';
import { getOnMdtConnection } from './__generated__/getOnMdtConnection';

export const GET_PATIENT_ON_MDT_CONNECTION_QUERY = gql`
  query getOnMdtConnection(
    $patientId: ID!
    $pathwayId: ID!
    $first: Int!
    $after: String
  ){
    getOnMdtConnection(
      patientId: $patientId
      pathwayId: $pathwayId
      first: $first
      after: $after
    ) @connection(
        key: "getOnMdtConnection",
        filter: ["patientId", "pathwayId"]
    ){
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges{
        cursor
        node{
          id
          outcome
          reason
          clinicalRequest{
            id
            currentState
          }
          mdt{
            id
            plannedAt
            creator{
              id
              firstName
              lastName
            }
          }
        }
      }
    }
  }
`;

export const LOCK_ON_MDT_MUTATION = gql`
  mutation lockOnMdt(
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

export const UPDATE_ON_MDT_MUTATION = gql`
  mutation updateOnMdtForPtModal($input: UpdateOnMdtInput!){
    updateOnMdt(input: $input){
      onMdt{
        id
      }
      userErrors{
        field
        message
      }
    }
  }
`;

const useGetOnMdtConnection = (
  patientId: string, pathwayId: string, first: number, after?: string,
) => useQuery<getOnMdtConnection>(
  GET_PATIENT_ON_MDT_CONNECTION_QUERY, {
    variables: {
      patientId: patientId,
      pathwayId: pathwayId,
      first: first,
      after: after,
    },
  },
);

interface OnMdtElementType {
  onMdtId: string;
  reason: string;
  outcome: string | null;
  plannedAt: Date;
  creator: {
    firstName: string;
    lastName: string;
  };
  actioned: boolean;
}

const schema = yup.object({
  id: yup.number().positive().required(),
  reason: yup.string().required('A reason is required'),
  outcome: yup.string(),
});

interface PatientMdtTabProps{
  patientId?: string;
}

const PatientMdtTab = ({ patientId }: PatientMdtTabProps) => {
  const [maxFetchedPage, setMaxFetchedPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const { currentPathwayId } = useContext(PathwayContext);
  const [editingRow, setEditingRow] = useState<OnMdtElementType | null>(null);
  const [hasEditingRowLock, setHasRowEditingLock] = useState<string | null>(null);
  const { user } = useContext(AuthContext);

  const [
    lockMutation, { data: lockData, error: lockError, loading: lockLoading },
  ] = useMutation<lockOnMdt>(LOCK_ON_MDT_MUTATION);

  const [
    updateMutation, { data: updateData, error: updateError, loading: updateLoading },
  ] = useMutation<updateOnMdtForPtModal>(UPDATE_ON_MDT_MUTATION);

  const {
    loading,
    error,
    data,
    fetchMore,
    refetch,
  } = useGetOnMdtConnection(patientId || '0', currentPathwayId || '0', 10);

  interface UpdateOnMdtForm {
    id: string;
    reason: string;
    outcome?: string;
    actioned: boolean;
  }

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    getValues,
    setValue,
    reset,
  } = useForm<UpdateOnMdtForm>({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (updateData) {
      setEditingRow(null);
    }
  }, [updateData]);

  useEffect(() => {
    if (editingRow && hasEditingRowLock === null) {
      lockMutation({ variables: {
        id: editingRow.onMdtId,
        unlock: false,
      } });
    } else if (editingRow === null && hasEditingRowLock) {
      lockMutation({ variables: {
        id: hasEditingRowLock,
        unlock: true,
      } });
    }
  }, [hasEditingRowLock, editingRow, lockMutation, setValue, refetch]);

  useEffect(
    () => reset({
      id: editingRow?.onMdtId,
      reason: editingRow?.reason,
      outcome: editingRow?.outcome || '',
    }),
    [editingRow, reset],
  );

  useEffect(() => {
    if (lockData?.lockOnMdt?.onMdt?.id && lockData?.lockOnMdt?.onMdt?.lockUser?.id === user?.id) {
      setHasRowEditingLock(lockData.lockOnMdt.onMdt.id);
      setValue('id', lockData?.lockOnMdt?.onMdt?.id);
    } else {
      setHasRowEditingLock(null);
    }
  }, [lockData, setValue, user?.id]);

  const { nodes, pageCount, pageInfo } = edgesToNodes<getOnMdtConnection['getOnMdtConnection']['edges'][0]['node']>(
    data?.getOnMdtConnection, currentPage, 10,
  );

  let tableElements: OnMdtElementType[] = [];

  if (nodes) {
    tableElements = nodes.flatMap((node) => ({
      onMdtId: node.id,
      reason: node.reason,
      outcome: node.outcome || null,
      plannedAt: node.mdt.plannedAt,
      creator: {
        firstName: node.mdt.creator.firstName,
        lastName: node.mdt.creator.lastName,
      },
      actioned: node.clinicalRequest.currentState === 'COMPLETED',
    }));
  }
  async function onSaveFn(variables: UpdateOnMdtForm) {
    updateMutation({ variables: {
      input: {
        id: variables.id,
        reason: variables.reason,
        outcome: variables.outcome,
      },
    } });
    await refetch();
  }

  return (
    <>
      <LoadingSpinner loading={ loading }>
        {
          error
            ? <ErrorMessage>{error.message}</ErrorMessage>
            : ''
        }
        {
          lockError
            ? <ErrorMessage>{lockError.message} </ErrorMessage>
            : ''
        }
        {
          lockData?.lockOnMdt?.userErrors?.map((err) => (
            <ErrorMessage key={ err.field }>{ err.message }</ErrorMessage>
          ))
        }
        <form onSubmit={ handleSubmit(() => onSaveFn(getValues()) ) }>
          <input type="hidden" value={ hasEditingRowLock || '' } { ...register('id') } />
          <Table>
            <Table.Head>
              <Table.Cell>Date</Table.Cell>
              <Table.Cell>Requested by</Table.Cell>
              <Table.Cell>Review reason</Table.Cell>
              <Table.Cell>Outcome</Table.Cell>
              <Table.Cell>Actioned</Table.Cell>
              <Table.Cell>&nbsp;</Table.Cell>
            </Table.Head>
            <Table.Body>
              {
                tableElements.map((element) => (
                  <Table.Row key={ element.onMdtId }>
                    <Table.Cell>
                      { new Date(element.plannedAt).toLocaleDateString() }
                    </Table.Cell>
                    <Table.Cell>
                      { `${element.creator.firstName} ${element.creator.lastName}` }
                    </Table.Cell>
                    <Table.Cell>
                      {
                        (editingRow?.onMdtId === element.onMdtId && hasEditingRowLock)
                          ? <Textarea defaultValue={ element.reason } { ...register('reason') } error={ formErrors.reason?.message } />
                          : element.reason
                      }
                    </Table.Cell>
                    <Table.Cell>
                      {
                        (editingRow?.onMdtId === element.onMdtId && hasEditingRowLock)
                          ? <Textarea defaultValue={ element.outcome || '' } { ...register('outcome') } />
                          : element.outcome
                      }
                    </Table.Cell>
                    <Table.Cell>
                      <CheckboxBox
                        disabled
                        defaultChecked={ element.actioned }
                      >
                        &nbsp;
                      </CheckboxBox>
                    </Table.Cell>
                    <Table.Cell>
                      {
                        editingRow === null || hasEditingRowLock === null
                          ? (
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
                              onClick={ () => setEditingRow(element) }
                            >
                              {
                                lockLoading || updateLoading
                                  ? 'loading'
                                  : 'edit'
                              }
                            </button>
                          )
                          : ''
                      }
                      {
                        editingRow?.onMdtId === element.onMdtId && hasEditingRowLock
                          ? (
                            <>
                              <button
                                type="submit"
                                style={ {
                                  background: 'none',
                                  border: 'none',
                                  padding: '0',
                                  color: '#069',
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                } }
                              >
                                save
                              </button>
                              <br />
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
                                onClick={ () => setEditingRow(null) }
                              >
                                cancel
                              </button>
                            </>
                          )
                          : ''
                      }
                    </Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
        </form>
      </LoadingSpinner>
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
    </>
  );
};

export default PatientMdtTab;
