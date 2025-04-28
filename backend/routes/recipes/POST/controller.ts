import { AddRecipeRequest, AddRecipeResponse } from "./types";
import { DynamoDB } from "aws-sdk";


export class AddRecipeController {
    private db: DynamoDB.DocumentClient;
    private tableName: string;
    constructor() {
        this.db = new DynamoDB.DocumentClient();
        this.tableName = "RecipesTable"; // Replace with your actual table name
    }

    public async addRecipe(recipe: AddRecipeRequest, recipeId: string): Promise<AddRecipeResponse> {
        const params = {
            TableName: this.tableName,
            Item: {
                recipeId,
                title: recipe.title,
                titleLower: recipe.title.toLowerCase(),
                ingredients: recipe.ingredients,
                ingredientsFlattened: recipe.ingredients.map((i) => i.toLowerCase()).join(', '),
                instructions: recipe.instructions,
                tags: recipe.tags,
                tagsLower: recipe.tags?.map((tag) => tag.toLowerCase()).join(', '),
                createdBy: recipe.createdBy,
                createdByLower: recipe.createdBy.toLowerCase(),
                createdAt: recipe.createdAt,
            },
        };
        try {
            await this.db.put(params).promise();
            return {
                message: "Recipe added successfully",
                recipeId: recipeId,
                recipe: recipe,
            };
        }
        catch (error) {
            console.error("Error adding recipe:", error);
            throw new Error("Error adding recipe to the database");
        }
    }
}