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
        <Link
          to={Links.UseQueryParamsWithParameterInUrl.link(
            { id: 1 },
            { nmb: 1, str: 'qwe' },
          )}
        >
          useQueryParams in createRoute with url parameters
        </Link>
      </div>
      <div>
        <Link
          to={Links.UseQueryParamsWithoutParameterInUrl.link({
            nmb: 1,
            str: 'qwe',
          })}
        >
          useQueryParams in createRoute without url parameters
        </Link>
      </div>
      <div>
        <Link to={Links.Test.link()}>Test</Link>
      </div>
      <div>
        <Link to={Links.RoutingTest.link()}>RoutingTest</Link>
      </div>
    </div>
  );
};
