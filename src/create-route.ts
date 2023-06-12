import { ParamParseKey } from 'react-router';
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
import { QueryParamConfigMap } from 'serialize-query-params';
import { useQueryParams } from './useQueryParams';

/**
 *  Generates various hooks and helpers based on URL pattern and optional parameter types.
 *  @param {string} pattern - the URL pattern (e.g. '/products/:id').
 *  @param {any} urlParamsConfig - object that specifies the types of URL parameters in a pattern (e.g. { id: RequiredNumberParam })
 *  @param {any} searchParamsConfig - object that specifies the types of Search (i.e. ?name=flower&color=yellow) parameters (e.g. { name: StringParam })
 */
export function createRoute<
  ParamKey extends ParamParseKey<Path>,
  Path extends string,
  ParamsConfig extends ParamTypes<ParamKey>,
  SearchParams extends QueryParamConfigMap,
>(
  pattern: Path,
  urlParamsConfig?: Path extends `${string}:${string}`
    ? ParamsConfig
    : undefined,
  searchParamsConfig?: SearchParams,
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
      const encodedParams = urlParamsConfig
        ? encodeQueryParams(urlParamsConfig as any, realUrlParams as any)
        : realUrlParams;

      let result = generatePath(pattern, encodedParams as any);

      if (realSearchParams) {
        result =
          result +
          '?' +
          createSearchParams(
            searchParamsConfig
              ? encodeQueryParams(
                  searchParamsConfig as any,
                  realSearchParams as any,
                )
              : (realSearchParams as any),
          );
      }
      return result.replace('*', '');
    }) as any,
    useParams: () => {
      let params = useParams() as any;
      const [queryParams, setQueryParams] = useQueryParams(searchParamsConfig!);
      if (urlParamsConfig) {
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
