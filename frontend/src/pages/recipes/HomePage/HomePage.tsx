import axios from 'axios';

import React, { useEffect, useState } from 'react';
import RecipeCard from '../../../components/RecipeCard/RecipeCard';
import './HomePage.css';
import { Recipe } from '../../../components/RecipeCard/RecipeCard';

const HomePage: React.FC = () => {

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    const api = axios.create({
        baseURL: 'https://7aqtiptcgl.execute-api.ca-central-1.amazonaws.com/prod',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    const fetchRecipes = async (searchTerm?: string) => {
        try {
            setLoading(true);
            const response = await axios.get('https://7aqtiptcgl.execute-api.ca-central-1.amazonaws.com/prod/recipes', {
                params: searchTerm ? { search: searchTerm } : {},
            });
            setRecipes(response.data.recipes);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setError('Failed to fetch recipes. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
   
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchRecipes(searchTerm);
    }

    const handleClear = () => {
        setSearchTerm('');
        fetchRecipes(); // Reload all recipes
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    return (
        <div className="home-container">
            <h1>Recipes</h1>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button type="submit" className="search-button">Search</button>
                <button
                    type="button"
                    onClick={handleClear}
                    className="clear-button"
                >
                    Clear
                </button>
            </form>
            {error && <div className="error">{error}</div>}
            <div className="recipe-list">
                {recipes.map(recipe => (
                    <RecipeCard key={recipe.recipeId} recipe={recipe} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;