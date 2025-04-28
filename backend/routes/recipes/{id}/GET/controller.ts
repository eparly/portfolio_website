import DynamoDB from "aws-sdk/clients/dynamodb";
import { GetRecipeResponse } from "./types";

export class GetRecipeController {
    private db: DynamoDB.DocumentClient;
    private tableName: string;
    constructor() {
        this.db = new DynamoDB.DocumentClient();
        this.tableName = "RecipesTable"; // Replace with your actual table name
    }

    public async getRecipe(recipeId: string): Promise<GetRecipeResponse> {
        const params = {
            TableName: this.tableName,
            Key: {
                recipeId: recipeId,
            },
        };
        try {
            const result = await this.db.get(params).promise();
            if (!result.Item) {
                throw new Error("Recipe not found");
            }
            return result.Item as GetRecipeResponse;
        } catch (error) {
            console.error("Error getting recipe:", error);
            throw new Error("Error getting recipe from the database");
        }
    }
    
}