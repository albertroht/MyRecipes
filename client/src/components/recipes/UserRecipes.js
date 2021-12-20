import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeContext from '../../context/recipe/recipeContext';
import AuthContext from '../../context/auth/authContext';
import './UserRecipes.css';

import RecipeItem from './RecipeItem';

const UserRecipes = props => {
  const recipeContext = useContext(RecipeContext);
  const authContext = useContext(AuthContext);
  const [onPage, setOnPage] = useState(
    parseInt(props.location.pathname.split('/')[2] || 1)
  );

  const {
    userRecipes,
    publicRecipes,
    getPublicRecipes,
    getUserRecipes,
    userRecipesFiltered,
    publicRecipesFiltered,
  } = recipeContext;
  const { isAuthenticated } = authContext;

  const ref_basepath =
    window.location.pathname.split('/')[1] === 'private' ? 'private' : 'public';

  useEffect(() => {
    if (ref_basepath === 'public' && publicRecipes.length === 0) {
      getPublicRecipes();
    } else if (ref_basepath === 'private' && userRecipes.length === 0) {
      getUserRecipes();
    }

    //eslint-disable-next-line
  }, [ref_basepath]);

  const addRecipe = () => {
    props.history.push('/recipes/add');
  };

  const goToRecipe = id => {
    if (ref_basepath === 'private') {
      props.history.push(`/recipe/private/${id}`);
    } else {
      props.history.push(`/recipe/public/${id}`);
    }
  };

  const showRecipes = recipes => {
    let filtered;
    ref_basepath === 'public'
      ? (filtered = publicRecipesFiltered)
      : (filtered = userRecipesFiltered);

    try {
      let page_recipes = recipes.slice((onPage - 1) * 6, onPage * 6);
      if (filtered && page_recipes.length === 0 && onPage !== 1) {
        setOnPage(onPage - 1);
      }
      return page_recipes.map(recipe => (
        <div
          key={recipe._id}
          onClick={() => {
            goToRecipe(recipe._id);
          }}
        >
          <RecipeItem recipe={recipe} />
        </div>
      ));
    } catch (error) {
      console.log('no recipe found');
    }
  };

  const goToPage = page => {
    props.history.push(`/${ref_basepath}/${page}`);
    setOnPage(page);
    // console.log('hi');
  };

  const pagination = () => {
    let page_count = 0;
    let filtered;
    ref_basepath === 'public'
      ? (filtered = publicRecipesFiltered)
      : (filtered = userRecipesFiltered);
    if (filtered && filtered.length > 0) {
      page_count = Math.ceil(filtered.length / 6);
    } else if (ref_basepath === 'public') {
      page_count = Math.ceil(publicRecipes.length / 6);
    } else {
      page_count = Math.ceil(userRecipes.length / 6);
    }

    if (page_count === 0 || (filtered && filtered.length === 0)) {
      return <div />;
    }

    const pagination_items = [onPage];
    if (onPage - 1 !== 0) {
      pagination_items.unshift(onPage - 1);
      if (onPage - 2 !== 0) {
        pagination_items.unshift('...');
      }
    }
    if (onPage !== page_count) {
      pagination_items.push(onPage + 1);
      if (onPage + 1 !== page_count) {
        pagination_items.push('...');
      }
    }

    return (
      <div className='pagination'>
        <Link to='#' onClick={() => goToPage(1)}>
          &laquo;
        </Link>
        {pagination_items.map((item, index) => (
          <Link to='#' key={index} onClick={() => goToPage(item)}>
            {item}
          </Link>
        ))}
        <Link to='#' onClick={() => goToPage(page_count)}>
          &raquo;
        </Link>
      </div>
    );
  };

  return (
    <div className='userRecipes'>
      {ref_basepath === 'private' ? (
        <>
          <i className='fas fa-plus-circle fa-3x' onClick={addRecipe}></i>
          <h1>Your Recipes</h1>
        </>
      ) : isAuthenticated ? (
        <>
          <i className='fas fa-plus-circle fa-3x' onClick={addRecipe}></i>
          <h1>Public Recipes</h1>
        </>
      ) : (
        <h1>Public Recipes</h1>
      )}
      <div className='grid'>
        {ref_basepath === 'private' ? (
          <>
            {userRecipesFiltered
              ? showRecipes(userRecipesFiltered)
              : showRecipes(userRecipes)}
          </>
        ) : (
          <>
            {publicRecipesFiltered
              ? showRecipes(publicRecipesFiltered)
              : showRecipes(publicRecipes)}
          </>
        )}
      </div>
      {pagination()}
    </div>
  );
};

export default UserRecipes;
