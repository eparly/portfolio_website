import { AddRecipeRequest, AddRecipeResponse } from "./types";
import { DynamoDB, S3 } from "aws-sdk";


export class AddRecipeController {
    private db: DynamoDB.DocumentClient;
    private s3: S3;
    private tableName: string;
    private bucketName: string; // S3 bucket name for storing images
    constructor() {
        this.db = new DynamoDB.DocumentClient();
        this.s3 = new S3();
        this.bucketName = process.env.BUCKET_NAME || "RecipesBucket"; // S3 bucket name
        this.tableName = process.env.TABLE_NAME || "RecipesTable"; // DynamoDB table name
    }

    public async generatePresignedUrl(recipeId: string): Promise<string> {
        const params = {
            Bucket: this.bucketName,
            Key: `${recipeId}/image.jpg`, // Customize the key as needed
            Expires: 60 * 5, // URL valid for 5 minutes
            ContentType: "image/jpeg",
        };

        return this.s3.getSignedUrlPromise("putObject", params);
    }

    public async addRecipe(recipe: AddRecipeRequest, recipeId: string): Promise<AddRecipeResponse> {        
        const params = {
            TableName: this.tableName,
            Item: {
                recipeId,
                title: recipe.title,
                titleLower: recipe.title.toLowerCase(),
                description: recipe.description,
                ingredients: recipe.ingredients,
                ingredientsFlattened: recipe.ingredients?.map((i) => i.toLowerCase()).join(', '),
                instructions: recipe.instructions,
                tags: recipe.tags,
                tagsLower: recipe.tags?.map((tag) => tag.toLowerCase()).join(', '),
                createdBy: recipe.createdBy,
                createdByLower: recipe.createdBy.toLowerCase(),
                createdAt: recipe.createdAt,
                link: recipe.link,
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