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
      </div>
    </div>
  );
};
