import { ParamParseKey } from 'react-router';
import {
  createSearchParams,
  generatePath,
  matchPath,
  useMatch,
  useParams,
} from 'react-router-dom';
import {
  StringParam,
  decodeQueryParams,
  encodeQueryParams,
} from 'serialize-query-params';
import {
  CreateRouteResult,
  ParamParseKeyOptional,
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
  ParamKey extends ParamParseKey<Path>, // ParamParseKey<'/asd/:id/:type?'> = 'id' | 'type'
  Path extends string,
  ParamsConfig extends ParamTypes<ParamKey>, // ParamTypes<ParamParseKey<'/asd/:id/:type?'>> = { id?: string|undefined; type?: string|undefined; }
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
      params?: Params<ParamParseKeyOptional<Path>> | undefined, // Params<ParamParseKey<'/asd/:id/:type?'>> = { id: string | number; type?: string | number | undefined; }
      search?: URLSearchParamsInit,
    ) => {
      const realUrlParams = pattern.includes(':') ? params : null;
      const realSearchParams = pattern.includes(':') ? search : params;
      const encodedParams = urlParamsConfig
        ? encodeQueryParams(urlParamsConfig as any, realUrlParams as any)
        : realUrlParams;
      if (encodedParams) {
        Object.keys(encodedParams).forEach((key) => {
          if (typeof (encodedParams as any)[key] !== 'string')
            (encodedParams as any)[key] = (encodedParams as any)[key];
        });
      }
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
        // fix warning 'Passing through parameter * during decoding since it was not configured.'
        // even if you don't have '*' in your pattern it gets added to params
        if (params['*'] && !urlParamsConfig['*']) {
          (urlParamsConfig as any)['*'] = StringParam;
        }
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
        if (urlParamsConfig) {
          addWildcardParamIfNotExist(pattern, urlParamsConfig);

          match.params = decodeQueryParams(
            urlParamsConfig as any,
            match.params,
          ) as any;
        }
      }
      return match as any;
    },
    matchPath: (path) => {
      // we create a copy to NOT modify a `pattern` variable (that is used in e.g. `link` method).
      let localPattern = pattern;
      do {
        const currentPattern = localPattern.includes('?')
          ? localPattern.replaceAll('?', '')
          : localPattern;
        const match = matchPath(currentPattern, path);

        if (match) {
          if (urlParamsConfig) {
            addWildcardParamIfNotExist(localPattern, urlParamsConfig);
            match.params = decodeQueryParams(
              urlParamsConfig as any,
              match.params as any,
            ) as any;
          }
        } else if (localPattern.includes('?')) {
          localPattern = localPattern.substring(
            0,
            localPattern.lastIndexOf(':') - 1,
          ) as any;
          continue;
        } else {
          return null;
        }
        return match as any;
      } while (true);
    },
  };
}

function addWildcardParamIfNotExist(
  pattern: string,
  urlParamsConfig: QueryParamConfigMap,
) {
  // fix warning 'Passing through parameter * during decoding since it was not configured.'
  // even if you don't have '*' in your pattern it gets added to params
  if (pattern.includes('*') && !urlParamsConfig['*']) {
    (urlParamsConfig as any)['*'] = StringParam;
  }
}
