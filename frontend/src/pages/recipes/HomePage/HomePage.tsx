import axios from 'axios';

import React, { useEffect, useState } from 'react';
import RecipeCard from '../../../components/RecipeCard/RecipeCard';
import './HomePage.css';
import { Recipe, Tags } from '../../../components/RecipeCard/RecipeCard';

const HomePage: React.FC = () => {

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]); // Recipes after filtering
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<Tags[]>([]);
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
                params: {
                  search: searchTerm || undefined, // Pass search term to the backend
                },
            });
            setRecipes(response.data.recipes);
            setFilteredRecipes(response.data.recipes); // Initialize filtered recipes
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setError('Failed to fetch recipes. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const filterRecipesByTags = () => {
        if (selectedTags.length === 0) {
          setFilteredRecipes(recipes); // If no tags are selected, show all recipes
          return;
        }
    
        const filtered = recipes.filter((recipe) =>
            selectedTags.some((tag) => recipe.tags?.includes(tag)) // Match if any tag exists

        );
        setFilteredRecipes(filtered);
    };   
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchRecipes(searchTerm);
    }

    const handleClear = () => {
        setSearchTerm('');
        setSelectedTags([]); // Clear selected tags

        // setFilteredRecipes(recipes); // Reset filtered recipes to all recipes
        fetchRecipes(); // Fetch all recipes again
        setFilteredRecipes(recipes); // Reset filtered recipes to all recipes
    };

    const handleTagClick = (tag: Tags) => {
        setSelectedTags((prevTags) => {
            const updatedTags = prevTags.includes(tag)
                ? prevTags.filter((t) => t !== tag) // Remove tag if already selected
                : [...prevTags, tag]; // Add tag if not selected
    
            return updatedTags;
        });
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    useEffect(() => {
        filterRecipesByTags(); // Filter recipes whenever selected tags change
      }, [selectedTags, recipes]); // Re-run filtering when tags or recipes change

    const availableTags: Tags[] = [
        Tags.BEEF,
        Tags.CHICKEN,
        Tags.PORK,
        Tags.SEAFOOD,
        Tags.VEGGIES,
        Tags.APPETIZERS,
        Tags.PASTA,
        Tags.SOUP_SALAD,
        Tags.CASSEROLES,
        Tags.DESSERTS,
        Tags.BEVERAGES,
        Tags.POTATOES_RICE,
        Tags.SAUCES_GRAVIES_RUBS,
        Tags.CANNING_PRESERVING,
        Tags.BREADS,
    ];

    return (
        <div className="home-container">
            <div className="tag-filter">
                {availableTags.map((tag) => (
                    <button
                        key={tag}
                        className={`tag-button ${selectedTags?.includes(tag) ? 'selected' : ''}`}
                        onClick={() => handleTagClick(tag)}
                    >
                        {tag}
                    </button>
                ))}
            </div>
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
                {filteredRecipes.map(recipe => (
                    <RecipeCard key={recipe.recipeId} recipe={recipe} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;