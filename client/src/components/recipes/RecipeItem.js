import React, { useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';
import './RecipeItem.css';
import RecipeContext from '../../context/recipe/recipeContext';

const RecipeItem = ({ recipe }) => {
  const recipeContext = useContext(RecipeContext);
  const { recipeImages } = recipeContext;
  // TODO: Better placeholder
  const [image, setImage] = useState('https://via.placeholder.com/250');

  const getImage = async () => {
    if (recipe._id in recipeImages) {
      if (recipeImages[recipe._id].length > 10) {
        const buf = Buffer.from(JSON.parse(recipeImages[recipe._id]).data);
        const datajpg = 'data:image/jpeg;base64,' + buf.toString('base64');
        setImage(datajpg);
      }
    } else {
      const data = await recipeContext.getImage(recipe);
      if (data.length > 0) {
        const buf = Buffer.from(JSON.parse(data).data);
        const datajpg = 'data:image/jpeg;base64,' + buf.toString('base64');
        setImage(datajpg);
      }
    }
  };
  useEffect(() => {
    getImage();
    //eslint-disable-next-line
  }, []);

  return (
    <div className='recipe-item'>
      <h2>{recipe.name}</h2>
      <p>{recipe.description}</p>
      <div className='recipe-item-img'>
        <img src={image} alt='' />
      </div>
      <div>
        <div>
          <i className='fas fa-clock'>{recipe.time}min </i>
          <i className='fas fa-wifi'>{recipe.difficulty} </i>
          <i className='fas fa-calendar-alt'>
            {format(new Date(recipe.date), 'dd/MM/yyyy')}
          </i>
        </div>
      </div>
    </div>
  );
};

export default RecipeItem;
