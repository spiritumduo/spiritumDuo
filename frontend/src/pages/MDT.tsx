import React, { useState } from 'react';

import { Button, Container, Table } from 'nhsuk-react-components';
import ReactPaginate from 'react-paginate';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import '../components/patientlist.css';
import MdtManagement from 'features/MdtManagement/MdtManagement';

const MDTPage = (): JSX.Element => {
  const [showManageMdtModal, setShowManageMdtModal] = useState<boolean>(false);

  return (
    <Container>
      <MdtManagement showModal={ showManageMdtModal } setShowModal={ setShowManageMdtModal } />
      <Button className="my-3" onClick={ () => setShowManageMdtModal(true) }>Manage MDTs</Button>
      <Tabs>
        <TabList>
          <Tab>MDT by date</Tab>
        </TabList>
        <TabPanel>
          <Table responsive role="grid" aria-describedby="pt_todo_list_aria" aria-label="patient list">
            <Table.Head>
              <Table.Row>
                <Table.Cell>Date</Table.Cell>
                <Table.Cell>Clinicians present</Table.Cell>
                <Table.Cell>Location</Table.Cell>
                <Table.Cell>Number of patients</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Thing</Table.Cell>
                <Table.Cell>Thing</Table.Cell>
                <Table.Cell>Thing</Table.Cell>
                <Table.Cell>Thing</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </TabPanel>
      </Tabs>
      <br />
      <ReactPaginate
        previousLabel="previous"
        nextLabel="next"
        breakLabel="..."
        breakClassName="break-me"
        pageCount={ Math.ceil(2) }
        marginPagesDisplayed={ 2 }
        pageRangeDisplayed={ 5 }
        onPageChange={ () => ({}) }
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

export default MDTPage;
