import { capitalize } from '../src/filters';

test(`capitalize --- 'params' --- 'Params'`, () => {
  expect(capitalize('params')).toBe('Params');
});
