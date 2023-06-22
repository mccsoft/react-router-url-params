import {
  decodeQueryParams,
  encodeQueryParams,
  StringParam,
  DecodedValueMap,
  QueryParamConfig,
  QueryParamConfigMap,
} from 'serialize-query-params';
import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo, useRef } from 'react';
import shallowEqual from './shallowEqual';
import queryString from 'query-string';

type NewValueType<D> = D | ((latestValue: D) => D);
export type SetQueryLocal<QPCMap extends QueryParamConfigMap> = (
  changes:
    | Partial<DecodedValueMap<QPCMap>>
    | ((
        latestValues: DecodedValueMap<QPCMap>,
      ) => Partial<DecodedValueMap<QPCMap>>),
  navigateOptions?:
    | {
        replace?: boolean | undefined;
        state?: any;
      }
    | undefined,
) => void;

const useQueryParamsDefaultResult = [{}, () => {}];

/**
 * Given a query parameter configuration (mapping query param name to { encode, decode }),
 * return an object with the decoded values and a setter for updating them.
 */
export const useQueryParams = <QPCMap extends QueryParamConfigMap>(
  paramConfigMap: QPCMap,
): [DecodedValueMap<QPCMap>, SetQueryLocal<QPCMap>] => {
  const paramConfigMapRef = useRef(paramConfigMap);
  paramConfigMap = shallowEqual(paramConfigMap, paramConfigMapRef.current)
    ? paramConfigMapRef.current
    : paramConfigMap;
  paramConfigMapRef.current = paramConfigMap;

  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsStringified = searchParams.toString();
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  const result = useMemo(() => {
    if (paramConfigMap) {
      return decodeQueryParams(
        paramConfigMap,
        queryString.parse(searchParamsStringified) as any,
      );
    }
    return {};
  }, [searchParamsStringified]);
  const resultRef = useRef(result);
  resultRef.current = result;

  const setValue: SetQueryLocal<QPCMap> = useCallback(
    (changes, navigateOptions) => {
      const values =
        typeof changes === 'function'
          ? changes(resultRef.current as any)
          : changes;
      const encoded = encodeQueryParams(paramConfigMapRef.current, values);
      setSearchParams(queryString.stringify(encoded), navigateOptions);
    },
    [setSearchParams],
  );

  return useMemo(
    () =>
      paramConfigMap === null || paramConfigMap === undefined
        ? (useQueryParamsDefaultResult as any)
        : [result as any, setValue],
    [searchParamsStringified, setValue],
  );
};

export declare type SetValue<D> = (
  newValue: NewValueType<D>,
  navigateOptions?:
    | {
        replace?: boolean | undefined;
        state?: any;
      }
    | undefined,
) => void;

/**
 * Helper to get the latest decoded value with smart caching.
 * Abstracted into its own function to allow re-use in a functional setter (#26)
 */
export const useQueryParam = <D, D2 = D>(
  name: string,
  paramConfig: QueryParamConfig<D, D2> = StringParam as QueryParamConfig<any>,
): [D2, SetValue<D>] => {
  const [queryParams, setQueryParams] = useQueryParams({
    [name]: paramConfig,
  });
  const setValue: SetValue<D> = useCallback((value, navigateOptions) => {
    if (typeof value === 'function') {
      setQueryParams((oldValues) => {
        oldValues[name] = (value as any)(oldValues[name]);
        return oldValues;
      });
    } else {
      setQueryParams({ [name]: value } as any, navigateOptions);
    }
  }, []);
  return useMemo(
    () => [queryParams[name], setValue],
    [queryParams[name], setValue],
  );
};
