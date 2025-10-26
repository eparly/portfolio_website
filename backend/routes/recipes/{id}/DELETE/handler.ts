import { APIGatewayProxyHandler } from "aws-lambda";
import { DeleteRecipeController } from "./controller";

export const handler: APIGatewayProxyHandler = async (eventName, context) => {
    const controller = new DeleteRecipeController();

    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,DELETE,GET",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    const recipeId = eventName.pathParameters?.id;
    if (!recipeId) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Bad Request, Missing Recipe ID" }),
        };
    }

    try {
        await controller.deleteRecipe(recipeId);
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Recipe deleted successfully" }),
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
}