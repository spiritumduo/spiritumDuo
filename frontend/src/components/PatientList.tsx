import React, { useState } from 'react';
import './patientlist.css';
import ReactPaginate from 'react-paginate';
import Patient from 'types/Patient';
import { PatientLink } from './Link';

/**
 * PatientListDataFn
 *
 * Used to feed data to the Patient list.
 *
 * @param {number} offset The offset to start from
 * @param {number} limit  How much to return from offset
 */
export type PatientListDataFn = (selectedItem: { selected: number; }) => void;

export interface PatientListProps {
  /**
   * Number of pages
   */
  pageCount: number;
  /**
   * Function to update patient data
   */
  updateData: PatientListDataFn;
  /**
   * Patient data
   */
  data: Patient[];
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
  <div className="patient-list-div">
    <ul className="patient-list px-0">
      {
        data.map((p) => (
          <li key={ p.hospitalNumber }> <PatientLink patient={ p } /> </li>
        ))
      }
    </ul>

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
