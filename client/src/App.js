import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, loginUser } from './actions/authActions';
import { Provider } from 'react-redux';
import store from './store';

// head and toe
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// other components.
import Landing from './components/layout/Landing';
import Register from './components/auth/Register'; 
import Login from './components/auth/Login'

import './App.css';

// Check for token, make sure that no matter where to go, the redux has the data for user
if(localStorage.jwtToken){
  // set auth token header auth
  setAuthToken(localStorage.jwtToken);

  // decode the token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);

  // set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // check for expired token
  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime){
    // logout user
    store.dispatch(loginUser);
    // TODO clear current profile 
    // Redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
