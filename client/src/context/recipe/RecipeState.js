import React, { useReducer } from 'react';
import axios from 'axios';
import RecipeContext from './recipeContext';
import recipeReducer from './recipeReducer';
import resizeImage from '../../utils/resizeImage';

// TODO: Better Error Handling -> show fitting Error message to Client

import {
  GET_PUBLIC_RECIPES,
  GET_USER_RECIPES,
  SET_CURRENT,
  CLEAR_CURRENT,
  FILTER_RECIPES,
  CLEAR_FILTER,
  SORT_RECIPES,
  GET_IMAGE,
  ADD_RECIPE,
  DELETE_RECIPE,
} from '../types';

const RecipeState = props => {
  const initialState = {
    userRecipes: [],
    publicRecipes: [],
    userRecipesFiltered: null,
    publicRecipesFiltered: null,
    recipeImages: {},
    current: null,
    filtered: null,
  };

  const [state, dispatch] = useReducer(recipeReducer, initialState);

  const addRecipe = async (recipe, image) => {
    try {
      const formData = new FormData();
      if (image instanceof File) {
        image = await resizeImage(image, 800);
        formData.append('image', image);
      }
      formData.append('recipe', JSON.stringify(recipe));
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const res = await axios.post('/api/recipes', formData, config);
      const resData = res.data;
      const resRecipe = resData.recipe;
      const resRecipeImage = resData.recipeImage;
      dispatch({
        type: ADD_RECIPE,
        payload: {
          recipe: resRecipe,
          recipeImage: resRecipeImage,
        },
      });
      return resRecipe._id;
    } catch (error) {
      console.log(error);
    }
  };

  const updateRecipe = async (recipe, imageUploaded) => {
    try {
      const formData = new FormData();
      let imageResized;
      if (imageUploaded instanceof File) {
        imageResized = await resizeImage(imageUploaded, 800);
        formData.append('image', imageResized);
      }

      formData.append('recipe', JSON.stringify(recipe));
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const res = await axios.put(
        `/api/recipes/${recipe._id}`,
        formData,
        config
      );

      dispatch({ type: DELETE_RECIPE, payload: res.data.recipe._id });
      dispatch({
        type: ADD_RECIPE,
        payload: {
          recipe: res.data.recipe,
          recipeImage: res.data.image,
        },
      });

      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getUserRecipes = async () => {
    try {
      const res = await axios.get('/api/recipes');
      dispatch({ type: GET_USER_RECIPES, payload: JSON.parse(res.data) });
    } catch (error) {
      console.log(error);
    }
  };

  const getPublicRecipes = async () => {
    try {
      const res = await axios.get('/api/recipes/public');
      dispatch({ type: GET_PUBLIC_RECIPES, payload: JSON.parse(res.data) });
    } catch (error) {
      console.log(error);
    }
  };

  const getRecipe = async id => {
    try {
      const res = await axios.get(`/api/recipes/${id}`);
      return JSON.parse(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getPublicRecipe = async id => {
    try {
      const res = await axios.get(`/api/recipes/public/${id}`);
      return JSON.parse(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRecipe = async id => {
    try {
      await axios.delete(`/api/recipes/${id}`);
      dispatch({ type: DELETE_RECIPE, payload: id });
    } catch (error) {
      console.log(error);
    }
  };

  const setCurrent = recipe => {
    dispatch({ type: SET_CURRENT, payload: recipe });
  };

  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  const filterRecipes = text => {
    dispatch({ type: FILTER_RECIPES, payload: text });
  };

  const sortRecipes = option => {
    dispatch({ type: SORT_RECIPES, payload: option });
  };

  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  const getImage = async recipe => {
    if (recipe.type === 'public') {
      const image = await axios.get(`/api/recipes/public/image/${recipe._id}`);
      dispatch({
        type: GET_IMAGE,
        payload: { image: image.data, id: recipe._id },
      });
      return image.data;
    } else {
      const image = await axios.get(`/api/recipes/private/image/${recipe._id}`);
      dispatch({
        type: GET_IMAGE,
        payload: { image: image.data, id: recipe._id },
      });
      return image.data;
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        addRecipe,
        getRecipe,
        deleteRecipe,
        setCurrent,
        clearCurrent,
        updateRecipe,
        filterRecipes,
        clearFilter,
        sortRecipes,
        getPublicRecipe,
        getUserRecipes,
        getPublicRecipes,
        getImage,
        publicRecipesFiltered: state.publicRecipesFiltered,
        userRecipesFiltered: state.userRecipesFiltered,
        current: state.current,
        userRecipes: state.userRecipes,
        publicRecipes: state.publicRecipes,
        recipeImages: state.recipeImages,
      }}
    >
      {props.children}
    </RecipeContext.Provider>
  );
};

export default RecipeState;
