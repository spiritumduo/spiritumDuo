/* eslint-disable import/prefer-default-export */
// get string keys from an enum
// eslint-disable-next-line @typescript-eslint/ban-types
export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

export type ArrayElement<
  ArrayType extends readonly unknown[]
> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
