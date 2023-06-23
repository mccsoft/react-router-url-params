import { Link } from 'react-router-dom';
import { Links } from './Links';
import { useNavigate, useParams } from 'react-router';

export const RoutingTestPage = () => {
  const { queryParams } = Links.RoutingTest.useParams();
  const navigate = useNavigate();
  return (
    <div>
      <Link to={Links.Index.link()}>Back</Link>
      <div>This page uses useNavigate and link to change values</div>
      <div>
        page: {JSON.stringify(queryParams.num)}
        <button
          onClick={() => {
            navigate(Links.RoutingTest.link({ num: undefined }));
          }}
        >
          Set to undefined
        </button>
        <button
          onClick={() => {
            navigate(Links.RoutingTest.link({ num: null }));
          }}
        >
          Set to null
        </button>
        <button
          onClick={() => {
            navigate(Links.RoutingTest.link({ num: 0 }));
          }}
        >
          Set to 0
        </button>
        <button
          onClick={() => {
            navigate(Links.RoutingTest.link({ num: 1337 }));
          }}
        >
          Set to 1337
        </button>
      </div>
      <div>
        sortby: {queryParams.sortBy}
        <button
          onClick={() => {
            navigate(Links.RoutingTest.link({ sortBy: undefined }));
          }}
        >
          Set to undefined
        </button>
        <button
          onClick={() => {
            navigate(Links.RoutingTest.link({ sortBy: null }));
          }}
        >
          Set to null
        </button>
        <button
          onClick={() => {
            navigate(Links.RoutingTest.link({ sortBy: 'asd' }));
          }}
        >
          Set to 'asd'
        </button>
      </div>
      <div>
        boolean: {JSON.stringify(queryParams.bool)}
        <button
          onClick={() => {
            navigate(Links.RoutingTest.link({ bool: true }));
          }}
        >
          Set to true
        </button>
        <button
          onClick={() => {
            navigate(Links.RoutingTest.link({ bool: false }));
          }}
        >
          Set to false
        </button>
      </div>
      <div>
        date: {queryParams.date?.toString()}
        <button
          onClick={() => {
            navigate(Links.RoutingTest.link({ date: new Date(2020, 10, 2) }));
          }}
        >
          Set to 2020-10-02
        </button>
        <button
          onClick={() => {
            navigate(Links.RoutingTest.link({ date: new Date(2021, 11, 1) }));
          }}
        >
          Set to 2021-11-01
        </button>
      </div>
      <div>
        obj: {JSON.stringify(queryParams.obj)}
        <button
          onClick={() => {
            navigate(
              Links.RoutingTest.link({
                obj: { asd: 'poi', tyu: 'g1', rty: 'uu' },
              }),
            );
          }}
        >
          Set to {JSON.stringify({ asd: 'poi', tyu: 'g1', rty: 'uu' })}
        </button>
        <button
          onClick={() => {
            navigate(Links.RoutingTest.link({ obj: { asd: 'zxc', tyu: '1' } }));
          }}
        >
          Set to {JSON.stringify({ asd: 'zxc', tyu: '1' })}
        </button>
        <button
          onClick={() => {
            navigate(Links.RoutingTest.link({ obj: null }));
          }}
        >
          Set to null
        </button>
      </div>
      <div>
        delimitedArray: {JSON.stringify(queryParams.delimitedArray)}
        <button
          onClick={() => {
            navigate(
              Links.RoutingTest.link({ delimitedArray: ['asd', 'zxc'] }),
            );
          }}
        >
          Set to ['asd','zxc']
        </button>
        <button
          onClick={() => {
            navigate(
              Links.RoutingTest.link({ delimitedArray: ['qwe', '123'] }),
            );
          }}
        >
          Set to ['qwe', '123']
        </button>
        <button
          onClick={() => {
            navigate(Links.RoutingTest.link({ delimitedArray: [] }));
          }}
        >
          Set to []
        </button>
        <button
          onClick={() => {
            navigate(Links.RoutingTest.link({ delimitedArray: null }));
          }}
        >
          Set to null
        </button>
        <button
          onClick={() => {
            navigate(Links.RoutingTest.link({ delimitedArray: undefined }));
          }}
        >
          Set to undefined
        </button>
      </div>
      <div>queryParams: {JSON.stringify(queryParams)}</div>
    </div>
  );
};
