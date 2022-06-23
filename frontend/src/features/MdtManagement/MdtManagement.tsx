import React from 'react';
import { Modal } from 'react-bootstrap';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { BsX } from 'react-icons/bs';

import CreateMdtTab from './tabpages/CreateMdtTab';
import UpdateMdtTab from './tabpages/UpdateMdtTab';

interface MDTPageProps{
  showModal: boolean
  setShowModal: ((arg0: boolean) => void)
}

const MDTPage = ({ showModal, setShowModal }: MDTPageProps): JSX.Element => (
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
          </TabList>
          <TabPanel>
            <CreateMdtTab />
          </TabPanel>
          <TabPanel>
            <UpdateMdtTab />
          </TabPanel>
        </Tabs>
      </Modal.Body>
    </Modal>
  </>
);

export default MDTPage;
