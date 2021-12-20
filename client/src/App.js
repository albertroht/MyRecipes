import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/pages/Home';
import Recipe from './components/pages/Recipe';
import './App.css';

import Navbar from './components/layout/Navbar';
import Alert from './components/layout/Alert';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AddRecipe from './components/recipes/AddRecipe';
import PrivateRoute from './components/routing/PrivateRoute';

import AuthState from './context/auth/AuthState';
import AlertState from './context/alert/AlertState';
import RecipeState from './context/recipe/RecipeState';

import setAuthToken from './utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  return (
    <AuthState>
      <RecipeState>
        <AlertState>
          <div className='App'>
            <Router>
              <Fragment>
                <Navbar />

                <div className='container'>
                  <Alert />
                  <Switch>
                    <Route exact path='/' component={Home} />
                    <Route
                      path='/private/:page'
                      render={props => <Home {...props} />}
                    />
                    <Route
                      path='/public/:page'
                      render={props => <Home {...props} />}
                    />
                    <PrivateRoute
                      exact
                      path='/recipes/add'
                      component={AddRecipe}
                    />
                    <PrivateRoute
                      exact
                      path='/recipes/update'
                      component={AddRecipe}
                    />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/register' component={Register} />
                    <PrivateRoute
                      exact
                      path='/recipe/private/:id'
                      component={props => <Recipe {...props} />}
                    />
                    <Route
                      exact
                      path='/recipe/public/:id'
                      render={props => <Recipe {...props} />}
                    />
                  </Switch>
                </div>
              </Fragment>
            </Router>
          </div>
        </AlertState>
      </RecipeState>
    </AuthState>
  );
}

export default App;
