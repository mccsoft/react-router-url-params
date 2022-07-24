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
        <Link to={Links.Array.link(undefined, { qwe: 2 })}>Array</Link>
      </div>
      <div>
        <Link to={Links.Test.link()}>Test</Link>
      </div>
    </div>
  );
};
