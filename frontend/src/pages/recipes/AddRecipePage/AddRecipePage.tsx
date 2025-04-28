import React, { useState } from 'react';
import axios from 'axios';
import './AddRecipePage.css';
import { useAuth } from 'react-oidc-context';


const AddRecipePage: React.FC = () => {
  const auth = useAuth();
  console.log('auth:', auth);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [message, setMessage] = useState('');

  const handleIngredientChange = (index: number, value: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
    setIngredients(updatedIngredients);
  };

  const handleInstructionChange = (index: number, value: string) => {
    const updatedInstructions = [...instructions];
    updatedInstructions[index] = value;
    setInstructions(updatedInstructions);
  };

  const addIngredientField = () => setIngredients([...ingredients, '']);
  const removeIngredientField = (index: number) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  const addInstructionField = () => setInstructions([...instructions, '']);
  const removeInstructionField = (index: number) => {
    const updatedInstructions = instructions.filter((_, i) => i !== index);
    setInstructions(updatedInstructions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const recipe = {
      title,
      ingredients: ingredients.filter((ingredient) => ingredient.trim() !== ''), // Remove empty fields
      instructions: instructions.filter((instruction) => instruction.trim() !== ''), // Remove empty fields
      createdBy: auth.user?.profile.name || 'Unknown', // Use the user's name or a default value
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await axios.post(
        'https://7aqtiptcgl.execute-api.ca-central-1.amazonaws.com/prod/recipes',
        recipe,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage('Recipe added successfully!');
      setTitle('');
      setIngredients(['']);
      setInstructions(['']);
    } catch (error) {
      console.error('Error adding recipe:', error);
      setMessage('Failed to add recipe. Please try again.');
    }
  };

  return (
    <div className="add-recipe-page">
      <h1>Add a New Recipe</h1>
      <form onSubmit={handleSubmit} className="recipe-form">
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>Ingredients:</label>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="dynamic-field">
            <input
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              placeholder={`Ingredient ${index + 1}`}
              required
            />
            <button
              type="button"
              onClick={() => removeIngredientField(index)}
              disabled={ingredients.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addIngredientField}>
          Add Ingredient
        </button>

        <label>Instructions:</label>
        {instructions.map((instruction, index) => (
          <div key={index} className="dynamic-field">
            <input
              type="text"
              value={instruction}
              onChange={(e) => handleInstructionChange(index, e.target.value)}
              placeholder={`Step ${index + 1}`}
              required
            />
            <button
              type="button"
              onClick={() => removeInstructionField(index)}
              disabled={instructions.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addInstructionField}>
          Add Step
        </button>

        <button type="submit">Submit Recipe</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AddRecipePage;