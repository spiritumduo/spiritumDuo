import React, { useContext } from 'react';
import { Modal } from 'react-bootstrap';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { BsX } from 'react-icons/bs';
import { gql, useQuery } from '@apollo/client';
import { ErrorMessage } from 'nhsuk-react-components';

import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import { PathwayContext } from 'app/context';
import MDT from 'types/MDT';

import UpdateMdtTab from '../UpdateMdtForm/UpdateMdtForm';
import DeleteMdtTab from '../DeleteMdtForm/DeleteMdtForm';

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

interface MDTManagementModalProps{
  mdt: MDT;
  closeCallback: (() => void)
  onSuccess?: () => void
}

const MDTManagementModal = (
  { mdt, closeCallback, onSuccess }: MDTManagementModalProps,
): JSX.Element => {
  const { currentPathwayId } = useContext(PathwayContext);

  const {
    data: mdtData, error: mdtError, loading: mdtLoading,
  } = useQuery<getMdtsOnThisPathway>(
    GET_MDTS_QUERY, {
      variables: {
        pathwayId: currentPathwayId,
      },
    },
  );

  return (
    <Modal size="lg" show onHide={ () => closeCallback() }>
      <Modal.Header>
        <Modal.Title>MDT Management</Modal.Title>
        <button
          type="button"
          className="bg-transparent"
          name="Close"
          style={ { border: 'none' } }
          onClick={ () => closeCallback() }
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
                      successCallback={ () => { if (onSuccess) onSuccess(); closeCallback(); } }
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
                      successCallback={ () => { if (onSuccess) onSuccess(); closeCallback(); } }
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

export default MDTManagementModal;
