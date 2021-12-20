import React, { useState, useContext, useEffect, Fragment } from 'react';
import RecipeContext from '../../context/recipe/recipeContext';
import AuthContext from '../../context/auth/authContext';
import './AddRecipe.css';
import Spinner from '../layout/Spinner';

const AddRecipe = props => {
  const recipeContext = useContext(RecipeContext);
  const authContext = useContext(AuthContext);
  const { addRecipe, updateRecipe, clearCurrent, current } = recipeContext;
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState({});
  const [imageUploaded, setImageUploaded] = useState(false);
  const [recipe, setRecipe] = useState({
    name: '',
    description: '',
    instructions: [''],
    portions: 1,
    difficulty: 'normal',
    type: 'private',
    ingredients: [''],
    tags: [''],
    time: 0,
  });
  const {
    name,
    description,
    instructions,
    portions,
    difficulty,
    time,
    // tags,
    type,
    ingredients,
    _id,
  } = recipe;

  useEffect(() => {
    authContext.loadUser();
    if (current !== null) {
      setRecipe(current);
    }
    setImage({});
    // eslint-disable-next-line
  }, []);

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    if (current !== null) {
      await updateRecipe(recipe, image);
      clearCurrent();
      props.history.push(`/recipe/private/${_id}`);
    } else {
      const id = await addRecipe(recipe, image);
      props.history.push(`/recipe/private/${id}`);
    }
  };

  const onChange = async e => {
    if (e.target.name === 'image') {
      setImage(e.target.files[0]);
      setImageUploaded(true);
    } else if (e.target.name === 'ingredients') {
      setRecipe(recipe => {
        const newIngredients = [...recipe.ingredients];
        newIngredients[parseInt(e.target.getAttribute('index'))] =
          e.target.value;
        return { ...recipe, ingredients: newIngredients };
      });
    } else if (e.target.name === 'tags') {
      setRecipe(recipe => {
        const newTags = [...recipe.tags];
        newTags[parseInt(e.target.getAttribute('index'))] = e.target.value;
        return { ...recipe, tags: newTags };
      });
    } else if (e.target.name === 'instructions') {
      setRecipe(recipe => {
        const newInstructions = [...recipe.instructions];
        newInstructions[parseInt(e.target.getAttribute('index'))] =
          e.target.value;
        return { ...recipe, instructions: newInstructions };
      });
    } else {
      setRecipe({ ...recipe, [e.target.name]: e.target.value });
    }
  };

  const addIngredientInput = () => {
    setRecipe(recipe => {
      const newIngredients = [...ingredients];
      newIngredients.push('');
      return { ...recipe, ingredients: newIngredients };
    });
  };

  // const addTagInput = () => {
  //   setRecipe(recipe => {
  //     const newTags = [...tags];
  //     newTags.push('');
  //     return { ...recipe, tags: newTags };
  //   });
  // };

  // const removeTag = e => {
  //   setRecipe(recipe => {
  //     const newTags = [...tags];
  //     newTags.splice(parseInt(e.target.getAttribute('index')), 1);
  //     return { ...recipe, tags: newTags };
  //   });
  // };

  const addInstruction = () => {
    setRecipe(recipe => {
      const newInstructions = [...instructions];
      newInstructions.push('');
      return { ...recipe, instructions: newInstructions };
    });
  };

  const removeIngredient = e => {
    setRecipe(recipe => {
      const newIngredients = [...ingredients];
      newIngredients.splice(parseInt(e.target.getAttribute('index')), 1);
      return { ...recipe, ingredients: newIngredients };
    });
  };

  const removeInstruction = e => {
    setRecipe(recipe => {
      const newInstructions = [...instructions];
      newInstructions.splice(parseInt(e.target.getAttribute('index')), 1);
      return { ...recipe, instructions: newInstructions };
    });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='addRecipe'>
      <form onSubmit={onSubmit}>
        {(() => {
          if (current) {
            return <h1>Updating Recipe</h1>;
          } else {
            return <h1>Adding Recipe</h1>;
          }
        })()}
        <div>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            name='name'
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor='description'>Description</label>
          <input
            type='text'
            name='description'
            value={description}
            onChange={onChange}
            required
            // minlength="10"
            maxLength='80'
          />
        </div>
        <div id='ingredients'>
          <label htmlFor='ingredients'>
            Ingredients{' '}
            <i className='fas fa-plus-circle' onClick={addIngredientInput}></i>
          </label>
          {ingredients.length !== 0 ? (
            ingredients.map((ingredient, index) => (
              <Fragment key={'ingredients' + index}>
                <input
                  key={index}
                  type='text'
                  name='ingredients'
                  onChange={onChange}
                  value={ingredient}
                  index={index}
                />
                <i
                  className='fas fa-trash'
                  index={index}
                  onClick={removeIngredient}
                ></i>
              </Fragment>
            ))
          ) : (
            <>
              <input
                type='text'
                name='ingredients'
                onChange={onChange}
                index='0'
              />
              <i
                className='fas fa-trash'
                index='0'
                onClick={removeIngredient}
              ></i>
            </>
          )}
        </div>
        {/* <div>
          <label htmlFor='Tags'>
            Tags <i className='fas fa-plus-circle' onClick={addTagInput}></i>
          </label>
          {tags.length !== 0 ? (
            tags.map((tag, index) => (
              <Fragment key={'tags' + index}>
                <input
                  type='text'
                  name='tags'
                  onChange={onChange}
                  value={tag}
                  index={index}
                />
                <i
                  className='fas fa-trash'
                  index={index}
                  onClick={removeTag}
                ></i>
              </Fragment>
            ))
          ) : (
            <>
              <input type='text' name='tags' onChange={onChange} index='0' />
              <i className='fas fa-trash' index='0' onClick={removeTag}></i>
            </>
          )}
        </div> */}
        <div>
          <label htmlFor='instructions' id='instructions'>
            Instructions{' '}
            <i className='fas fa-plus-circle' onClick={addInstruction}></i>
          </label>
          {instructions.length !== 0 ? (
            instructions.map((instruction, index) => (
              <Fragment key={'instructions' + index}>
                <textarea
                  name='instructions'
                  rows='10'
                  value={instruction}
                  onChange={onChange}
                  index={index}
                />
                <i
                  className='fas fa-trash'
                  index={index}
                  onClick={removeInstruction}
                ></i>
              </Fragment>
            ))
          ) : (
            <>
              <textarea
                name='instructions'
                rows='10'
                onChange={onChange}
                index='0'
              />
              <i
                className='fas fa-trash'
                index='0'
                onClick={removeInstruction}
              ></i>
            </>
          )}
        </div>
        <div className='file-area'>
          <label htmlFor='image'>Images</label>
          <input type='file' name='image' id='image' onChange={onChange} />
          <div
            className={
              imageUploaded ? ' file-dummy success' : 'file-dummy default'
            }
          ></div>
        </div>
        <div className='select-groups'>
          <div>
            <label htmlFor='difficulty'>Difficulty </label>
            <select
              name='difficulty'
              id='difficulty'
              value={difficulty}
              onChange={onChange}
            >
              <option value='easy'>Easy</option>
              <option value='normal'>Normal</option>
              <option value='hard'>hard</option>
            </select>
          </div>
          <div>
            <label htmlFor='type'>Type </label>
            <select name='type' id='type' value={type} onChange={onChange}>
              <option value='private'>Private</option>
              <option value='public'>Public</option>
            </select>
          </div>
          <div>
            <label htmlFor='time'>Time</label>
            <input
              type='number'
              name='time'
              id='time'
              value={time}
              onChange={onChange}
              required
            ></input>
          </div>
          <div>
            <label htmlFor='portions'>Portions</label>
            <input
              type='number'
              name='portions'
              id='portions'
              value={portions}
              onChange={onChange}
              required
            ></input>
          </div>
        </div>
        <div>
          {!current ? (
            <>
              <input
                type='submit'
                value='Submit'
                className='btn btn-block btn-primary'
              />
            </>
          ) : (
            <input
              type='submit'
              value='Update'
              className='btn btn-block btn-primary'
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default AddRecipe;
