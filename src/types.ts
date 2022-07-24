import { QueryParamConfig } from 'serialize-query-params/lib/types';
import { PathMatch } from 'react-router/lib/router';

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
> = Path extends `${infer Start}:${infer End}`
  ? (
      params: DecodedValueMapInLink<ParamsConfig, ParamKey>,
      search?: URLSearchParamsInit,
    ) => string
  : (search?: URLSearchParamsInit) => string;

export declare type ParamTypes<ParamKey extends string = string> = {
  readonly [key in ParamKey]?: QueryParamConfig<any, any>;
};

export declare type DecodedValueMap<
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
  params: DecodedValueMap<ParamsMap, ParamKey>;
};
