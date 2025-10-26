export type GetRecipeResponse = {
    recipeId: string;
    title: string;
    description?: string;
    ingredients?: string[];
    instructions?: string[];
    link?: string;
    presignedUrl?: string;
}