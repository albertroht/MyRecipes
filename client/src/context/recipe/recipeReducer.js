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

const recipeReducer = (state, action) => {
  switch (action.type) {
    case GET_PUBLIC_RECIPES:
      return {
        ...state,
        publicRecipes: action.payload,
      };
    case GET_USER_RECIPES:
      return {
        ...state,
        userRecipes: action.payload,
      };
    case GET_IMAGE:
      const { image, id } = action.payload;
      state.recipeImages[id] = image;
      return {
        ...state,
      };
    case ADD_RECIPE:
      const { recipe, recipeImage } = action.payload;
      if (recipeImage) {
        state.recipeImages[recipe._id] = recipeImage;
      }
      if (recipe.type === 'public') {
        return {
          ...state,
          publicRecipes: [...state.publicRecipes, recipe],
          userRecipes: [...state.userRecipes, recipe],
        };
      } else {
        return {
          ...state,
          userRecipes: [...state.userRecipes, recipe],
        };
      }
    case DELETE_RECIPE:
      const deleteRecipeFilter = e => {
        return e._id !== action.payload;
      };
      return {
        ...state,
        userRecipes: state.userRecipes.filter(deleteRecipeFilter),
        publicRecipes: state.publicRecipes.filter(deleteRecipeFilter),
      };
    case SET_CURRENT:
      return {
        ...state,
        current: action.payload,
      };
    case CLEAR_CURRENT:
      return {
        ...state,
        current: null,
      };
    case FILTER_RECIPES:
      const filter = array => {
        const filteredArray = array.filter(recipe => {
          let boolean = false;
          const regex = new RegExp(`${action.payload}`, 'gi');
          recipe.ingredients.forEach(ingredient => {
            if (ingredient.match(regex)) {
              boolean = true;
            }
          });
          // recipe.tags.forEach(tag => {
          //   if (tag.match(regex)) {
          //     boolean = true;
          //   }
          // });
          return (
            recipe.name.match(regex) ||
            recipe.description.match(regex) ||
            boolean
          );
        });
        return filteredArray;
      };
      return {
        ...state,
        userRecipesFiltered: filter(state.userRecipes),
        publicRecipesFiltered: filter(state.publicRecipes),
      };
    case SORT_RECIPES:
      const sort = list =>
        list &&
        list.sort((a, b) => {
          if (action.payload === 'difficulty') {
            if (a.difficulty === 'easy') {
              return -1;
            } else if (b.difficulty === 'easy') {
              return 1;
            } else if (a.difficulty === 'hard' && b.difficulty !== 'hard') {
              return 1;
            } else if (b.difficulty === 'hard' && a.difficulty !== 'hard') {
              return -1;
            } else {
              return 0;
            }
          } else if (action.payload === 'date') {
            if (a.date < b.date) {
              return 1;
            } else {
              return -1;
            }
          }
          return 0;
        });
      return {
        ...state,
        userRecipesFiltered: sort(state.userRecipesFiltered),
        publicRecipesFiltered: sort(state.publicRecipesFiltered),
        userRecipes: sort(state.userRecipes),
      };
    case CLEAR_FILTER:
      return {
        ...state,
        publicRecipesFiltered: null,
        userRecipesFiltered: null,
      };
    default:
      return state;
  }
};

export default recipeReducer;
