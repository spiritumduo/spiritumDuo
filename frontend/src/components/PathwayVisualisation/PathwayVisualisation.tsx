import React, { useMemo } from 'react';

// LIBRARIES
import { gql } from '@apollo/client';
import { BarStackHorizontal } from '@visx/shape';
import { Text } from '@visx/text';
import { SeriesPoint } from '@visx/shape/lib/types';
import { Group } from '@visx/group';
import { AxisBottom, AxisTop } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { withTooltip, Tooltip, defaultStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';

// GENERATED TYPES
import { ClinicalRequestState } from '__generated__/globalTypes';

// LOCAL
import { GrpPatientFields } from './__generated__/GrpPatientFields';
import {
  RequestPeriod,
  ResultPeriod,
  EmptyPeriod,
  PatientPeriod,
  PatientVisData,
} from './util';

// LOCAL COMPONENTS
import { AccessibleTable } from './components/AccessibleTable';
import { TooltipContents } from './components/TooltipContents';

const red = '#FF2D00';
const chartBlue2 = '#99C7EB';
const NHSBlue = '#005EB8';
const purple3 = '#a44afe';
const background = '#F1F4F5';

const barCornerCurve = '0.7%';

const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
  zIndex: 4,
};

const defaultMargin = { top: 30, left: 20, right: 20, bottom: 20 };

// Helper functions
const getPatientId = (d: PatientVisData): string => d.id;
const getDatePortionString = (date: Date): string => date.toISOString().split('T', 1)[0];
const msToDays = (ms: number): number => ms / 86400000;
const rightPillHeight = (h: number, isWide: boolean) => (isWide ? h * 1.5 : h);
const rightPillY = (y: number, h: number, isWide: boolean) => (
  isWide
    ? y - (h / 2)
    : y
);

let tooltipTimeout: number;

export const PATIENT_PARTS_FOR_GRP = gql`
  fragment GrpPatientFields on Patient {
    id
    firstName
    lastName
    dateOfBirth
    hospitalNumber
    nationalNumber
    onPathways { 
      id
      referredAt
      clinicalRequests {
          id
          clinicalRequestType {
            id
            name
          }
          addedAt
          updatedAt
          currentState
          forwardDecisionPoint {
            id
            addedAt
          }
      }
    }
  }
`;

type TooltipData = {
  bar: SeriesPoint<PatientVisData>;
  key: string;
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
};

