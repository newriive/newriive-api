import { handler } from '../src';
import { APIGatewayProxyEvent, Context, Callback, APIGatewayProxyResult } from 'aws-lambda';

test('returns 200 with success message', async () => {
  const event = {} as APIGatewayProxyEvent;
  const context = {} as Context;
  const callback: Callback = () => {};
  const result = (await handler(event, context, callback)) as APIGatewayProxyResult;
  expect(result.statusCode).toBe(200);
});
