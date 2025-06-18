import { helloShared } from '../src';

describe('helloShared', () => {
  it('greets with the provided name', () => {
    expect(helloShared('Test')).toBe('Hello, Test from shared utils!');
  });
});
