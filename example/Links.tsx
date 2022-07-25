import { createRoute, RequiredNumberParam } from '../src';
import { NumberParam, StringParam } from 'serialize-query-params';

export const Links = {
  Product: createRoute('/product/:id', { id: RequiredNumberParam }),
  Array: createRoute('/array'),
  Test: createRoute('/test'),
  UseQueryParamsWithParameterInUrl: createRoute(
    '/useQueryParams/:id',
    { id: RequiredNumberParam },
    {
      str: StringParam,
      nmb: NumberParam,
    },
  ),
  UseQueryParamsWithoutParameterInUrl: createRoute('/useQueryParams2', {
    str: StringParam,
    nmb: NumberParam,
  }),
  Index: createRoute('/'),
};
