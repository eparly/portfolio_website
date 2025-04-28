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
    ingredients: string[];
    instructions: string[];
    createdBy: string;
    createdAt: string;
    tags?: Tags[];
}

export type AddRecipeResponse = {
    recipeId: string;
    recipe: AddRecipeRequest;
    message: string;
}