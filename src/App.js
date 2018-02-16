import React, { Component } from 'react';

import './App.css';

import Navbar from './components/Navbar/Navbar.js';
import router from './router.js';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Navbar />
        {router}
      </div>
    );
  }
}

export default App;
