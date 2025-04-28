import { APIGatewayProxyHandler } from 'aws-lambda';
import { GetRecipesController } from './controller';

export const handler: APIGatewayProxyHandler = async (event, context) => {
    const controller = new GetRecipesController();

    try {
        const queryStringParameters = event.queryStringParameters;
        if (queryStringParameters && queryStringParameters.search) {
            const search = queryStringParameters.search;
            const response = await controller.searchRecipes(search);
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
                body: JSON.stringify(response),
            };
        }
        const response = await controller.getRecipes();
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            body: JSON.stringify(response),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }

}