/* eslint-disable max-len */
import classNames from 'classnames';
import React, { useLayoutEffect, useMemo, useReducer } from 'react';
import { Button, Col, Collapse, Row } from 'react-bootstrap';
import { GetPatient } from 'features/DecisionPoint/__generated__/GetPatient';

import newResultImage from 'static/i/Image_Pasted_2022-31-01_at_11_31_45_png.png';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { MdtAlreadyExists } from 'features/MdtManagement/tabpages/UpdateMdtTab.stories';

interface TestResultData {
  id: string;
  key: string;
  elementId: string;
  clinicalRequestName: string;
  description: string;
  addedAt: Date;
  forwardDecisionPointId?: string;
  completedAt?: Date;
  currentState: string;
}

interface TestResultDataElementProps {
  result: TestResultData;
  isCollapsed: boolean;
  onClick: (elementId: string) => void;
}

interface PreviousTestResultsElementProps {
  data: GetPatient | undefined;
}

const TestResultDataElement = ({ result, isCollapsed, onClick }: TestResultDataElementProps) => (
  <Row role="row" className={ classNames('my-3', { 'test-new': !result.forwardDecisionPointId }) }>
    <Col role="cell">
      {
        !result.forwardDecisionPointId
          ? (
            <>
              <img src={ newResultImage } alt="New Result" />
            </>
          )
          : false
      }
    </Col>
    <Col role="cell" xs={ 12 } sm={ 11 } xl={ 3 }>
      <p className="text-left">
        {result.clinicalRequestName}: <br />
        Updated: {`${result.addedAt.toLocaleDateString()} ${result.addedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} <br />
        { result.completedAt ? (
          <>
            Completed: {`${result.completedAt?.toLocaleDateString()} ${result.completedAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
          </>
        )
          : ''}
      </p>
    </Col>
    <Col role="cell" xs={ 10 } sm={ 10 } xl={ 7 } id={ result.elementId }>
      {
        result.description.length < 75
          ? <>{result.description}</>
          : (
            <>
              {
                isCollapsed
                  ? result.description.slice(0, 75)
                  : `${result.description.slice(0, 75)}...`
              }
              <Collapse in={ isCollapsed } className="test-collapse">
                <div>
                  {result.description.slice(75, result.description.length)}
                </div>
              </Collapse>
            </>
          )
    }
    </Col>
    <Col role="cell" xs={ 2 } sm={ 2 } xl={ 1 } className="position-relative">
      {
        result.description.length < 75
          ? ''
          : (
            <Button
              onClick={ () => onClick(result.elementId) }
              aria-controls="example-collapse-text"
              aria-expanded={ isCollapsed }
              variant="link"
              className="p-0 position-absolute"
              style={ { bottom: '0' } }
            >
              {
                isCollapsed
                  ? <BsChevronUp color="black" size="1.5rem" />
                  : <BsChevronDown color="black" size="1.5rem" />
              }
            </Button>
          )
      }
    </Col>
  </Row>
);

interface CollapseState {
  [elementId: string]: boolean;
}

interface CollapseStateInitAction {
  type: 'reset';
  payload: CollapseState;
}

interface CollapseStateToggleAction {
  type: 'toggle';
  payload: {
    elementId: string;
  }
}

type CollapseStateReducerActions = CollapseStateInitAction | CollapseStateToggleAction;

const collapseStateReducer = (state: CollapseState, action: CollapseStateReducerActions) => {
  switch (action.type) {
    case 'reset':
      return { ...action.payload };
    case 'toggle': {
      const newCollapseStates = { ...state };
      newCollapseStates[action.payload.elementId] = !newCollapseStates[action.payload.elementId];
      return newCollapseStates;
    }
    default:
      throw new Error('Invalid action type');
  }
};

const PreviousTestResultsElement = ({ data }: PreviousTestResultsElementProps) => {
  const [
    testResultCollapseStates, dispatchTestResultCollapseState,
  ] = useReducer(collapseStateReducer, {});

  const testResults = useMemo(() => {
    const results = data?.getPatient?.onPathways?.[0].clinicalRequests?.flatMap(
      (ms) => (
        ms.testResult?.description
          ? {
            id: ms.testResult.id,
            key: `tr-${ms.testResult.id}`,
            elementId: `tr-href-${ms.testResult.id}`,
            clinicalRequestName: ms.clinicalRequestType.name,
            description: ms.testResult?.description,
            addedAt: ms.testResult.addedAt,
            forwardDecisionPointId: ms.forwardDecisionPoint?.id,
            currentState: ms.currentState,
            completedAt: ms.completedAt,
          }
          : []
      ),
    );
    return results?.sort((a, b) => a.addedAt.valueOf() - b.addedAt.valueOf());
  }, [data]);

  useLayoutEffect(() => {
    const states: CollapseState = {};
    testResults?.forEach((tr) => {
      states[tr.elementId] = !tr.forwardDecisionPointId;
    });
    dispatchTestResultCollapseState({ type: 'reset', payload: states });
  }, [testResults]);

  return (
    <div role="table" aria-label="Previous Test Results">
      <div role="rowgroup" className="visually-hidden">
        <div role="row">
          <div role="columnheader">New?</div>
          <div role="columnheader">Name</div>
          <div role="columnheader">Description</div>
        </div>
      </div>
      <div role="rowgroup">
        { testResults?.map(
          (result) => (
            <TestResultDataElement
              result={ result }
              key={ result.key }
              onClick={ (elementId) => dispatchTestResultCollapseState({ type: 'toggle', payload: { elementId } }) }
              isCollapsed={ testResultCollapseStates[result.elementId] }
            />
          ),
        ) }
      </div>
    </div>
  );
};

export default PreviousTestResultsElement;
