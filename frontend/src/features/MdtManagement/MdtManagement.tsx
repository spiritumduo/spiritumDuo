import React from 'react';
import { Modal } from 'react-bootstrap';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { BsX } from 'react-icons/bs';
import { gql, useQuery } from '@apollo/client';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from 'nhsuk-react-components';

import UpdateMdtTab from './tabpages/UpdateMdtTab';
import DeleteMdtTab from './tabpages/DeleteMdtTab';
import { getMdt } from './__generated__/getMdt';

export const GET_MDT_QUERY = gql`
  query getMdt($id: ID!){
    getMdt(id: $id){
      id
      pathway{
        id
        name
      }
      creator{
        id
        username
        firstName
        lastName
      }
      createdAt
      plannedAt
      updatedAt
      location
    }
  }
`;

interface MDTListPageProps{
  showModal: boolean
  setShowModal: ((arg0: boolean) => void)
  mdtId: string
  refetch?: () => void
}

const MDTManagementPage = (
  { showModal, setShowModal, mdtId, refetch }: MDTListPageProps,
): JSX.Element => {
  const { data, loading, error } = useQuery<getMdt>(GET_MDT_QUERY, {
    variables: {
      id: mdtId,
    },
  });

  return (
    <Modal size="lg" show={ !!(showModal && data?.getMdt) } onHide={ () => setShowModal(false) }>
      <Modal.Header>
        <Modal.Title>MDT Management</Modal.Title>
        <button
          type="button"
          className="bg-transparent"
          name="Close"
          style={ { border: 'none' } }
          onClick={ () => setShowModal(false) }
        >
          <p className="nhsuk-u-visually-hidden">Close</p>
          <BsX size="2rem" />
        </button>
      </Modal.Header>
      <Modal.Body>
        {
          error
            ? <ErrorMessage>{error.message}</ErrorMessage>
            : ''
        }
        <LoadingSpinner loading={ loading }>
          <Tabs>
            <TabList>
              <Tab>Update MDT</Tab>
              <Tab>Delete MDT</Tab>
            </TabList>
            <TabPanel>
              {
                data?.getMdt
                  ? (
                    <UpdateMdtTab
                      mdt={ data.getMdt }
                      successCallback={ () => { setShowModal(false); if (refetch) refetch(); } }
                    />
                  )
                  : ''
              }
            </TabPanel>
            <TabPanel>
              {
                data?.getMdt
                  ? (
                    <DeleteMdtTab
                      mdt={ data.getMdt }
                      successCallback={ () => { setShowModal(false); if (refetch) refetch(); } }
                    />
                  )
                  : ''
              }
            </TabPanel>
          </Tabs>
        </LoadingSpinner>
      </Modal.Body>
    </Modal>
  );
};

export default MDTManagementPage;
