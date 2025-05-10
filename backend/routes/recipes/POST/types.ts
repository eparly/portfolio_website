export enum Tags {
    BREAKFAST = "Breakfast",
    LUNCH = "Lunch",
    DINNER = "Dinner",
    SNACK = "Snack",
    DESSERT = "Dessert",
    APPETIZER = "Appetizer",
    BEVERAGE = "Beverage",
}

export type AddRecipeRequest = {
    title: string;
    description?: string;
    ingredients?: string[];
    instructions?: string[];
    createdBy: string;
    createdAt: string;
    tags?: Tags[];
    link?: string;
}

export type AddRecipeResponse = {
    recipeId: string;
    recipe: AddRecipeRequest;
    message: string;
    presignedUrl?: string;
}