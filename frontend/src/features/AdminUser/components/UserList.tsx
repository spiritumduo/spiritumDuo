import React, { useState } from 'react';
import { Table } from 'nhsuk-react-components';
import ReactPaginate from 'react-paginate';
import { gql, useQuery } from '@apollo/client';
import edgesToNodes from 'app/pagination';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';

import { UserListQuery } from './__generated__/UserListQuery';

export const GET_USER_CONNECTION_QUERY = gql`
  query UserListQuery($first: Int $after: String) {
    getUserConnection(first: $first, after: $after) {
      totalCount
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          firstName
          lastName
          department
        }
        cursor
      }
    }
  }
`;

export interface UserListProps {
  userOnClick: (id: string) => void;
}

export const UserList = ({ userOnClick }: UserListProps): JSX.Element => {
  const { loading, error, data, fetchMore } = useQuery<UserListQuery>(
    GET_USER_CONNECTION_QUERY, {
      variables: {
        first: '10',
      },
    },
  );
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [maxFetchedPage, setMaxFetchedPage] = useState<number>(0);
  type UserNodeType = UserListQuery['getUserConnection']['edges'][0]['node'];

  const { nodes, pageCount, pageInfo } = edgesToNodes<UserNodeType>(
    data?.getUserConnection, currentPage, 10,
  );

  const updateData = ({ selected }: { selected: number }) => {
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
  };

  return (
    <LoadingSpinner loading={ loading }>
      <div className="nhsuk-u-visually-hidden" id="pt_todo_list_aria">Patient to-do list</div>
      <div className="nhsuk-u-visually-hidden" id="pt_click_hint_aria">Click to open patient</div>
      <Table responsive role="grid" aria-describedby="pt_todo_list_aria" aria-label="patient list">
        <Table.Head>
          <Table.Row>
            <Table.Cell>Name</Table.Cell>
            <Table.Cell>Department</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          { nodes?.map((u) => (
            <Table.Row
              onClick={ () => userOnClick(u.id) }
              tabIndex={ 0 }
              key={ `patient-list-key${u.id}` }
            >
              <Table.Cell tabIndex={ 0 } aria-describedby="editText">
                <div>
                  <button
                    className="sd-hidden-button"
                    type="button"
                    tabIndex={ 0 }
                    onClick={ () => userOnClick(u.id) }
                    role="link"
                  >
                    {`${u.firstName} ${u.lastName}`}
                  </button>
                </div>
              </Table.Cell>
              <Table.Cell tabIndex={ -1 } aria-describedby="editText">{u.department}</Table.Cell>
            </Table.Row>
          ) ) }
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
        onPageChange={ updateData }
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
  );
};
