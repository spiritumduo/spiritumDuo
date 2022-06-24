import React from 'react';
import { Modal } from 'react-bootstrap';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { BsX } from 'react-icons/bs';

import CreateMdtTab from './tabpages/CreateMdtTab';
import UpdateMdtTab from './tabpages/UpdateMdtTab';
import DeleteMdtTab from './tabpages/DeleteMdtTab';

interface MDTListPageProps{
  showModal: boolean
  setShowModal: ((arg0: boolean) => void)
}

const MDTListPage = ({ showModal, setShowModal }: MDTListPageProps): JSX.Element => (
  <>
    <Modal size="lg" show={ showModal } setShow={ setShowModal } onHide={ () => setShowModal(false) }>
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
        <Tabs>
          <TabList>
            <Tab>Create MDT</Tab>
            <Tab>Update MDT</Tab>
            <Tab>Delete MDT</Tab>
          </TabList>
          <TabPanel>
            <CreateMdtTab />
          </TabPanel>
          <TabPanel>
            <UpdateMdtTab />
          </TabPanel>
          <TabPanel>
            <DeleteMdtTab />
          </TabPanel>
        </Tabs>
      </Modal.Body>
    </Modal>
  </>
);

export default MDTListPage;
