import { createRoute, RequiredNumberParam } from '../src';
import { NumberParam, StringParam } from 'serialize-query-params';

export const Links = {
  Product: createRoute('/product/:id', { id: RequiredNumberParam }),
  Array: createRoute('/array'),
  Test: createRoute('/test'),
  UseQueryParams: createRoute(
    '/useQueryParams/:id',
    { id: RequiredNumberParam },
    {
      str: StringParam,
      nmb: NumberParam,
    },
  ),
  Index: createRoute('/'),
};
