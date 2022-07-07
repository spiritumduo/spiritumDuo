export interface Period {
  duration: number;
}

export type RequestPeriod = {
  type: 'request';
  requests: string[];
} & Period;

export type ResultPeriod = {
  type: 'result';
  requests: string[];
  results: string[];
} & Period;

export type EmptyPeriod = {
  type: 'empty';
} & Period;

export type PatientPeriod = EmptyPeriod | RequestPeriod | ResultPeriod;

export const friendlyNames = {
  request: 'Awaiting Result',
  result: 'Awaiting Decision',
  empty: 'Stalled',
};

export interface PatientVisData {
  name: string;
  dateOfBirth: Date;
  hospitalNumber: string;
  nationalNumber: string;
  id: string;
  periods: {
    [index: string]: PatientPeriod;
  };
}
