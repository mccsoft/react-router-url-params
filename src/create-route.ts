import { ParamParseKey } from 'react-router/lib/router';
import { generatePath, matchPath, useMatch, useParams } from 'react-router-dom';
import { createSearchParams } from 'react-router-dom';
import { decodeQueryParams, encodeQueryParams } from 'serialize-query-params';
import {
  DecodedValueMap,
  Params,
  ParamsFunctionType,
  ParamTypes,
  TypedPathMatch,
  URLSearchParamsInit,
} from './types';

export function createRoute<
  ParamKey extends ParamParseKey<Path>,
  Path extends string,
  ParamsConfig extends ParamTypes<ParamKey>,
>(
  pattern: Path,
  paramTypes?: ParamsConfig,
): {
  /*
   * Use this to create link to certain page from another page, e.g. <Link to={Links.Authorized.ProductDetails({id:123})}>link</Link>
   */
  link: ParamsFunctionType<Path, ParamsConfig, ParamKey>;
  /*
   * Use this when configuring routes, e.g. <Route path={Links.Authorized.ProductDetails.route} element={<ProductDetailsPage />} />
   */
  route: string;
  /*
   * Use this when you need to match a route. Usually using it directly is not needed, consider using `useMatch` or `matchPath` instead.
   */
  pattern: Path;
  /*
   * Use this as a strong-type replacement of useParams for the route
   */
  useParams: () => DecodedValueMap<ParamsConfig, ParamKey>;
  /*
   * Use this as a strong-type replacement of useMatch for the route
   */
  useMatch: () => TypedPathMatch<ParamsConfig, ParamKey> | null;
  /*
   * Use this as a strong-type replacement of useMatch for the route
   */
  matchPath: (path: string) => TypedPathMatch<ParamsConfig, ParamKey> | null;
} {
  return {
    route: (pattern as any)?.toString(),
    pattern: pattern,
    link: ((
      params?: Params<ParamKey> | undefined,
      search?: URLSearchParamsInit,
    ) => {
      const encodedParams = paramTypes
        ? encodeQueryParams(paramTypes as any, params as any)
        : params;
      let result = generatePath(pattern, encodedParams as any);
      if (search) {
        result = result + '?' + createSearchParams(search as any);
      }
      return result.replace('*', '');
    }) as any,
    useParams: () => {
      const params = useParams();
      if (paramTypes) {
        return decodeQueryParams(paramTypes as any, params as any) as any;
      }
      return params as any;
    },
    useMatch: () => {
      const match = useMatch(pattern);

      if (match) {
        if (paramTypes)
          match.params = decodeQueryParams(
            paramTypes as any,
            match.params,
          ) as any;
      }
      return match as any;
    },
    matchPath: (path) => {
      const match = matchPath(pattern, path);

      if (match) {
        if (paramTypes)
          match.params = decodeQueryParams(
            paramTypes as any,
            match.params as any,
          ) as any;
      }
      return match as any;
    },
  };
}
