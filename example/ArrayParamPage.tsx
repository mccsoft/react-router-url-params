import { useQueryParams } from '../src';
import { NumberParam, NumericArrayParam } from 'serialize-query-params';
import { Link } from 'react-router-dom';
import { Links } from './Links';

export const ArrayParamPage = () => {
  const [queryParams, setQueryParams] = useQueryParams({
    id: NumberParam,
    ids: NumericArrayParam,
  });
  return (
    <div>
      <Link to={Links.Index.link()}>Back</Link>
      <div>
        ids: {queryParams.ids?.join(', ')}
        <button
          onClick={() => {
            setQueryParams({ ids: [2, 3] });
          }}
        >
          Change ids to 2,3
        </button>
        <button
          onClick={() => {
            setQueryParams({ ids: [3, 4] });
          }}
        >
          Change ids to 3,4
        </button>
      </div>
      <div>
        Id: {queryParams.id}
        <button onClick={() => setQueryParams({ id: 2 })}>set id to 2</button>
        <button onClick={() => setQueryParams({ id: 3 })}>set id to 3</button>
      </div>
    </div>
  );
};
