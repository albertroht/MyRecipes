import React, { useContext, useRef, useState, useEffect } from 'react';
import RecipeContext from '../../context/recipe/recipeContext';

const RecipeFilter = () => {
  const recipeContext = useContext(RecipeContext);
  const { filterRecipes, clearFilter, sortRecipes, filtered } = recipeContext;
  const [option, setOption] = useState('date');
  const text = useRef('');

  useEffect(() => {
    if (filtered === null) {
      text.current.value = '';
    }
  });

  const onChange = e => {
    if (text.current.value !== '') {
      filterRecipes(e.target.value);
    } else {
      clearFilter();
    }
  };

  const onChangeOption = e => {
    setOption(e.target.value);
    sortRecipes(e.target.value);
  };

  return (
    <form>
      <input
        type='text'
        ref={text}
        placeholder='Filter Recipes...'
        onChange={onChange}
      />
      <select id='cars' name='cars' onChange={onChangeOption}>
        <option value='date'>Date</option>
        <option value='difficulty'>Difficulty</option>
      </select>
    </form>
  );
};

export default RecipeFilter;
