import React from 'react';
import ReactPaginate from 'react-paginate';
import './patientlist.css';
import { Table } from 'nhsuk-react-components';
/**
 * PatientListUpdateDataFn
 *
 * Used to feed data to the Patient list.
 *
 * @param {number} offset The offset to start from
 * @param {number} limit  How much to return from offset
 */
export type PatientListUpdateDataFn = (selectedItem: { selected: number; }) => void;

export interface PatientListProps {
  /**
   * Number of pages
   */
  pageCount: number;
  /**
   * Function to update patient data
   */
  updateData: PatientListUpdateDataFn;
  /**
   * Patient data
   */
  data: JSX.Element[];
  /**
   * Is data loading?
  */
  isLoading: boolean;
}

/**
 * List of patients with pagination
 *
 */
const PatientList = (
  { pageCount, updateData, data, isLoading }: PatientListProps,
): JSX.Element => (
  <div>
    <div>{isLoading ? <h1>Loading!</h1> : '' }</div>
    <Table responsive>
      <Table.Head>
        <Table.Row>
          <Table.Cell>Name</Table.Cell>
          <Table.Cell>Patient number</Table.Cell>
          <Table.Cell>Date of birth</Table.Cell>
          <Table.Cell>Most recent stage</Table.Cell>
          <Table.Cell>Last updated</Table.Cell>
          <Table.Cell>Locked</Table.Cell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        { data }
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
  </div>
);

export default PatientList;
