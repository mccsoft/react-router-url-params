import {
  DecodedValueMap,
  QueryParamConfig,
  QueryParamConfigMap,
} from 'serialize-query-params/lib/types';
import { ParamParseKey, PathMatch } from 'react-router/lib/router';
import { SetQueryLocal } from './useQueryParams';

export declare type Params<Key extends string = string> = {
  readonly [key in Key]: string | number;
};
export declare type URLSearchParamsInit =
  | string
  | number
  | [string, string | number]
  | Record<string, string | string[] | number | number[] | undefined | null>
  | URLSearchParams;

export declare type ParamsFunctionType<
  Path extends string,
  ParamsConfig extends ParamTypes<ParamKey>,
  ParamKey extends string,
  QPCMap extends QueryParamConfigMap,
> = Path extends `${string}:${string}`
  ? (
      params: DecodedValueMapInLink<ParamsConfig, ParamKey>,
      search?: QPCMap | URLSearchParamsInit,
    ) => string
  : (search?: QPCMap | URLSearchParamsInit) => string;

export declare type ParamTypes<ParamKey extends string = string> = {
  readonly [key in ParamKey]?: QueryParamConfig<any, any>;
};

export declare type DecodedValueMapPartial<
  ParamsMap extends ParamTypes<ParamKey>,
  ParamKey extends string = string,
> = {
  [P in ParamKey]: ParamsMap[P] extends QueryParamConfig<any, any>
    ? ReturnType<ParamsMap[P]['decode']>
    : string;
};

export declare type DecodedValueMapInLink<
  ParamsMap extends ParamTypes<ParamKey>,
  ParamKey extends string = string,
> = {
  [P in ParamKey]: ParamsMap[P] extends QueryParamConfig<any, any>
    ? ReturnType<ParamsMap[P]['decode']>
    : string | number;
};

export declare type TypedPathMatch<
  ParamsMap extends ParamTypes<ParamKey>,
  ParamKey extends string = string,
> = Omit<PathMatch<ParamKey>, 'params'> & {
  /**
   * The names and values of dynamic parameters in the URL.
   */
  params: DecodedValueMapPartial<ParamsMap, ParamKey>;
};

export declare type CreateRouteResult<
  ParamKey extends ParamParseKey<Path>,
  Path extends string,
  ParamsConfig extends ParamTypes<ParamKey>,
  SearchParams extends QueryParamConfigMap,
> = {
  /*
   * Use this to create link to certain page from another page, e.g. <Link to={Links.Authorized.ProductDetails({id:123})}>link</Link>
   */
  link: ParamsFunctionType<Path, ParamsConfig, ParamKey, SearchParams>;
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
  useParams: () => DecodedValueMapPartial<ParamsConfig, ParamKey> & {
    queryParams: DecodedValueMap<SearchParams>;
    setQueryParams: SetQueryLocal<SearchParams>;
  };
  /*
   * Use this as a strong-type replacement of useMatch for the route
   */
  useMatch: () => TypedPathMatch<ParamsConfig, ParamKey> | null;
  /*
   * Use this as a strong-type replacement of useMatch for the route
   */
  matchPath: (path: string) => TypedPathMatch<ParamsConfig, ParamKey> | null;
};
