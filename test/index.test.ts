import { createRoute, RequiredNumberParam } from '../src';
import { NumberParam, StringParam } from 'serialize-query-params';

describe('strongly typed links', () => {
  it('matchPath - number', () => {
    const link = createRoute('/products/:id', { id: RequiredNumberParam });
    const result = link.matchPath('/products/123')!;
    expect(result.params.id).toStrictEqual(123);
  });

  it('matchPath - number - string is used in link - error', () => {
    const link = createRoute('/products/:id', { id: RequiredNumberParam });
    expect(() => link.matchPath('/products/zxc')).toThrow('Unable to convert');
  });

  it('matchPath - string', () => {
    const link = createRoute('/products/:id');
    const result = link.matchPath('/products/123')!;
    expect(result.params.id).toStrictEqual('123');
  });

  it('matchPath - some params are not specified', () => {
    const link = createRoute('/products/:id/details/:pid', {
      id: RequiredNumberParam,
    });
    const result = link.matchPath('/products/123/details/435')!;
    expect(result.params.id).toStrictEqual(123);
    expect(result.params.pid).toStrictEqual('435');
  });

  it('link - number', () => {
    const link = createRoute('/products/:id', { id: RequiredNumberParam });
    const result = link.link({ id: 123 });
    expect(result).toStrictEqual('/products/123');
  });

  it('link - string param, pass number', () => {
    const link = createRoute('/products/:id');
    const result = link.link({ id: 123 });
    expect(result).toStrictEqual('/products/123');
  });

  it('link - string param, pass string', () => {
    const link = createRoute('/products/:id');
    const result = link.link({ id: '123' });
    expect(result).toStrictEqual('/products/123');
  });

  it('link - search params', () => {
    const link = createRoute('/products/:id');
    const result = link.link({ id: '123' }, { asd: 'qwe' });
    expect(result).toStrictEqual('/products/123?asd=qwe');
  });

  it('link - search params without url params', () => {
    const link = createRoute('/products', undefined, { zxc: StringParam });
    const result = link.link({ zxc: 'qwe' });
    expect(result).toStrictEqual('/products?zxc=qwe');
  });

  it('link - typed search params, url with parameter', () => {
    const link = createRoute(
      '/products/:id',
      { id: RequiredNumberParam },
      { zxc: StringParam },
    );
    const result = link.link({ id: 123 }, { zxc: 'hh' });
    expect(result).toStrictEqual('/products/123?zxc=hh');
  });

  it('link - splat params', () => {
    const link = createRoute('/products/:id/*');
    const result = link.link({ id: '123' }, { asd: 'qwe' });
    expect(result).toStrictEqual('/products/123?asd=qwe');
  });

  it('the following lines should give typescript errors', () => {
    // noinspection JSUnusedLocalSymbols
    const link = createRoute('/products/:id', { id: RequiredNumberParam });
    // noinspection JSUnusedLocalSymbols
    const link2 = createRoute(
      '/products/:id',
      { id: RequiredNumberParam },
      { q: NumberParam },
    );
    // const link3 = createRoute(
    //   '/products',
    //   { id: NumberParam },
    //   { q: NumberParam },
    // );
    // link.link();
    // link.link({});
    // link.link({ zxc: 123 });
    // link.link({ id: '123' });
    // link2.useParams().queryParams.qw;
  });
});
