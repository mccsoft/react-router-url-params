import { createRoute, RequiredNumberParam } from '../src';

export const Links = {
  Product: createRoute('/product/:id', { id: RequiredNumberParam }),
  Array: createRoute('/array'),
  Test: createRoute('/test'),
  Index: createRoute('/'),
};
