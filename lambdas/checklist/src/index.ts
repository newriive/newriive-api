import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  console.debug('Received event:', JSON.stringify(event, null, 2));
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Checklist item created' }),
  };
};
