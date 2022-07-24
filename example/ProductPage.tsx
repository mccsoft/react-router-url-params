import { useQueryParam } from '../src';
import { StringParam, withDefault } from 'serialize-query-params';
import { Link } from 'react-router-dom';
import { Links } from './Links';

export const ProductPage = () => {
  const params = Links.Product.useParams();
  const [search, setSearch] = useQueryParam(
    'search',
    withDefault(StringParam, '')
  );
  return (
    <div>
      <Link to={Links.Index.link()}>Back</Link>
      <div>ProductId: {params.id}</div>
      <div>Search: {search}</div>
      <input
        name="search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
    </div>
  );
};
