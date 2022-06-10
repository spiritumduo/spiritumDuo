import React, { useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
import { BarStackHorizontal } from '@visx/shape';
import { Text } from '@visx/text';
import { SeriesPoint } from '@visx/shape/lib/types';
import { Group } from '@visx/group';
import { AxisTop } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { withTooltip, Tooltip, defaultStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { ParentSize } from '@visx/responsive';

import { getPatientWithReferrals } from './__generated__/getPatientWithReferrals';
import { MilestoneState } from '../../__generated__/globalTypes';

const chartBlue1 = '#003087';
const red = '#FF2D00';
const chartBlue2 = '#99C7EB';
const NHSBlue = '#005EB8';
const chartGrey1 = '#919EA8';
const chartGrey2 = '#DDE1E4';
const purple3 = '#a44afe';
const background = '#F1F4F5';

const barCornerCurve = '0.7%';
const friendlyNames = {
  request: 'Awaiting Result',
  result: 'Awaiting Decision',
  empty: 'Stalled',
};

const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
  zIndex: 4,
};

const defaultMargin = { top: 20, left: 20, right: 20, bottom: 20 };

// Helper functions
const getPatientName = (d: PatientData): string => d.name;
const getDatePortionString = (date: Date): string => date.toISOString().split('T', 1)[0];
const msToDays = (ms: number): number => ms / 86400000;

let tooltipTimeout: number;

export const GET_PATIENT_WITH_REFERRALS_QUERY = gql`
query getPatientWithReferrals($hospitalNumber: String!) {
  getPatient(hospitalNumber: $hospitalNumber) {
    id
    firstName
    lastName
    dateOfBirth
    hospitalNumber
    onPathways { 
      id
      referredAt
      milestones {
          id
          milestoneType {
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
}`;

interface Period {
  duration: number;
}

type RequestPeriod = {
  type: 'request';
  requests: string[];
} & Period;

type ResultPeriod = {
  type: 'result';
  requests: string[];
  results: string[];
} & Period;

type EmptyPeriod = {
  type: 'empty';
} & Period;

type PatientPeriod = EmptyPeriod | RequestPeriod | ResultPeriod;

interface PatientData {
  name: string;
  periods: {
    [index: string]: PatientPeriod;
  };
}

type TooltipData = {
  bar: SeriesPoint<PatientData>;
  key: string;
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
};

type BarStackHorizontalProps = {
  data: PatientData[];
  maxDays: number;
  showName: boolean;
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

const PathwayVisualisation = withTooltip<BarStackHorizontalProps, TooltipData>(
  ({
    data,
    maxDays,
    showName,
    width,
    height,
    margin = defaultMargin,
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  }: BarStackHorizontalProps & WithTooltipProvidedProps<TooltipData>) => {
    // memoise all this to prevent scale recalculation on re-render
    // bounds
    const xMax = useMemo(
      () => width - margin.left - margin.right,
      [margin.left, margin.right, width],
    );
    // Proportion of x axis to use for scale / leave for right pill
    const scaleXMax = useMemo(() => (xMax > 500 ? xMax * 0.80 : 0), [xMax]);
    // magic number to stay in proportion
    const yMax = useMemo(() => (scaleXMax !== 0 ? xMax / 10 : 100), [xMax, scaleXMax]);

    const rightPillX = scaleXMax + (scaleXMax * 0.01);
    const rightPillWidth = scaleXMax !== 0
      ? xMax * 0.2
      : 200;

    const rightTextX = scaleXMax !== 0
      ? xMax * 0.8
      : 100;
    const rightTextXOffset = scaleXMax !== 0
      ? rightPillWidth / 2
      : 0;
    const rightTextWidth = scaleXMax !== 0
      ? xMax * 0.2
      : 100;

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
        domain: data.map(getPatientName),
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
    const pKeys = Object.keys(patientWithMostPeriods.periods);

    return width < 10 ? null : (
      <div>
        <svg width={ width } height={ height }>
          <rect width={ width } height={ height } fill="white" />
          <Group top={ margin.top } left={ margin.left }>
            <BarStackHorizontal<PatientData, string>
              value={ (d, k) => d.periods[k]?.duration }
              data={ data }
              keys={ pKeys }
              height={ yMax }
              y={ getPatientName }
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
                          pillText = `Awaiting ${p.results[0]} Acknowledgement ${plusText}`;
                          break;
                        }
                        default:
                          pillText = 'Stalled';
                      }
                      return (
                        <Group key={ `${b.bar.data.name}-${String(Symbol(b.bar.data.name))}` }>
                          {/* Row Background */}
                          <rect
                            width={ width }
                            height={ b.height * 2.5 }
                            x={ b.x - margin.left }
                            y={ b.y - b.height }
                            fill="white"
                          />
                          {
                            /* Patient name */
                            showName
                              ? (
                                <Text y={ b.y } dy={ -5 } fontSize="1.5rem" fontWeight={ 750 } scaleToFit>
                                  {b.bar.data.name}
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
                            height={ b.height * 1.5 }
                            y={ b.y - (b.height / 2) }
                            rx={ barCornerCurve }
                            x={ rightPillX }
                            fill={ patientColourScale(lastPeriod.type) }
                            width={ rightPillWidth }
                          />
                          {/* Right pill text */}
                          <Text
                            fill="white"
                            textAnchor="middle"
                            fontSize="0.75rem"
                            y={ b.y }
                            x={ rightTextX }
                            dy={ b.height / 1.5 }
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
                      width={ bar.width }
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
              scaleXMax !== 0
                ? (
                  <AxisTop
                    numTicks={ 4 }
                    tickValues={ tickValues }
                    hideAxisLine
                    top={ margin.top - 2 }
                    scale={ dayScale }
                    stroke={ purple3 }
                    tickStroke={ purple3 }
                    tickLabelProps={ () => ({
                      fill: purple3,
                      fontSize: 11,
                      textAnchor: 'middle',
                    }) }
                  />
                )
                : undefined
              }
          </Group>
        </svg>
        {tooltipOpen && tooltipData && (
          <Tooltip top={ tooltipTop } left={ tooltipLeft } style={ tooltipStyles }>
            <div>
              <h2>{friendlyNames[tooltipData.bar.data.periods[tooltipData.key].type]}</h2>
            </div>
            <div>{
              (
                tooltipData.bar.data.periods[tooltipData.key] as RequestPeriod
              ).requests !== undefined
                ? (
                  <>
                    <h5>Requests</h5>
                    {(
                      tooltipData.bar.data.periods[tooltipData.key] as RequestPeriod
                    ).requests.map((r) => <>{r}<br /></> )}
                  </>
                )
                : false
            }
            </div>
            <div>{
              (tooltipData.bar.data.periods[tooltipData.key] as ResultPeriod).results !== undefined
                ? (
                  <>
                    <h5>Results</h5>
                    {(
                      tooltipData.bar.data.periods[tooltipData.key] as ResultPeriod
                    ).results.map((r) => <>{r}<br /></> )}
                  </>
                )
                : false
            }
            </div>
          </Tooltip>
        )}
      </div>
    );
  },
);

export interface PatientPathwayProps {
  hospitalNumber: string;
  showName?: boolean;
  maxDays?: number;
}

const PatientPathway = (
  { hospitalNumber, maxDays = 70, showName }: PatientPathwayProps,
): JSX.Element => {
  const {
    loading, error, data,
  } = useQuery<getPatientWithReferrals>(
    GET_PATIENT_WITH_REFERRALS_QUERY,
    { variables: { hospitalNumber } },
  );

  const patientData: PatientData | undefined = useMemo(() => {
    if (data) {
      interface RequestEvent {id: string; name: string}
      interface EventDates {
        [date: string]: {
          requests?: Set<RequestEvent>;
          results?: Set<RequestEvent>;
          acknowledgements?: Set<RequestEvent>;
        }
      }
      const events: EventDates = {};
      data.getPatient?.onPathways?.[0].milestones?.forEach((ms) => {
        let startDay = events[getDatePortionString(ms.addedAt)];
        if (!startDay) {
          startDay = {};
          events[getDatePortionString(ms.addedAt)] = startDay;
        }
        const event = {
          id: ms.id,
          name: ms.milestoneType.name,
        };
        startDay.requests !== undefined
          ? startDay.requests.add(event)
          : startDay.requests = new Set([event]);

        if (ms.currentState === MilestoneState.COMPLETED) {
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

      const returnData: PatientData = {
        name: `${data.getPatient?.firstName} ${data.getPatient?.lastName}`,
        periods: {},
      };

      const sortedDates = Object.keys(events).sort();
      let periodKey = 0;
      if (sortedDates[0] !== getDatePortionString(data.getPatient?.onPathways?.[0].referredAt)) {
        const currentDate = new Date(data.getPatient?.onPathways?.[0].referredAt);
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
      } = { requests: new Set(), results: new Set() };

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
    }
    return undefined;
  }, [data]);

  if (patientData) {
    return (
      <ParentSize debounceTime={ 0 }>
        {({ width: parentWidth, height: parentHeight }) => (
          <PathwayVisualisation
            showName={ showName || false }
            maxDays={ maxDays }
            data={ [patientData] }
            width={ parentWidth }
            height={ parentHeight }
          />
        )}
      </ParentSize>
    );
  }
  return <h1>Loading!</h1>;
};

export default PatientPathway;
