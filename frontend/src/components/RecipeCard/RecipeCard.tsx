import React from 'react';
import { Link } from 'react-router-dom';
import './RecipeCard.css';

export enum Tags{
    CHICKEN = "Chicken",
    BEEF = "Beef",
    PORK = "Pork",
    SEAFOOD = "Seafood",
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

export interface Recipe {
    recipeId: number;
    title: string;
    description?: string;
    ingredients?: string[];
    instructions?: string[];
    createdBy: string;
    createdAt: string;
    link?: string;
    tags?: Tags[];
    presignedUrl?: string;
}

interface RecipeCardProps {
    recipe: Recipe
}



const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    return (
        <div className="recipe-card">
            <h2>{recipe.title}</h2>
            <Link to={`/recipe/${recipe.recipeId}`} className="recipe-link">
                View Recipe
            </Link>
        </div>
    );
};

export default RecipeCard;