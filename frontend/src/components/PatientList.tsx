import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { Table } from 'nhsuk-react-components';
import { LockFill } from 'react-bootstrap-icons';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
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
  data: {
    id: string;
    firstName: string;
    lastName: string;
    hospitalNumber: string;
    dateOfBirth: Date;
    updatedAt: Date;
    mostRecentStage: string;
    isOnPathwayLockedByOther: boolean;
    lockFirstName?: string;
    lockLastName?: string;
  }[];
  /**
   * Is data loading?
  */
  isLoading: boolean;
  onClickCallback: (hospitalNumber: string) => void;
}

/**
 * List of patients with pagination
 *
 */
const PatientList = (
  { pageCount, updateData, data, isLoading, onClickCallback }: PatientListProps,
): JSX.Element => (
  <LoadingSpinner loading={ isLoading }>
    <div>
      <div className="nhsuk-u-visually-hidden" id="pt_todo_list_aria">Patient to-do list</div>
      <div className="nhsuk-u-visually-hidden" id="pt_click_hint_aria">Click to open patient</div>
      <Table responsive role="grid" aria-describedby="pt_todo_list_aria" aria-label="patient list">
        <Table.Head>
          <Table.Row>
            <Table.Cell>Name</Table.Cell>
            <Table.Cell>Patient number</Table.Cell>
            <Table.Cell>Date of birth</Table.Cell>
            <Table.Cell>Most recent stage</Table.Cell>
            <Table.Cell>Last updated</Table.Cell>
            <Table.Cell> </Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          { data.map((p) => {
            const lockIconElement = p.isOnPathwayLockedByOther
              ? <LockFill role="img" aria-label="lock icon" size="1em" style={ { boxSizing: 'content-box', marginTop: '-3px' } } color="black" />
              : <></>;
            const lockIconElementResponsive = p.isOnPathwayLockedByOther
              ? <LockFill role="img" aria-label="lock icon responsive" size="1em" style={ { boxSizing: 'content-box', marginTop: '-3px' } } color="black" />
              : <></>;
            const lockIconTooltipElement = p.isOnPathwayLockedByOther
              ? (
                <OverlayTrigger
                  overlay={ (
                    <Tooltip className="d-none d-md-inline-block" id="tooltip-disabled">
                      This patient is locked by
                      &nbsp;{p.lockFirstName}
                      &nbsp;{p.lockLastName}
                    </Tooltip>
                  ) }
                >
                  { lockIconElement }
                </OverlayTrigger>
              )
              : <></>;
            return (
              <Table.Row
                onClick={ () => onClickCallback(p.hospitalNumber) }
                tabIndex={ 0 }
                className={ p.isOnPathwayLockedByOther ? 'disabled' : 'active' }
                key={ `patient-list-key${p.id}` }
              >
                <Table.Cell tabIndex={ 0 } aria-describedby="editText">
                  <div>
                    <button
                      className="sd-hidden-button"
                      disabled={ p.isOnPathwayLockedByOther }
                      type="button"
                      tabIndex={ 0 }
                      onClick={ () => onClickCallback(p.hospitalNumber) }
                      role="link"
                    >
                      {`${p.firstName} ${p.lastName}`}
                    </button>
                    <span className="d-md-none ps-2">{ lockIconElementResponsive }</span>
                  </div>
                </Table.Cell>
                <Table.Cell tabIndex={ -1 } aria-describedby="editText">{p.hospitalNumber}</Table.Cell>
                <Table.Cell tabIndex={ -1 } aria-describedby="editText">{p.dateOfBirth?.toLocaleDateString()}</Table.Cell>
                <Table.Cell tabIndex={ -1 } aria-describedby="editText">{p.mostRecentStage}</Table.Cell>
                <Table.Cell tabIndex={ -1 } aria-describedby="editText">{`${p.updatedAt.toLocaleDateString()} ${p.updatedAt.toLocaleTimeString()}`}</Table.Cell>
                <Table.Cell tabIndex={ -1 } aria-describedby="editText">
                  <div className="d-none d-md-block pt-0 pe-3 text-center">
                    { lockIconTooltipElement }
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          } ) }
        </Table.Body>
      </Table>
      <br />
      <ReactPaginate
        previousLabel="previous"
        nextLabel="next"
        breakLabel="..."
        breakClassName="break-me"
        pageCount={ Math.ceil(pageCount) }
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
  </LoadingSpinner>
);

export default PatientList;
