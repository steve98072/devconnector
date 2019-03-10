import React, { Component } from 'react';
import './App.css';
import Navbar from './components/laytout/Navbar';
import Landing from './components/laytout/Landing';
import Footer from './components/laytout/Footer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <Landing />
        <Footer />
      </div>
    );
  }
}

export default App;
