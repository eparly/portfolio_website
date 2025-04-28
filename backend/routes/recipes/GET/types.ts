export type GetRecipesResponse = {
    recipes: {
        recipeId: string;
        title: string;
        ingredients: string[];
        instructions: string[];
    }[];
}