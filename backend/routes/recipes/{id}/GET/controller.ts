import DynamoDB from "aws-sdk/clients/dynamodb";
import { GetRecipeResponse } from "./types";
import { S3 } from "aws-sdk";

export class GetRecipeController {
    private db: DynamoDB.DocumentClient;
    private s3: S3;
    private bucketName: string; // S3 bucket name for storing images
    private tableName: string;
    constructor() {
        this.db = new DynamoDB.DocumentClient();
        this.s3 = new S3();
        this.bucketName = process.env.BUCKET_NAME || "RecipesBucket"; // S3 bucket name
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
            const recipe = result.Item as GetRecipeResponse;

            // Generate a presigned URL for the image
            const imageKey = `${recipeId}/image.jpg`; // Customize the key if needed
            const presignedUrl = this.s3.getSignedUrl("getObject", {
                Bucket: this.bucketName,
                Key: imageKey,
                Expires: 60 * 5, // URL valid for 5 minutes
            });

            // Add the presigned URL to the recipe response
            return {
                ...recipe,
                presignedUrl: presignedUrl,
            };
        } catch (error) {
            console.error("Error getting recipe:", error);
            throw new Error("Error getting recipe from the database");
        }
    }
    
}