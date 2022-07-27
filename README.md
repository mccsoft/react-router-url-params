# react-router-url-params
[![npm version](https://badge.fury.io/js/react-router-url-params.svg)](https://www.npmjs.org/package/react-router-url-params)
[![npm](https://img.shields.io/npm/dt/react-router-url-params.svg)](https://www.npmjs.org/package/react-router-url-params)
[![MIT](https://img.shields.io/dub/l/vibe-d.svg)](https://opensource.org/licenses/MIT)
![Types - TypeScript](https://img.shields.io/npm/types/typescript?style=flat)

Strongly-typed way to manage URL parameters. Works with [react-router](https://reactrouter.com/docs/en/v6/getting-started/overview) (v6).
Allows to strong-type parameters in [routes](#createroute) and [search](#usequeryparams).


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
or you could even specify parameters that will go to _search_ part (e.g. /products/3 *?sortBy=price*), see [below](#createroute-with-search-params) for details
```tsx
const productPageRoute = createRoute('/products/:id', {id: RequiredNumberParam}, {sortBy: StringParam});
```
After that you could use it to

1. Generate a link to that page
```tsx
productPageRoute.link({id: 123}); // gives you /products/123
```
2. Read parameter values inside your page (useParams hook with types)
```tsx
const params = productPageRoute.useParams(); // gives you { id: 123 } with correct Typescript types
```

3. Match url inside your page (useMatch hook with types)
```tsx
const match = productPageRoute.useMatch(); 
// gives you: { params: { id: 123 }, pathname: '/products/123', pattern: '/products/:id' } with correct Typescript types 
```
4. Match url from arbitrary place (not a hook)
```tsx
const matchAnywhere = productPageRoute.matchPath(window.location.pathname); 
// gives you: { params: { id: 123 }, pathname: '/products/123', pattern: '/products/:id' } with correct Typescript types
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

Since the API is the same, you could check the [original docs](https://github.com/pbeshai/use-query-params/tree/master/packages/use-query-params) or [original demo](https://pbeshai.github.io/use-query-params/) (all credits go to [pbeshai](https://github.com/pbeshai/)). 
I'm copying a part of original API description here for clarity:

**Example**

```ts
import { useQueryParams, StringParam, NumberParam } from 'react-router-url-params';

// reads query parameters `foo` and `bar` from the URL and stores their decoded values
const [query, setQuery] = useQueryParams({ foo: NumberParam, bar: StringParam });
setQuery({ foo: 500 }); // will change the URL to '?foo=500'
setQuery({ foo: 123, bar: 'zzz' }, { replace: true }); // will change the URL to '?foo=123&bar=zzz'

// to unset or remove a parameter set it to undefined and use pushIn or replaceIn update types
setQuery({ foo: undefined }) // ?foo=123&bar=zzz becomes ?bar=zzz

// functional updates are also supported:
setQuery((latestQuery) => ({ foo: latestQuery.foo + 150 }))
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


## createRoute with search params
You could add `useQueryParams` support directly into `createRoute` function as well! Just add a 3rd parameter to `createRoute`, specifying the types of your *search* parameters:
```tsx
const productPageRoute = createRoute('/products/:id', {id: RequiredNumberParam}, {sortBy: StringParam});
```
After that you could use `.link` to generate a URL:
```tsx
productPageRoute.link({id: 123}, {sortBy: 'price'}); 
// gives you /products/123?sortBy=price, and Typescript hints you about available parameters
```
and you could use `.useParams` to read *search* parameters as well:
```tsx
const params = productPageRoute.useParams(); 
// gives you { id: 123, queryParams: { sortBy: 'price' }, setQueryParams: (params: {sortBy: string}) => void } with correct Typescript types
const sortBy = params.queryParams.sortBy; // sortBy will be typed according to the definition in createRoute
params.setQueryParams({ sortBy: 'availabilityDate' }); // this will change the searchParam. Function argument will be correctly typed as well
```
Note that `useMatch` and `matchPath` **do not** have the `queryParams` and `setQueryParams` props. If you'd like them to be added, please create an issue!

## Contributions and support
Issues and Pull Requests are welcome.

For any kind of private consulting or support you could contact [Artur Drobinskiy](https://github.com/Shaddix) directly via email.
