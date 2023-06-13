import {
  DecodedValueMap,
  QueryParamConfig,
  QueryParamConfigMap,
} from 'serialize-query-params';
import { ParamParseKey, PathMatch } from 'react-router';
import { SetQueryLocal } from './useQueryParams';

declare type _PathParam2<Path extends string> =
  Path extends `${infer L}/${infer R}`
    ? _PathParam2<L> | _PathParam2<R>
    : Path extends `:${infer Param}`
    ? Param
    : never;
/**
 * Examples:
 * "/a/b/*" -> "*"
 * ":a" -> "a"
 * "/a/:b" -> "b"
 * "/a/blahblahblah:b" -> "b"
 * "/:a/:b" -> "a" | "b"
 * "/:a/b/:c/*" -> "a" | "c" | "*"
 * "/:a/b/:c?/*" -> "a" | "c?" | "*"
 */
declare type PathParam2<Path extends string> = Path extends '*' | '/*'
  ? '*'
  : Path extends `${infer Rest}/*`
  ? '*' | _PathParam2<Rest>
  : _PathParam2<Path>;

// ParamParseKeyOptional<'/asd/:id/:type?'> = 'id' | 'type?'
export declare type ParamParseKeyOptional<Segment extends string> = [
  PathParam2<Segment>,
] extends [never]
  ? string
  : PathParam2<Segment>;
export declare type Params<Key extends string = string> = {
  readonly [key in Key as key extends `${infer _Param}?` ? never : key]:
    | string
    | number;
} & {
  readonly [key in Key as key extends `${infer Param}?` ? Param : never]?:
    | string
    | number
    | undefined;
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
      params: Omit<DecodedValueMapInLink<ParamsConfig, ParamKey>, '*'>,
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
  [P in ParamKey as P extends `${infer _Param}?`
    ? never
    : P]: ParamsMap[P] extends QueryParamConfig<any, any>
    ? ReturnType<ParamsMap[P]['decode']>
    : string;
} & {
  [P in ParamKey as P extends `${infer Param}?`
    ? Param
    : never]?: ParamsMap[P] extends QueryParamConfig<any, any>
    ? ReturnType<ParamsMap[P]['decode']> | undefined
    : string | undefined;
};

export declare type DecodedValueMapInLink<
  ParamsMap extends ParamTypes<ParamKey>,
  ParamKey extends string = string,
> = {
  [P in ParamKey as P extends `${infer _Param}?`
    ? never
    : P]: ParamsMap[P] extends QueryParamConfig<any, any>
    ? ReturnType<ParamsMap[P]['decode']>
    : string | number;
} & {
  [P in ParamKey as P extends `${infer Param}?`
    ? Param
    : never]?: ParamsMap[P] extends QueryParamConfig<any, any>
    ? ReturnType<ParamsMap[P]['decode']> | undefined
    : string | number | undefined;
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
  link: ParamsFunctionType<
    Path,
    ParamsConfig,
    ParamParseKeyOptional<Path>,
    SearchParams
  >;
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
