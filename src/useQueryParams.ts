import {
  DecodedValueMap,
  QueryParamConfig,
  QueryParamConfigMap,
} from 'serialize-query-params/lib/types';
import {
  decodeQueryParams,
  encodeQueryParams,
  StringParam,
} from 'serialize-query-params';
import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo, useRef } from 'react';
import shallowEqual from './shallowEqual';

type NewValueType<D> = D | ((latestValue: D) => D);
export type SetQueryLocal<QPCMap extends QueryParamConfigMap> = (
  changes: Partial<DecodedValueMap<QPCMap>>,
  navigateOptions?:
    | {
        replace?: boolean | undefined;
        state?: any;
      }
    | undefined
) => void;

/**
 * Given a query parameter configuration (mapping query param name to { encode, decode }),
 * return an object with the decoded values and a setter for updating them.
 */
export const useQueryParams = <QPCMap extends QueryParamConfigMap>(
  paramConfigMap: QPCMap
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
    const value: Record<keyof QPCMap, string> = {} as any;
    Object.keys(paramConfigMap).forEach((key) => {
      (value as any)[key] = searchParams.getAll(key);
    });
    return decodeQueryParams(paramConfigMap, value);
  }, [searchParamsStringified]);

  const setValue: SetQueryLocal<QPCMap> = useCallback(
    (value, navigateOptions) => {
      const encoded = encodeQueryParams(paramConfigMap, value);
      Object.keys(value).forEach((key) => {
        const keyValue = (encoded as any)[key];
        if (Array.isArray(keyValue)) {
          keyValue.forEach((v, index) => {
            if (index === 0) searchParamsRef.current.set(key, v);
            else searchParamsRef.current.append(key, v);
          });
        } else {
          if (keyValue === undefined || keyValue === null) {
            searchParamsRef.current.delete(key);
          } else {
            searchParamsRef.current.set(key, keyValue);
          }
        }
      });

      setSearchParams(searchParamsRef.current, navigateOptions);
    },
    [paramConfigMap, setSearchParams]
  );

  return useMemo(
    () => [result as any, setValue],
    [searchParamsStringified, setValue]
  );
};

export declare type SetValue<D> = (
  newValue: NewValueType<D>,
  navigateOptions?:
    | {
        replace?: boolean | undefined;
        state?: any;
      }
    | undefined
) => void;

/**
 * Helper to get the latest decoded value with smart caching.
 * Abstracted into its own function to allow re-use in a functional setter (#26)
 */
export const useQueryParam = <D, D2 = D>(
  name: string,
  paramConfig: QueryParamConfig<D, D2> = StringParam as QueryParamConfig<any>
): [D2, SetValue<D>] => {
  const [queryParams, setQueryParams] = useQueryParams({
    [name]: paramConfig,
  });
  const setValue: SetValue<D> = useCallback((value, navigateOptions) => {
    setQueryParams({ [name]: value } as any, navigateOptions);
  }, []);
  return useMemo(
    () => [queryParams[name], setValue],
    [queryParams[name], setValue]
  );
};
