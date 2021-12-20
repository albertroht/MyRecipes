import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import HamburgerMenu from './HamburgerMenu';
import RecipeFilter from '../recipes/RecipeFilter';
import './Navbar.css';

import AuthContext from '../../context/auth/authContext';

const Navbar = props => {
  const { title, icon } = props;
  const authContext = useContext(AuthContext);
  const { isAuthenticated, logout, user } = authContext;

  const onLogout = () => {
    logout();
    // clearContacts();
  };

  const authLinks = (
    <Fragment>
      <li>Hello {user && user.name}</li>
      <li>
        <a onClick={onLogout} href='#!'>
          <i className='fas fa-sign-out-alt' />
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
      <li>
        <HamburgerMenu />
      </li>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <li>
        <Link to='/login'>Login</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
    </Fragment>
  );

  return (
    <div className='navbar bg-primary'>
      <Link to='/public/1'>
        <h1>
          <i className={icon} />
          {title}
        </h1>
      </Link>
      <RecipeFilter />
      <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
    </div>
  );
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
};

Navbar.defaultProps = {
  title: 'VeganRecipes',
  icon: 'fas fa-seedling',
};

export default Navbar;
