import {
  decodeQueryParams,
  encodeQueryParams,
  StringParam,
  DecodedValueMap,
  QueryParamConfig,
  QueryParamConfigMap,
} from 'serialize-query-params';
import { useLocation } from 'react-router-dom';
import { useCallback, useMemo, useRef } from 'react';
import shallowEqual from './shallowEqual';
import queryString from 'query-string';
import { useNavigate } from 'react-router';

export type URLUpdateType = 'push' | 'pushIn' | 'replace' | 'replaceIn';
type NewValueType<D> = D | ((latestValue: D) => D);
export type SetQueryLocal<QPCMap extends QueryParamConfigMap> = (
  changes:
    | Partial<DecodedValueMap<QPCMap>>
    | ((
        latestValues: DecodedValueMap<QPCMap>,
      ) => Partial<DecodedValueMap<QPCMap>>),
  updateType?: URLUpdateType | undefined,
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

  const location = useLocation();
  const navigate = useNavigate();

  const result = useMemo(() => {
    if (paramConfigMap) {
      return decodeQueryParams(
        paramConfigMap,
        queryString.parse(location.search) as any,
      );
    }
    return {};
  }, [location.search]);
  const resultRef = useRef(result);
  resultRef.current = result;

  const setValue: SetQueryLocal<QPCMap> = useCallback(
    (changes, updateType) => {
      const changesToUse =
        typeof changes === 'function'
          ? changes(resultRef.current as any)
          : changes;

      let newQueryParams: ReturnType<typeof encodeQueryParams>;
      if (updateType === 'push' || updateType === 'replace') {
        newQueryParams = encodeQueryParams(
          paramConfigMapRef.current,
          changesToUse,
        );
      } else {
        newQueryParams = encodeQueryParams(paramConfigMapRef.current, {
          ...resultRef.current,
          ...changesToUse,
        });
      }

      navigate('?' + queryString.stringify(newQueryParams), {
        replace: updateType?.startsWith('replace'),
      });
    },
    [navigate],
  );

  return useMemo(
    () =>
      paramConfigMap === null || paramConfigMap === undefined
        ? (useQueryParamsDefaultResult as any)
        : [result as any, setValue],
    [result, setValue],
  );
};

export declare type SetValue<D> = (
  newValue: NewValueType<D>,
  updateType?: URLUpdateType | undefined,
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
  const setValue: SetValue<D> = useCallback((value, updateType) => {
    if (typeof value === 'function') {
      setQueryParams((oldValues) => {
        oldValues[name] = (value as any)(oldValues[name]);
        return oldValues;
      });
    } else {
      setQueryParams({ [name]: value } as any, updateType);
    }
  }, []);
  return useMemo(
    () => [queryParams[name], setValue],
    [queryParams[name], setValue],
  );
};
