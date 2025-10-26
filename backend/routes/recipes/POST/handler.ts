import { APIGatewayProxyHandler } from 'aws-lambda';
import { AddRecipeController } from './controller';
import { AddRecipeRequest } from './types';
import { v4 as uuidv4 } from 'uuid';


export const handler: APIGatewayProxyHandler = async (event, context) => {
    const controller = new AddRecipeController();
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    if (event.body === null || event.body === undefined) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Bad Request, Missing Body' }),
        };
    }
    const recipe: AddRecipeRequest = JSON.parse(event.body);

    const recipeId = uuidv4();
    console.log('recipeId', recipeId);

    try {
        const presignedUrl = await controller.generatePresignedUrl(recipeId);
        const response = await controller.addRecipe(recipe, recipeId);
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                ...response,
                presignedUrl
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
}