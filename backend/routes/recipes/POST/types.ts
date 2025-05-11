export enum Tags {
    MEAT = "Meat",
    VEGGIES = "Veggies",
    APPETIZERS = "Appetizers",
    PASTA = "Pasta",
    SOUP_SALAD = "Soup and Salad",
    CASSEROLES = "Casseroles",
    DESSERTS = "Desserts",
    BEVERAGES = "Beverages",
    POTATOES_RICE = "Potatoes and Rice",
    SAUCES_GRAVIES_RUBS = "Sauces, Gravies, and Rubs",
    CANNING_PRESERVING = "Canning",
    BREADS = "Breads",
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