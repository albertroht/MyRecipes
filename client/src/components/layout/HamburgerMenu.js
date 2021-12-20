import React from 'react';
import { Link } from 'react-router-dom';
import './HamburgerMenu.css';

const HamburgerMenu = () => {
  const onClickHandler = () => {
    document.querySelector('.toggler').checked = false;
  };

  return (
    <div className='menu-wrap'>
      <input type='checkbox' className='toggler' />
      <div className='hamburger'>
        <div></div>
      </div>
      <div className='menu'>
        <div>
          <div>
            <ul>
              <li>
                <Link to='/private/1' onClick={onClickHandler}>
                  My Recipes
                </Link>
              </li>
              <li>
                <Link to='/public/1' onClick={onClickHandler}>
                  Public Recipes
                </Link>
              </li>
              {/* <li>
                <Link to='#'>Favorites</Link>
              </li> */}
              <li>
                <Link to='/recipes/add' onClick={onClickHandler}>
                  Add Recipe
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
