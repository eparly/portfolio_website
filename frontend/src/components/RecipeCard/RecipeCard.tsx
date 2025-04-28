import React from 'react';
import { Link } from 'react-router-dom';
import './RecipeCard.css';

export interface Recipe {
    recipeId: number;
    title: string;
    ingredients: string[];
    instructions: string[];
    createdBy: string;
    createdAt: string;
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