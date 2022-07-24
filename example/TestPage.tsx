import { useQueryParam, useQueryParams } from '../src';
import {
  BooleanParam,
  DateParam,
  DelimitedArrayParam,
  ObjectParam,
  StringParam,
} from 'serialize-query-params';
import { Link } from 'react-router-dom';
import { Links } from './Links';

export const TestPage = () => {
  const [queryParams, setQueryParams] = useQueryParams({
    sortBy: StringParam,
    bool: BooleanParam,
    date: DateParam,
    obj: ObjectParam,
    delimitedArray: DelimitedArrayParam,
  });
  const [, setBool] = useQueryParam('bool', BooleanParam);
  return (
    <div>
      <Link to={Links.Index.link()}>Back</Link>
      <div>
        sortby: {queryParams.sortBy}
        <button
          onClick={() => {
            setQueryParams({ sortBy: undefined });
          }}
        >
          Set to undefined
        </button>
        <button
          onClick={() => {
            setQueryParams({ sortBy: 'asd' });
          }}
        >
          Set to 'asd'
        </button>
      </div>
      <div>
        boolean: {queryParams.bool === true ? 'true' : 'false'}
        <button
          onClick={() => {
            setQueryParams({ bool: true });
          }}
        >
          Set to true
        </button>
        <button
          onClick={() => {
            setQueryParams({ bool: false });
          }}
        >
          Set to false
        </button>
        <button
          onClick={() => {
            setQueryParams((old) => {
              old.bool = false;
              return old;
            });
          }}
        >
          Set to false using function
        </button>
        <button
          onClick={() => {
            setBool((old) => !old);
          }}
        >
          Toggle using useQueryParam function
        </button>
      </div>
      <div>
        date: {queryParams.date?.toString()}
        <button
          onClick={() => {
            setQueryParams({ date: new Date(2020, 10, 2) });
          }}
        >
          Set to 2020-10-02
        </button>
        <button
          onClick={() => {
            setQueryParams({ date: new Date(2021, 11, 1) });
          }}
        >
          Set to 2021-11-01
        </button>
      </div>
      <div>
        obj: {JSON.stringify(queryParams.obj)}
        <button
          onClick={() => {
            setQueryParams({ obj: { asd: 'poi', tyu: 'g1', rty: 'uu' } });
          }}
        >
          Set to {JSON.stringify({ asd: 'poi', tyu: 'g1', rty: 'uu' })}
        </button>
        <button
          onClick={() => {
            setQueryParams({ obj: { asd: 'zxc', tyu: '1' } });
          }}
        >
          Set to {JSON.stringify({ asd: 'zxc', tyu: '1' })}
        </button>
      </div>
      <div>
        delimitedArray: {JSON.stringify(queryParams.delimitedArray)}
        <button
          onClick={() => {
            setQueryParams({ delimitedArray: ['asd', 'zxc'] });
          }}
        >
          Set to ['asd','zxc']
        </button>
        <button
          onClick={() => {
            setQueryParams({ delimitedArray: ['qwe', '123'] });
          }}
        >
          Set to ['qwe', '123']
        </button>
      </div>
    </div>
  );
};
