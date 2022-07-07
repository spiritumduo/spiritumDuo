import { PatientVisData } from '../util';

export const mockPatientData: PatientVisData[] = [
  {
    id: '1',
    name: 'John Doe',
    dateOfBirth: new Date('1980-01-01'),
    hospitalNumber: 'fMRN1234567',
    nationalNumber: 'fNHS123456789',
    periods: {
      1: {
        type: 'empty',
        duration: 4,
      },
      2: {
        type: 'request',
        duration: 1,
        requests: ['First Request', 'Second Request', 'Third Request'],
      },
      3: {
        type: 'request',
        duration: 7,
        requests: ['First Request', 'Second Request', 'Third Request', 'Fourth Request'],
      },
      4: {
        type: 'result',
        duration: 4,
        requests: ['First Request', 'Fourth Request'],
        results: ['Second Request', 'Third Request'],
      },
      5: {
        type: 'result',
        duration: 5,
        requests: ['Fourth Request'],
        results: ['First Request', 'Second Request', 'Third Request'],
      },
      6: {
        type: 'result',
        duration: 1,
        requests: ['Fifth Request', 'Sixth Request', 'Seventh Request'],
        results: ['Fourth Request'],
      },
      7: {
        type: 'request',
        duration: 8,
        requests: ['Fifth Request', 'Sixth Request', 'Seventh Request'],
      },
    },
  },
  {
    id: '2',
    name: 'Jane Doe',
    dateOfBirth: new Date('1970-06-01'),
    hospitalNumber: 'fMRN7654321',
    nationalNumber: 'fNHS987654321',
    periods: {
      1: {
        type: 'request',
        duration: 1,
        requests: ['First Request', 'Second Request', 'Third Request'],
      },
      2: {
        type: 'request',
        duration: 2,
        requests: ['First Request', 'Second Request', 'Third Request', 'Fourth Request'],
      },
      3: {
        type: 'result',
        duration: 3,
        requests: [],
        results: ['Second Request'],
      },
      4: {
        type: 'result',
        duration: 7,
        requests: [],
        results: ['First Request', 'Second Request'],
      },
      5: {
        type: 'request',
        duration: 11,
        requests: ['Fourth Request', 'Fifth Request'],
        // results: ['Third Request'],
      },
    },
  },
];

export const mockSortedKeys = ['1', '2', '3', '4', '5', '6', '7'];
