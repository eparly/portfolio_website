import { DynamoDB } from "aws-sdk";

export class DeleteRecipeController {
    private readonly db: DynamoDB.DocumentClient;
    private tableName: string;
    constructor() {
        this.db = new DynamoDB.DocumentClient();
        this.tableName = process.env.TABLE_NAME || "RecipesTable"; // Replace with your actual table name
    }

    public async deleteRecipe(recipeId: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                recipeId: recipeId,
            },
        };
        try {
            await this.db.delete(params).promise();
        } catch (error) {
            console.error("Error deleting recipe:", error);
            throw new Error("Error deleting recipe from the database");
        }
    }

}