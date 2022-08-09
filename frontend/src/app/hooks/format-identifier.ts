import { useConfig } from 'components/ConfigContext';

type Maybe<T> = T | null | undefined;

function runWithMaybe<T>(input: Maybe<T>, fn: (input: T) => Maybe<T>): Maybe<T> {
  if (input === null || input === undefined) {
    return input;
  }
  return fn(input);
}

export const formatIdentifier = (identifier: string, format: string): string => {
  let identifierIndex = 0;
  let optionalStarted = false;
  const formattedStringArray = [];
  for (let i = 0; i < format.length; i++) {
    switch (format[i]) {
      case '@':
        if (identifierIndex > identifier.length - 1) {
          throw new RangeError('identifier too short for format string');
        }
        if (optionalStarted) throw new Error('mandatory character cannot follow optional character');
        formattedStringArray.push(identifier[identifierIndex]);
        identifierIndex += 1;
        break;
      case '+':
        optionalStarted = true;
        formattedStringArray.push(identifier[identifierIndex]);
        identifierIndex += 1;
        break;

      default:
        formattedStringArray.push(format[i]);
    }
  }
  if (identifierIndex < identifier.length) {
    throw new Error('identifier too long for format string');
  }
  return formattedStringArray.join('');
};

const withErrorReport = (fn: () => string): string => {
  let res: string;
  try {
    res = fn();
  } catch (err) {
    res = (err as Error).message;
  }
  return res;
};

export const useHospitalNumberFormat = (): (identifier: Maybe<string>) => Maybe<string> => {
  const { hospitalNumberFormat } = useConfig();
  return (identifier: Maybe<string>): Maybe<string> => runWithMaybe<string>(
    identifier,
    (i) => withErrorReport(
      () => formatIdentifier(i, hospitalNumberFormat),
    ),
  );
};

export const useNationalNumberFormat = (): (identifier: Maybe<string>) => Maybe<string> => {
  const { nationalNumberFormat } = useConfig();
  return (identifier: Maybe<string>): Maybe<string> => runWithMaybe<string>(
    identifier,
    (i) => withErrorReport(
      () => formatIdentifier(i, nationalNumberFormat),
    ),
  );
};
