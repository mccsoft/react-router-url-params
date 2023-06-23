import { createRoute, RequiredNumberParam } from '../src';
import {
  BooleanParam,
  DateParam,
  DelimitedArrayParam,
  NumberParam,
  ObjectParam,
  StringParam,
} from 'serialize-query-params';

export const Links = {
  Product: createRoute('/product/:id', { id: RequiredNumberParam }),
  Array: createRoute('/array'),
  Test: createRoute('/test'),
  RoutingTest: createRoute('/routing-test', undefined, {
    sortBy: StringParam,
    bool: BooleanParam,
    date: DateParam,
    obj: ObjectParam,
    num: NumberParam,
    delimitedArray: DelimitedArrayParam,
  }),
  UseQueryParamsWithParameterInUrl: createRoute(
    '/useQueryParams/:id',
    { id: RequiredNumberParam },
    {
      str: StringParam,
      nmb: NumberParam,
    },
  ),
  UseQueryParamsWithoutParameterInUrl: createRoute(
    '/useQueryParams2',
    undefined,
    {
      str: StringParam,
      nmb: NumberParam,
    },
  ),
  Index: createRoute('/'),
};
