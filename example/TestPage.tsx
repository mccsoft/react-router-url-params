import { useQueryParams } from '../src';
import { StringParam } from 'serialize-query-params';
import { Link } from 'react-router-dom';
import { Links } from './Links';

export const TestPage = () => {
  const [queryParams, setQueryParams] = useQueryParams({
    sortBy: StringParam,
  });
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
    </div>
  );
};
