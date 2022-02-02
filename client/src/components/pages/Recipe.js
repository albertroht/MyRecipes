import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import { format } from 'date-fns';
import RecipeContext from '../../context/recipe/recipeContext';
import Spinner from '../layout/Spinner';
import './Recipe.css';

const Recipe = ({ match, history }) => {
  const authContext = useContext(AuthContext);
  const recipeContext = useContext(RecipeContext);
  const [recipe, setRecipe] = useState({});
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState('');

  const {
    getRecipe,
    getPublicRecipe,
    deleteRecipe,
    setCurrent,
    userRecipes,
    publicRecipes,
    recipeImages,
  } = recipeContext;

  const {
    name,
    description,
    ingredients,
    instructions,
    date,
    difficulty,
    time,
    portions,
  } = recipe;

  const ref_basepath =
    window.location.pathname.split('/')[2] === 'public' ? 'public' : 'private';

  const loadImage = async () => {
    try {
      if (match.params.id in recipeImages) {
        if (
          recipeImages[match.params.id] &&
          recipeImages[match.params.id].data.length > 10
        ) {
          const buf = Buffer.from(recipeImages[match.params.id].data);
          const datajpg = 'data:image/jpeg;base64,' + buf.toString('base64');
          setImage(datajpg);
        }
      } else {
        const imageData = await recipeContext.getImage({
          type: ref_basepath,
          _id: match.params.id,
        });
        const buf = Buffer.from(imageData.data);
        const datajpg = 'data:image/jpeg;base64,' + buf.toString('base64');
        setImage(datajpg);
      }
    } catch (error) {
      return '';
    }
  };

  const loadRecipe = async () => {
    if (ref_basepath === 'public') {
      const foundRecipe = publicRecipes.find(
        element => element._id === match.params.id
      );
      if (foundRecipe) {
        setRecipe(foundRecipe);
        setLoading(false);
      } else {
        const fetchRecipe = async () => {
          const recipeGet = await getPublicRecipe(match.params.id);
          if (recipeGet) {
            setRecipe(recipeGet);
            setLoading(false);
          }
        };
        fetchRecipe();
      }
    } else {
      const foundRecipe = userRecipes.find(
        element => element._id === match.params.id
      );
      if (foundRecipe) {
        setRecipe(foundRecipe);
        setLoading(false);
      } else {
        authContext.loadUser();
        const fetchRecipe = async () => {
          const recipeGet = await getRecipe(match.params.id);
          if (recipeGet) {
            setRecipe(recipeGet);
            setLoading(false);
          }
        };
        fetchRecipe();
      }
    }
  };
  useEffect(() => {
    authContext.loadUser();
    loadRecipe();
    loadImage();
    // eslint-disable-next-line
  }, []);

  const remove = async () => {
    await deleteRecipe(match.params.id);
    history.push('/private/1');
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='recipe'>
      <h1>{name}</h1>
      <p className='p text-justify'>{description}</p>
      <img src={image} alt=''></img>
      <div>
        <div>
          <i className='fas fa-clock'>{time}min </i>
          <i className='fas fa-wifi'>{difficulty} </i>
          <i className='fas fa-calendar-alt'>
            {format(new Date(date), 'dd/MM/yyyy')}
          </i>
        </div>
      </div>
      <h2>Ingredients ({portions} portions)</h2>
      <div>
        <ul>
          {ingredients.map((ingredient, index) => (
            <li className='text-justify' key={'ingredients' + index}>
              {ingredient}
            </li>
          ))}
        </ul>
      </div>
      <h2>Instructions</h2>
      <div>
        <ol>
          {instructions.map((instruction, index) => (
            <li key={'instructions' + index}>
              <p className='p text-justify'>{instruction}</p>
            </li>
          ))}
        </ol>
      </div>
      {/* {history.location.pathname.split('/')[2] !== 'public' && ( */}
      {authContext.user &&
      (recipe.user === authContext.user._id ||
        authContext.user.role === 'admin') ? (
        <div className='functions'>
          <Link to='/recipes/update'>
            <i
              className='fas fa-edit fa-3x'
              onClick={() => setCurrent(recipe)}
            />
          </Link>
          <Link to='#/'>
            <i className='fas fa-trash fa-3x' onClick={remove} />
          </Link>
        </div>
      ) : (
        authContext.isAuthenticated && (
          <div className='functions'>
            <i className='far fa-heart fa-3x' />
          </div>
        )
      )}
    </div>
  );
};

export default Recipe;
