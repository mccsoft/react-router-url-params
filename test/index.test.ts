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

  it('matchPath - 0', () => {
    const link = createRoute('/products/:id/:pid?', {
      id: RequiredNumberParam,
    });
    const result = link.matchPath('/products/1/435')!;
    expect(result.params.id).toStrictEqual(1);
    expect(result.params.pid).toStrictEqual('435');
  });

  it('matchPath - last optional', () => {
    const link = createRoute('/products/:id/:pid?');
    const result = link.matchPath('/products/1/435')!;
    expect(result.params.id).toStrictEqual('1');
    expect(result.params.pid).toStrictEqual('435');
  });

  it('matchPath - both optional, both provided', () => {
    const link = createRoute('/products/:id?/:pid?');
    const result = link.matchPath('/products/1/435')!;
    expect(result.params.id).toStrictEqual('1');
    expect(result.params.pid).toStrictEqual('435');
  });

  it('matchPath - both optional, first provided', () => {
    const link = createRoute('/products/:id?/:pid?');
    const result = link.matchPath('/products/1')!;
    expect(result.params.id).toStrictEqual('1');
    expect(result.params.pid).toBeFalsy();
  });

  it('matchPath - both optional, none provided', () => {
    const link = createRoute('/products/:id?/:pid?');
    const result = link.matchPath('/products')!;
    expect(result.params.id).toBeFalsy();
    expect(result.params.pid).toBeFalsy();
  });

  // it('matchPath (react-router) - optional', () => {
  //   const result = matchPath('/products/:id?/', '/products/1');
  //   expect(result.params.id).toStrictEqual('1');
  // });

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

  it('link - optional parameters', () => {
    const link = createRoute('/products/:type/:id?');
    const result1 = link.link({ type: '123' }, { asd: 'qwe' });
    expect(result1).toStrictEqual('/products/123?asd=qwe');

    const result2 = link.link({ type: '123', id: '11' }, { asd: 'qwe' });
    expect(result2).toStrictEqual('/products/123/11?asd=qwe');
  });

  it('link - optional parameters after match', () => {
    const link = createRoute('/documents/designer/:templateType/:templateId?');
    link.matchPath('/documents/designer/0');
    const result = link.link({ templateType: 0, templateId: 123 });
    expect(result).toStrictEqual('/documents/designer/0/123');
  });

  it('link - splat params', () => {
    const link = createRoute('/products/:id/*');
    const result = link.link({ id: '123' }, { asd: 'qwe' });
    expect(result).toStrictEqual('/products/123?asd=qwe');
  });

  it('link - 0 as value', () => {
    const link = createRoute('/products/:id');
    const result = link.link({ id: 0 });
    expect(result).toStrictEqual('/products/0');
  });

  it('link - null as value', () => {
    const link = createRoute('/products/:id?');
    const result = link.link({ id: null! });
    expect(result).toStrictEqual('/products');
  });

  it('link - undefined as value', () => {
    const link = createRoute('/products/:id?');
    const result = link.link({ id: undefined! });
    expect(result).toStrictEqual('/products');
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

  it('link - search - number - undefined', () => {
    const link = createRoute('/products', undefined, { price: NumberParam });
    const result = link.link({ price: undefined });
    expect(result).toStrictEqual('/products');
  });

  it('link - search - number - null', () => {
    const link = createRoute('/products', undefined, { price: NumberParam });
    const result = link.link({ price: null });
    expect(result).toStrictEqual('/products');
  });

  it('link - search - number - value', () => {
    const link = createRoute('/products', undefined, { price: NumberParam });
    const result = link.link({ price: 1 });
    expect(result).toStrictEqual('/products?price=1');
  });

  it('link - search - array - non configured param', () => {
    const link = createRoute('/products', undefined, { price: NumberParam });
    const result = link.link({ arr: ['qwe', 'zxc'] });
    expect(result).toStrictEqual('/products?arr=qwe&arr=zxc');
  });
});
