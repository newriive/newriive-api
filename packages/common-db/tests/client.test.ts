import { ddbDocClient } from '../src/client';

describe('ddbDocClient', () => {
  it('should be defined', () => {
    expect(ddbDocClient).toBeDefined();
  });
});