export const patientToVisData = (patient: NonNullable<GrpPatientFields>): PatientVisData => {
  interface RequestEvent {id: string; name: string}
  interface EventDates {
    [date: string]: {
      requests?: Set<RequestEvent>;
      results?: Set<RequestEvent>;
      acknowledgements?: Set<RequestEvent>;
    }
  }
  const events: EventDates = {};
  patient.onPathways?.[0].clinicalRequests?.forEach((ms) => {
    let startDay = events[getDatePortionString(ms.addedAt)];
    if (!startDay) {
      startDay = {};
      events[getDatePortionString(ms.addedAt)] = startDay;
    }
    const event = {
      id: ms.id,
      name: ms.clinicalRequestType.name,
    };
    startDay.requests !== undefined
      ? startDay.requests.add(event)
      : startDay.requests = new Set([event]);

    if (ms.currentState === ClinicalRequestState.COMPLETED) {
      let endDay = events[getDatePortionString(ms.updatedAt)];
      if (!endDay) {
        endDay = {};
        events[getDatePortionString(ms.updatedAt)] = endDay;
      }
      endDay.results !== undefined
        ? endDay.results.add(event)
        : endDay.results = new Set([event]);

      if (ms.forwardDecisionPoint) {
        let acknowledgedDay = events[getDatePortionString(ms.forwardDecisionPoint.addedAt)];
        if (!acknowledgedDay) {
          acknowledgedDay = {};
          events[getDatePortionString(ms.forwardDecisionPoint.addedAt)] = acknowledgedDay;
        }
        acknowledgedDay.acknowledgements !== undefined
          ? acknowledgedDay.acknowledgements.add(event)
          : acknowledgedDay.acknowledgements = new Set([event]);
      }
    }
  });

  const returnData: PatientVisData = {
    name: `${patient.firstName} ${patient.lastName}`,
    id: patient.id,
    dateOfBirth: patient.dateOfBirth,
    hospitalNumber: patient.hospitalNumber,
    nationalNumber: patient.nationalNumber,
    periods: {},
  };

  const sortedDates = Object.keys(events).sort();
  let periodKey = 0;
  if (sortedDates[0] !== getDatePortionString(patient.onPathways?.[0].referredAt)) {
    const currentDate = new Date(patient.onPathways?.[0].referredAt);
    const nextDate = new Date(sortedDates[0]);
    const timeDelta = Math.abs(currentDate.getTime() - nextDate.getTime());
    const emptyPeriod: EmptyPeriod = {
      type: 'empty',
      duration: msToDays(timeDelta),
    };
    returnData.periods[periodKey.toString()] = emptyPeriod;
    periodKey += 1;
  }

  const currentEvents: {
    requests: Set<RequestEvent>;
    results: Set<RequestEvent>;
  } = {
    requests: new Set(),
    results: new Set(),
  };

  sortedDates.forEach((sd, index, array) => {
    const currentEventDate = events[sd];
    const currentDateMs = new Date(sd).getTime();
    const nextDateMs = index < array.length - 1
      ? new Date(array[index + 1]).getTime()
      : Date.now();
    const duration = msToDays(nextDateMs - currentDateMs);

    // Add new requests
    currentEventDate.requests?.forEach((request) => currentEvents.requests.add(request));
    // Add new results & delete from requests
    currentEventDate.results?.forEach((result) => {
      currentEvents.requests.delete(result);
      currentEvents.results.add(result);
    });
    // Remove acknowledgements from results
    currentEventDate.acknowledgements?.forEach((ack) => currentEvents.results.delete(ack));
    const type = (currentEvents.requests.size === 0 && currentEvents.results.size === 0)
      ? 'empty'
      : (currentEvents.requests.size > 0 && currentEvents.results.size === 0)
        ? 'request'
        : 'result';

    let period: PatientPeriod;
    switch (type) {
      case 'result':
        period = {
          type: 'result',
          duration: duration,
          results: Array.from(currentEvents.results).map((r) => r.name),
          requests: Array.from(currentEvents.requests).map((r) => r.name),
        };
        break;

      case 'request':
        period = {
          type: 'request',
          duration: duration,
          requests: Array.from(currentEvents.requests).map((r) => r.name),
        };
        break;

      default:
        period = {
          type: 'empty',
          duration: duration,
        };
    }
    returnData.periods[periodKey] = period;
    periodKey += 1;
  });
  return returnData;
};

export interface PathwayVisualisationProps {
  data: PatientVisData[];
  maxDays: number;
  showName?: boolean;
  axisBottom?: boolean;
  showNationalNumber?: boolean;
  width: number;
  backgroundColor?: string;
  onClick?: (patient: PatientVisData) => void;
  margin?: { top: number; right: number; bottom: number; left: number };
}

/**
 * * Optional number of tick values
 * * * Max days, and step distance between ticks, e.g. max 70, [0, 20, 40, 60, 70]
 */

