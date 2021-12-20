import React, { useContext, useEffect } from 'react';
import AuthContext from '../../context/auth/authContext';
import UserRecipes from '../recipes/UserRecipes';

const Home = props => {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    authContext.loadUser();
    // eslint-disable-next-line
  }, []);
  return (
    <div>
      <UserRecipes {...props}></UserRecipes>
    </div>
  );
};

export default Home;
