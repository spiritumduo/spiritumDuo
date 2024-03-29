/* eslint-disable @typescript-eslint/no-explicit-any */
import { withScalars } from 'apollo-link-scalars';
import { buildASTSchema, GraphQLScalarType } from 'graphql';
import { loader } from 'graphql.macro';

const schemaFile = loader('./schema.graphql');
const schema = buildASTSchema(schemaFile);

const typesMap = {
  Date: new GraphQLScalarType<Date, string>({
    name: 'Date',
    // any here because GraphQL-js doesn't have full typing for this
    serialize: (parsed: any) => parsed?.toISOString(),
    parseValue: (raw: any): Date => new Date(raw),
  }),

  DateTime: new GraphQLScalarType<Date, string>({
    name: 'DateTime',
    // any here because GraphQL-js doesn't have full typing for this
    serialize: (parsed: any) => parsed?.toISOString(),
    parseValue: (raw: any): Date => new Date(raw),
  }),
};

const scalarResolver = withScalars({ schema, typesMap });

export default scalarResolver;
