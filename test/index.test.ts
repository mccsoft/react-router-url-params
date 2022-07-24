import { createRoute, RequiredNumberParam } from '../src';

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
});