const PathwayVisualisation = withTooltip<PathwayVisualisationProps, TooltipData>(
  ({
    data,
    maxDays,
    showName,
    showNationalNumber,
    width,
    axisBottom,
    onClick,
    backgroundColor = '#f1f4f5',
    margin = defaultMargin,
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  }: PathwayVisualisationProps & WithTooltipProvidedProps<TooltipData>) => {
    if (data.length === 0) return <></>; // we don't want to render an empty graph
    // memoise all this to prevent scale recalculation on re-render
    // bounds
    const safeWidth = useMemo(() => (width > 280 ? width : 280), [width]);
    const xMax = useMemo(
      () => safeWidth - margin.left - margin.right,
      [margin.left, margin.right, safeWidth],
    );

    const isVeryNarrow = safeWidth < 355;

    const yOffset = isVeryNarrow && showNationalNumber
      ? 40
      : isVeryNarrow
        ? 20
        : 0;

    // Proportion of x axis to use for scale / leave for right pill
    const scaleXMax = useMemo(() => (
      (xMax > 750 && !showNationalNumber) || (xMax > 800 && showNationalNumber)
        ? xMax * 0.80
        : 0
    ), [showNationalNumber, xMax]);
    const isWide = useMemo(() => scaleXMax !== 0, [scaleXMax]);
    // magic number to stay in proportion
    const yMax = useMemo(
      () => {
        const narrowRowHeight = showNationalNumber
          ? 150
          : 150;
        return (
          isWide
            ? (xMax / 10) * data.length // regular height
            : isVeryNarrow
              ? (narrowRowHeight + 50) * data.length // small screen height
              : narrowRowHeight * data.length // narrow height
        );
      },
      [showNationalNumber, isWide, xMax, data.length, isVeryNarrow],
    );

    const rightPillX = scaleXMax + (scaleXMax * 0.01);
    const rightPillWidth = isWide
      ? xMax * 0.185
      : safeWidth * 0.45;

    const rightTextX = isWide
      ? xMax * 0.8
      : rightPillWidth / 2;
    const rightTextXOffset = isWide
      ? rightPillWidth / 1.85
      : 0;
    const rightTextWidth = isWide
      ? xMax * 0.175
      : rightPillWidth;
    const patientNameWidth = isWide
      ? xMax * 0.8
      : safeWidth * 0.6;

    // top axis tick values
    const tickValues = [0, maxDays / 4, maxDays / 2, maxDays * 0.75, maxDays];

    const dayScale = useMemo(() => {
      const dayScaleMax = maxDays || Math.max(
        ...data.map((d) => Object.keys(d.periods).reduce(
          (previous, current) => previous + d.periods[current].duration, 0,
        ), 0),
      );
      const scale = scaleLinear<number>({
        domain: [0, dayScaleMax],
        clamp: true,
      });
      scale.rangeRound([0, scaleXMax]);
      return scale;
    }, [data, maxDays, scaleXMax]);

    const patientScale = useMemo(() => {
      const scale = scaleBand<string>({
        domain: data.map(getPatientId),
        paddingOuter: 0.2,
        paddingInner: 0.66,
      });
      scale.rangeRound([0, yMax]);
      return scale;
    }, [data, yMax]);

    const patientColourScale = useMemo(() => scaleOrdinal({
      domain: ['request', 'result', 'empty'],
      range: [chartBlue2, NHSBlue, red],
    }), []);

    const patientWithMostPeriods = useMemo(() => data.reduce((previous, current) => (
      Object.keys(previous.periods).length > Object.keys(current.periods).length
        ? previous
        : current
    )), [data]);
    const sortedKeys = Object.keys(patientWithMostPeriods.periods)
      .sort((first, second) => parseInt(first, 10) - parseInt(second, 10));

    const finalHeight = axisBottom
      ? yMax + margin.bottom + margin.top + 35
      : yMax + margin.bottom + margin.top + 32;

    const pathwayAxis = axisBottom
      ? (
        <AxisBottom
          numTicks={ 4 }
          tickValues={ tickValues }
          hideAxisLine
          top={ yMax - 30 }
          scale={ dayScale }
          stroke={ purple3 }
          tickStroke={ purple3 }
          tickLabelProps={ () => ({
            dy: 2,
            fill: purple3,
            fontSize: 18,
            textAnchor: 'middle',
          }) }
        />
      )
      : (
        <AxisTop
          numTicks={ 4 }
          tickValues={ tickValues }
          hideAxisLine
          top={ -14 }
          scale={ dayScale }
          stroke={ purple3 }
          tickStroke={ purple3 }
          tickLabelProps={ () => ({
            dy: -5,
            fill: purple3,
            fontSize: 18,
            textAnchor: 'middle',
          }) }
          tickLength={ 8 }
        />
      );

    return (
      <div>
        <div className="visually-hidden" id="pathway-visualisation-desc">
          Patient Pathway Visualisation
        </div>
        <svg
          aria-details="accessible-table"
          aria-describedby="pathway-visualisation-desc"
          width={ safeWidth }
          height={ finalHeight }
        >
          <rect width={ safeWidth } height={ finalHeight } fill={ backgroundColor } />
          <Group top={ margin.top + 35 } left={ margin.left + 5 }>
            <BarStackHorizontal<PatientVisData, string>
              value={ (d, k) => d.periods[k]?.duration }
              data={ data }
              keys={ sortedKeys }
              height={ yMax }
              y={ getPatientId }
              xScale={ dayScale }
              yScale={ patientScale }
              color={ (key, index) => {
                const type = data[index].periods[key]?.type;
                const colour = type
                  ? patientColourScale(type)
                  : undefined;
                return colour || background;
              } }
            >
              {(barStacks) => (
                <React.Fragment key={ `barstack-horizontal-${barStacks}` }>
                  {
                    barStacks[0].bars.map((b) => {
                      const lastPeriodKey = Object.keys(b.bar.data.periods)
                        .sort((first, second) => parseInt(second, 10) - parseInt(first, 10))[0];
                      const lastPeriod = b.bar.data.periods[lastPeriodKey];
                      let pillText: string;
                      switch (lastPeriod.type) {
                        case 'request': {
                          const p = lastPeriod as RequestPeriod;
                          const plusText = p.requests.length > 1
                            ? `+${p.requests.length - 1}`
                            : '';
                          pillText = `Awaiting ${p.requests[0]} ${plusText}`;
                          break;
                        }
                        case 'result': {
                          const p = lastPeriod as ResultPeriod;
                          const plusText = p.results.length > 1
                            ? `+${p.results.length - 1}`
                            : '';
                          pillText = `${p.results[0]} ${plusText}`;
                          break;
                        }
                        default:
                          pillText = 'Stalled';
                      }
                      return (
                        <Group
                          key={ `${b.bar.data.name}-${String(Symbol(b.bar.data.name))}` }
                          onClick={ onClick
                            ? () => onClick(b.bar.data)
                            : undefined }
                        >
                          {/* Row Background */}
                          <rect
                            width={ safeWidth }
                            height={ b.height * 2.5 }
                            x={ b.x - margin.left }
                            y={ b.y - b.height }
                            fill="white"
                          />
                          {
                            /* Patient name */
                            showName
                              ? (
                                <Text
                                  width={ patientNameWidth }
                                  textAnchor="start"
                                  verticalAnchor="end"
                                  y={ b.y }
                                  dy={
                                    isVeryNarrow && showNationalNumber
                                      ? 25
                                      : -5
                                    }
                                  fontSize="1.5rem"
                                  fontWeight={ 650 }
                                >
                                  {
                                    showNationalNumber
                                      ? `${b.bar.data.name}, ${b.bar.data.hospitalNumber}, ${b.bar.data.nationalNumber}, ${b.bar.data.dateOfBirth.toLocaleDateString()}`
                                      : `${b.bar.data.name}, ${b.bar.data.hospitalNumber}, ${b.bar.data.dateOfBirth.toLocaleDateString()}`
                                  }
                                </Text>
                              )
                              : undefined
                          }
                          {/* Bars background */}
                          <rect
                            width={ scaleXMax }
                            height={ b.height }
                            y={ b.y }
                            fill="#D8DDE0"
                            rx={ barCornerCurve }
                          />
                          {/* Right pill */}
                          <rect
                            height={ rightPillHeight(b.height, isWide) }
                            y={ rightPillY(b.y, b.height, isWide) + yOffset }
                            rx={ barCornerCurve }
                            x={ rightPillX }
                            fill={ patientColourScale(lastPeriod.type) }
                            width={ rightPillWidth }
                          />
                          {/* Right pill text */}
                          <Text
                            fill="white"
                            textAnchor="middle"
                            fontSize="1rem"
                            y={ b.y }
                            x={ rightTextX }
                            dy={ isVeryNarrow ? b.height / 1.5 + yOffset : b.height / 1.5 }
                            dx={ rightTextXOffset }
                            width={ rightTextWidth }
                          >
                            {pillText}
                          </Text>
                        </Group>
                      );
                    })
                  }
                  {
                  barStacks.map((barStack) => barStack.bars.map((bar) => (
                    <rect
                      key={ `barstack-horizontal-${barStack.index}-${bar.index}` }
                      rx={ barCornerCurve }
                      x={ bar.x }
                      y={ bar.y }
                      width={ bar.width > 0 ? bar.width : 0 }
                      height={ bar.height }
                      fill={ bar.color }
                      onMouseLeave={ () => {
                        tooltipTimeout = window.setTimeout(() => {
                          hideTooltip();
                        }, 300);
                      } }
                      onMouseMove={ () => {
                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                        const top = bar.y + margin.top;
                        const left = bar.x + bar.width + margin.left;
                        showTooltip({
                          tooltipData: bar,
                          tooltipTop: top,
                          tooltipLeft: left,
                        });
                      } }
                    />
                  )))
                }
                </React.Fragment>
              )}
            </BarStackHorizontal>
            {
              isWide
                ? <>{pathwayAxis}</>
                : undefined
              }
          </Group>
        </svg>
        {tooltipOpen && tooltipData && (
          <Tooltip top={ tooltipTop } left={ tooltipLeft } style={ tooltipStyles }>
            <TooltipContents
              requests={ (tooltipData.bar.data.periods[tooltipData.key] as RequestPeriod).requests }
              results={ (tooltipData.bar.data.periods[tooltipData.key] as ResultPeriod).results }
            />
          </Tooltip>
        )}
        <AccessibleTable
          id="accessible-table"
          className="visually-hidden"
          data={ data }
          sortedKeys={ sortedKeys }
          onClick={ onClick }
        />
      </div>
    );
  },
);

export default PathwayVisualisation;
