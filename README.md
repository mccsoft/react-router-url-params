# react-router-url-params
[![npm version](https://badge.fury.io/js/react-router-url-params.svg)](https://www.npmjs.org/package/react-router-url-params)
[![npm](https://img.shields.io/npm/dt/react-router-url-params.svg)](https://www.npmjs.org/package/react-router-url-params)
[![MIT](https://img.shields.io/dub/l/vibe-d.svg)](https://opensource.org/licenses/MIT)
![Types - TypeScript](https://img.shields.io/npm/types/typescript?style=flat)

Strongly-typed way to manage your URL parameters. Works with [react-router](https://reactrouter.com/docs/en/v6/getting-started/overview).
Allows to type parameters in [routes](#createroute) and [search](#usequeryparams).


## Installation
```
yarn add react-router-url-params query-string
```
It's implied, that you have `react-router` and `react-router-dom` installed.

After that you could start using the `createRoute` and `useQueryParams`.

## createRoute
Create the route once, use it everywhere!

Just pass you URL pattern to createRoute function:
```tsx
const productPageRoute = createRoute('/products/:id');
```
optionally you could specify a type for the parameters
```tsx
const productPageRoute = createRoute('/products/:id', {id: RequiredNumberParam});
```
After that you could use it to

1. Generate a link to that page
```tsx
productPageRoute.link({id: 123}); // gives you /products/123
```
2. Read parameter values inside your page (useParams hook with types)
```tsx
const params = productPageRoute.useParams(); // gives you: { id: 123 }
```

3. Match url inside your page (useMatch hook with types)
```tsx
const match = productPageRoute.useMatch(); // gives you: { params: { id: 123 }, pathname: '/products/123', pattern: '/products/:id' } 
```
4. Match url from arbitrary place (not a hook)
```tsx
const matchAnywhere = productPageRoute.matchPath(window.location.pathname); // gives you: { params: { id: 123 }, pathname: '/products/123', pattern: '/products/:id' }
```
5. Use it in your Routes configuration:
```tsx
<Routes>
  <Route path={productPageRoute.route} element={/*your component here*/}/>
</Routes>
```


## useQueryParams
This is a port of [use-query-params](https://github.com/pbeshai/use-query-params) to react-router-v6.
Original API of `useQueryParams` and `useQueryParam` is preserved (and even [serialization engine](https://github.com/pbeshai/use-query-params/tree/master/packages/serialize-query-params) is reused).

The only change is that we are using [useSearchParams](https://reactrouter.com/docs/en/v6/hooks/use-search-params) of react-router to get and set query parameters.
Also, you don't need to wrap your app in `<QueryParamProvider></QueryParamProvider>`, because we are tied to react-router API.

Since the API is the same, you could check the [original docs](https://github.com/pbeshai/use-query-params/tree/master/packages/use-query-params) or [original demo](https://pbeshai.github.io/use-query-params/) (all credits go to [pbeshai](https://github.com/pbeshai/). 
I'm copying a part of original API description here for clarity:
**Example**

```ts
import { useQueryParams, StringParam, NumberParam } from 'react-router-url-params';

// reads query parameters `foo` and `bar` from the URL and stores their decoded values
const [query, setQuery] = useQueryParams({ foo: NumberParam, bar: StringParam });
setQuery({ foo: 500 })
setQuery({ foo: 123, bar: 'zzz' }, { replace: true });

// to unset or remove a parameter set it to undefined and use pushIn or replaceIn update types
setQuery({ foo: undefined }) // ?foo=123&bar=zzz becomes ?bar=zzz

// functional updates are also supported: this one is not supported yet
//setQuery((latestQuery) => ({ foo: latestQuery.foo + 150 }))
```


#### Param Types
See [all param definitions from serialize-query-params](https://github.com/pbeshai/use-query-params/tree/master/packages/serialize-query-params#readme). You can define your own parameter types by creating an object with an `encode` and a `decode` function. See the existing definitions for examples.

Examples in this table assume query parameter named `qp`.

| Param | Type | Example Decoded | Example Encoded |
| --- | --- | --- | --- |
| StringParam | string | `'foo'` | `?qp=foo` |
| NumberParam | number | `123` | `?qp=123` |
| ObjectParam | { key: string } | `{ foo: 'bar', baz: 'zzz' }` | `?qp=foo-bar_baz-zzz` |
| ArrayParam | string[] | `['a','b','c']` | `?qp=a&qp=b&qp=c` |
| JsonParam | any | `{ foo: 'bar' }` | `?qp=%7B%22foo%22%3A%22bar%22%7D` |
| DateParam | Date | `Date(2019, 2, 1)` | `?qp=2019-03-01` |
| BooleanParam | boolean | `true` | `?qp=1` |
| NumericObjectParam | { key: number } | `{ foo: 1, bar: 2 }` | `?qp=foo-1_bar-2` |
| DelimitedArrayParam | string[] | `['a','b','c']` | `?qp=a_b_c` |
| DelimitedNumericArrayParam | number[] | `[1, 2, 3]` | `?qp=1_2_3` |



## Contributions and support
Issues and Pull Requests are welcome.

For any kind of private consulting or support you could contact [Artur Drobinskiy](https://github.com/Shaddix) directly via email.
