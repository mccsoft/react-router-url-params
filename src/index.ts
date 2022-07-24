import { useQueryParams, useQueryParam } from './useQueryParams';
import { createRoute } from './create-route';
import { RequiredNumberParam, RequiredStringParam } from './param-config';

export * from 'serialize-query-params';
// @ts-ignore
export * from './types';
export {
  createRoute,
  RequiredNumberParam,
  RequiredStringParam,
  useQueryParam,
  useQueryParams,
};
