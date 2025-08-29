import { Link } from 'react-router-dom';
import { Links } from './Links';

export const UseQueryParamsInPage = (props: {
  withParameterInUrl: boolean;
}) => {
  const { queryParams, setQueryParams, id } = props.withParameterInUrl
    ? Links.UseQueryParamsWithoutParameterInUrl.useParams()
    : Links.UseQueryParamsWithParameterInUrl.useParams();

  return (
    <div>
      <Link to={Links.Index.link()}>Back</Link>
      <div>
        <div>id: {id}</div>
        <div>str: {queryParams.str}</div>
        <div>nmb: {queryParams.nmb}</div>
        <div>asd: {JSON.stringify((queryParams as any).asd)}</div>
        <button
          onClick={() => {
            setQueryParams({ str: 'rr', nmb: 2 });
          }}
        >
          Set str: 'rr', nmb: 2
        </button>
        <button
          onClick={() => {
            setQueryParams({ str: 'pp', nmb: 23 });
          }}
        >
          Set str: 'pp', nmb: 23
        </button>
        <button
          onClick={() => {
            setQueryParams({ nmb: 1 }, 'pushIn');
          }}
        >
          PushIn nmb: 1
        </button>
        <button
          onClick={() => {
            setQueryParams({ nmb: 2 }, 'push');
          }}
        >
          Push nmb: 2
        </button>
        <button
          onClick={() => {
            setQueryParams({ nmb: 3 }, 'replaceIn');
          }}
        >
          ReplaceIn nmb: 3
        </button>
        <button
          onClick={() => {
            setQueryParams({ nmb: 4 }, 'replace');
          }}
        >
          Replace nmb: 4
        </button>
        <button
          onClick={() => {
            setQueryParams({ asd: 'qwe' } as any);
          }}
        >
          Non-present parameter (asd: 'qwe')
        </button>
        <button
          onClick={() => {
            setQueryParams({ asd: ['qwe', 'zxc'] } as any);
          }}
        >
          Non-present array parameter (asd: ['qwe', 'zxc'])
        </button>
      </div>
    </div>
  );
};
