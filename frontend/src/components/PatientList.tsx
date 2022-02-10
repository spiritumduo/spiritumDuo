import React from 'react';
import ReactPaginate from 'react-paginate';
import './patientlist.css';

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
    <table className="table">
      <tr style={{border: 'none'}}>
        <th className="d-table-cell">Most recent stage</th>
        <th className="d-table-cell">Name</th>
        <th className="d-none d-md-table-cell">Hospital number</th>
        <th className="d-none d-lg-table-cell">Date of birth</th>
      </tr>
      {
        data.map((p) => (
          <tr className="border-0" key={ p.key }> { p } </tr>
        ))
      }
    </table>
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
      activeClassName="active"
      pageClassName="page-item"
      previousClassName="page-item"
      nextClassName="page-item"
      previousLinkClassName="page-link"
      nextLinkClassName="page-link"
      pageLinkClassName="page-link"
    />
  </div>
);

export default PatientList;
