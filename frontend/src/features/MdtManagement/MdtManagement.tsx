import React, { useContext, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { BsX } from 'react-icons/bs';
import { gql, useQuery } from '@apollo/client';
import { ErrorMessage } from 'nhsuk-react-components';

import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { PathwayContext } from 'app/context';

import UpdateMdtTab from './tabpages/UpdateMdtTab';
import DeleteMdtTab from './tabpages/DeleteMdtTab';

import { getMdtsOnThisPathway } from './__generated__/getMdtsOnThisPathway';

export const GET_MDTS_QUERY = gql`
  query getMdtsOnThisPathway($pathwayId: ID!){
    getMdts(pathwayId: $pathwayId){
      id
      clinicians{
        id
        firstName
        lastName
        username
      }
      patients{
        id
        firstName
        lastName
        hospitalNumber
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
  const { currentPathwayId } = useContext(PathwayContext);

  const {
    data: mdtData, error: mdtError, loading: mdtLoading, refetch: mdtRefetch,
  } = useQuery<getMdtsOnThisPathway>(
    GET_MDTS_QUERY, {
      variables: {
        pathwayId: currentPathwayId,
      },
    },
  );

  useEffect(() => {
    mdtRefetch();
  }, [mdtId, mdtRefetch]);

  const mdt = mdtData?.getMdts.find((_mdt) => _mdt?.id.toString() === mdtId.toString());

  return (
    <Modal size="lg" show={ !!(showModal && mdt) } onHide={ () => setShowModal(false) }>
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
          mdtError
            ? <ErrorMessage>{mdtError.message}</ErrorMessage>
            : ''
        }
        <LoadingSpinner loading={ mdtLoading }>
          <Tabs>
            <TabList>
              <Tab>Update MDT</Tab>
              <Tab>Delete MDT</Tab>
            </TabList>
            <TabPanel>
              {
                mdt
                  ? (
                    <UpdateMdtTab
                      mdt={ mdt }
                      successCallback={ () => { setShowModal(false); if (refetch) refetch(); } }
                    />
                  )
                  : ''
              }
            </TabPanel>
            <TabPanel>
              {
                (mdt && mdtData?.getMdts)
                  ? (
                    <DeleteMdtTab
                      mdt={ mdt }
                      allMdts={ mdtData.getMdts }
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
