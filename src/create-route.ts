import { ParamParseKey } from 'react-router/lib/router';
import {
  createSearchParams,
  generatePath,
  matchPath,
  useMatch,
  useParams,
} from 'react-router-dom';
import { decodeQueryParams, encodeQueryParams } from 'serialize-query-params';
import {
  CreateRouteResult,
  Params,
  ParamTypes,
  URLSearchParamsInit,
} from './types';
import { QueryParamConfigMap } from 'serialize-query-params/lib/types';
import { useQueryParams } from './useQueryParams';

export function createRoute<
  ParamKey extends ParamParseKey<Path>,
  Path extends string,
  ParamsConfig extends ParamTypes<ParamKey>,
  SearchParams extends QueryParamConfigMap,
>(
  pattern: Path,
  searchParams?: Path extends `${infer Start}:${infer End}`
    ? never
    : SearchParams,
): CreateRouteResult<ParamKey, Path, ParamsConfig, SearchParams>;
export function createRoute<
  ParamKey extends ParamParseKey<Path>,
  Path extends string,
  ParamsConfig extends ParamTypes<ParamKey>,
  SearchParams extends QueryParamConfigMap,
>(
  pattern: Path,
  urlParams?: Path extends `${infer Start}:${infer End}`
    ? ParamsConfig
    : SearchParams,
  searchParams?: Path extends `${infer Start}:${infer End}`
    ? SearchParams
    : never,
): CreateRouteResult<ParamKey, Path, ParamsConfig, SearchParams>;
export function createRoute<
  ParamKey extends ParamParseKey<Path>,
  Path extends string,
  ParamsConfig extends ParamTypes<ParamKey>,
  SearchParams extends QueryParamConfigMap,
>(
  pattern: Path,
  urlParamsConfig?: Path extends `${infer Start}:${infer End}`
    ? ParamsConfig
    : SearchParams,
  searchParamsConfig?: Path extends `${infer Start}:${infer End}`
    ? SearchParams
    : never,
): CreateRouteResult<ParamKey, Path, ParamsConfig, SearchParams> {
  return {
    route: (pattern as any)?.toString(),
    pattern: pattern,
    link: ((
      params?: Params<ParamKey> | undefined,
      search?: URLSearchParamsInit,
    ) => {
      const realUrlParams = pattern.includes(':') ? params : null;
      const realSearchParams = pattern.includes(':') ? search : params;
      const realUrlParamsConfig = pattern.includes(':')
        ? urlParamsConfig
        : null;
      const realSearchParamsConfig = pattern.includes(':')
        ? urlParamsConfig!
        : searchParamsConfig!;
      const encodedParams = realUrlParamsConfig
        ? encodeQueryParams(realUrlParamsConfig as any, realUrlParams as any)
        : realUrlParams;

      let result = generatePath(pattern, encodedParams as any);

      if (realSearchParams) {
        result =
          result +
          '?' +
          createSearchParams(
            realSearchParamsConfig
              ? encodeQueryParams(
                  realSearchParamsConfig as any,
                  realSearchParams as any,
                )
              : (realSearchParams as any),
          );
      }
      return result.replace('*', '');
    }) as any,
    useParams: () => {
      let params = useParams() as any;
      const realSearchParamsConfig = pattern.includes(':')
        ? searchParamsConfig!
        : urlParamsConfig!;
      const realUrlParamsConfig = pattern.includes(':')
        ? urlParamsConfig
        : null;
      const [queryParams, setQueryParams] = useQueryParams(
        realSearchParamsConfig,
      );
      if (realUrlParamsConfig) {
        params = decodeQueryParams(
          urlParamsConfig as any,
          params as any,
        ) as any;
      }
      params.queryParams = queryParams;
      params.setQueryParams = setQueryParams;
      return params;
    },
    useMatch: () => {
      const match = useMatch(pattern);

      if (match) {
        if (urlParamsConfig)
          match.params = decodeQueryParams(
            urlParamsConfig as any,
            match.params,
          ) as any;
      }
      return match as any;
    },
    matchPath: (path) => {
      const match = matchPath(pattern, path);

      if (match) {
        if (urlParamsConfig)
          match.params = decodeQueryParams(
            urlParamsConfig as any,
            match.params as any,
          ) as any;
      }
      return match as any;
    },
  };
}
