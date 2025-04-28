import DynamoDB from "aws-sdk/clients/dynamodb";
import { GetRecipesResponse } from "./types";

export class GetRecipesController {
    private db: DynamoDB.DocumentClient;
    private tableName: string;
    constructor() {
        this.db = new DynamoDB.DocumentClient();
        this.tableName = "RecipesTable"; // Replace with your actual table name
    }
    async getRecipes(): Promise<GetRecipesResponse> {
        const params = {
            TableName: this.tableName,
        };
        const result = await this.db.scan(params).promise();
        if (!result.Items) {
            throw new Error("No recipes found");
        }
        const recipes = result.Items.map((item) => {
            return {
                recipeId: item.recipeId,
                title: item.title,
                ingredients: item.ingredients,
                instructions: item.instructions,
            };
        }
        );
        

        return { recipes }
    };

    async searchByTitle(title: string): Promise<GetRecipesResponse> {
        const params = {
            TableName: this.tableName,
            FilterExpression: "contains(#title, :title)",
            ExpressionAttributeNames: {
                "#title": "title",
            },
            ExpressionAttributeValues: {
                ":title": title,
            },
        };
        const result = await this.db.scan(params).promise();
        if (!result.Items) {
            throw new Error("No recipes found");
        }
        const recipes = result.Items.map((item) => {
            return {
                recipeId: item.recipeId,
                title: item.title,
                ingredients: item.ingredients,
                instructions: item.instructions,
                createdBy: item.createdBy,
                createdAt: item.createdAt,
                tags: item.tags,
            };
        });
        

        return { recipes };
    }

    async searchRecipes(search?: string) {
        if (search) {
            search = search.toLowerCase(); // Convert search term to lowercase for case-insensitive search
        }
        const filterExpressions: string[] = [];
        const expressionAttributeNames: Record<string, string> = {};
        const expressionAttributeValues: Record<string, any> = {};

        // Add search for title (case-insensitive)
        filterExpressions.push('contains(#titleLower, :search)');
        expressionAttributeNames["#titleLower"] = "titleLower"; // Assume titleLower is stored in lowercase

        // Add search for ingredients (case-insensitive, flattened list)
        filterExpressions.push('contains(#ingredientsFlattened, :search)');
        expressionAttributeNames["#ingredientsFlattened"] = "ingredientsFlattened"; // Assume ingredientsFlattened is a single string

        // Add search for tags (case-insensitive)
        filterExpressions.push('contains(#tagsLower, :search)');
        expressionAttributeNames["#tagsLower"] = "tagsLower"; // Assume tagsLower is stored in lowercase

        // Add search for createdBy (case-insensitive)
        filterExpressions.push('contains(#createdByLower, :search)');
        expressionAttributeNames["#createdByLower"] = "createdByLower"; // Assume createdByLower is stored in lowercase

        // Set the search value
        expressionAttributeValues[":search"] = search;

        const params = {
            TableName: this.tableName,
            FilterExpression: filterExpressions.join(' OR '),
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
        };

        console.log("params", params);

        const result = await this.db.scan(params).promise();
        if (!result.Items) {
            throw new Error("No recipes found");
        }
        const recipes = result.Items.map((item) => {
            return {
                recipeId: item.recipeId,
                title: item.title,
                ingredients: item.ingredients,
                instructions: item.instructions,
                createdBy: item.createdBy,
                createdAt: item.createdAt,
                tags: item.tags,
            };
        });
        return { recipes };
    }
    
}