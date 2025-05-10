import axios from 'axios';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './RecipePage.css';
import { Recipe } from '../../../components/RecipeCard/RecipeCard';

const RecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [recipe, setRecipe] = React.useState<Recipe>();
  const [loading, setLoading] = React.useState(true);
  
  const api = axios.create({
    baseURL: 'https://7aqtiptcgl.execute-api.ca-central-1.amazonaws.com/prod',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await api.get(`/recipes/${id}`);
        setRecipe(response.data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <div className="recipe-page">Loading recipe...</div>;
  }

  if (!recipe) {
    return <div className="recipe-page">Recipe not found!</div>;
  }

  return (
    <div className="recipe-page">
      <h1>{recipe.title}</h1>
      <div className="recipe-content">
        <div className="recipe-details">
            <p>Created By: {recipe.createdBy}</p>
            <p>Created At: {new Date(recipe.createdAt).toLocaleDateString()}</p>
            {recipe.link && (
              <p>
                <a href={recipe.link} target="_blank" rel="noopener noreferrer">
                  View Recipe Link
                </a>
              </p>
            )}
            <h2>Description</h2>
            <p>{recipe.description}</p>
            <h2>Ingredients</h2>
            <ul>
              {recipe.ingredients?.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <h2>Instructions</h2>
            <p>
              {recipe.instructions?.map((instruction, index) => (
                <span key={index}>
                  {instruction}
                  {index < recipe.instructions!.length - 1 && <br />}
                </span>
              ))}
            </p>
        </div>
        {recipe.presignedUrl && (
          <div className="recipe-image">
            <img src={recipe.presignedUrl} alt={`${recipe.title} image`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipePage;