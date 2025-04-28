import { APIGatewayProxyHandler } from 'aws-lambda';
import { GetRecipeController } from './controller';
export const handler: APIGatewayProxyHandler = async (event, context) => {
    const controller = new GetRecipeController();

    const recipeId = event.pathParameters?.id;
    if (!recipeId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Bad Request, Missing Recipe ID' }),
        };
    }
    

    try {
        const response = await controller.getRecipe(recipeId);
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