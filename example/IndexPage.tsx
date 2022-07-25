import { Link } from 'react-router-dom';
import { Links } from './Links';

export const IndexPage = () => {
  return (
    <div>
      <div>
        <Link to={Links.Product.link({ id: 1 })}>Product 1</Link>
      </div>
      <div>
        <Link to={Links.Product.link({ id: 2 })}>Product 2</Link>
      </div>
      <div>
        <Link to={Links.Array.link({ qwe: 2 })}>Array</Link>
      </div>
      <div>
        <Link to={Links.UseQueryParams.link({ id: 1 }, { nmb: 1, str: 'qwe' })}>
          useQueryParams in createRoute
        </Link>
      </div>
      <div>
        <Link to={Links.Test.link()}>Test</Link>
      </div>
    </div>
  );
};
