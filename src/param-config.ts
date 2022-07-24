import { QueryParamConfig } from 'serialize-query-params/lib/types';
import { NumberParam, StringParam } from 'serialize-query-params';

export const RequiredNumberParam: QueryParamConfig<number, number> = {
  encode: (value) => NumberParam.encode(value),
  decode: (value) => {
    const result = NumberParam.decode(value);
    if (result === null || result === undefined || isNaN(result)) {
      throw new Error(`Unable to convert '${value}' to number`);
    }
    return result;
  },
};
export const RequiredStringParam: QueryParamConfig<string, string> = {
  encode: (value) => StringParam.encode(value),
  decode: (value) => {
    const result = StringParam.decode(value);
    if (result === null || result === undefined) {
      throw new Error(`Param isnt defined`);
    }
    return result;
  },
};
