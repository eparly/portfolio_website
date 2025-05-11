import React, { useState } from 'react';
import axios from 'axios';
import './AddRecipePage.css';
import { useAuth } from 'react-oidc-context';
import { Tags } from '../../../components/RecipeCard/RecipeCard';

const availableTags: Tags[] = [
        Tags.BEEF,
        Tags.CHICKEN,
        Tags.PORK,
        Tags.SEAFOOD,
        Tags.VEGGIES,
        Tags.APPITIZERS,
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



const AddRecipePage: React.FC = () => {
  const auth = useAuth();
  console.log('auth:', auth);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [image, setImage] = useState<File | null>(null);
  const [tags, setTags] = useState<Tags[]>([]); // State for selected tags
  const [message, setMessage] = useState('');
  console.log('tags:', tags);
  console.log('availableTags:', availableTags);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleTagClick = (tag: Tags) => {
    setTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag) // Remove tag if already selected
        : [...prevTags, tag] // Add tag if not selected
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const recipe = {
      title,
      description,
      link,
      ingredients: ingredients.filter((ingredient) => ingredient.trim() !== ''), // Remove empty fields
      instructions: instructions.filter((instruction) => instruction.trim() !== ''), // Remove empty fields
      tags,
      createdBy: auth.user?.profile.given_name || 'Unknown', // Use the user's name or a default value
      createdAt: new Date().toISOString(),
    };
    console.log('Submitting recipe:', recipe);

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

      const { presignedUrl, recipeId } = response.data;

      if (image && presignedUrl) {
        try {
          await axios.put(presignedUrl, image, {
            headers: {
              'Content-Type': image.type,
            },
          });
        }
        catch (imageUploadError) {
          console.error('Error uploading image:', imageUploadError);
          await axios.delete(
            `https://7aqtiptcgl.execute-api.ca-central-1.amazonaws.com/prod/recipes/${recipeId}`
          );
          setMessage('Failed to upload image. Please try again.');
          throw new Error('Image upload failed. Recipe creation rolled back.');
        }

        console.log('Image uploaded successfully');
      }
      setMessage('Recipe added successfully!');
      setTitle('');
      setIngredients(['']);
      setInstructions(['']);
      setDescription('');
      setLink('');
      setImage(null);
      setTags([]);
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
        <label>
          Link:
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://example.com/recipe"
          />
        </label>

        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
        <label>Tags:</label>
        <div className="tag-filter">
          {availableTags.map((tag) => (
            console.log('tag:', tag),
            console.log('tags:', tags),
            <button
              key={tag}
              type="button"
              className={`tag-button ${tags.includes(tag) ? 'selected' : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <label>
          Upload Image:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        <button type="submit">Submit Recipe</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AddRecipePage;