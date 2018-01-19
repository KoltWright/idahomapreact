import React, { Component } from 'react';
import axios from 'axios';

import './App.css';

import Webmap from './components/Webmap/Webmap.js';
import Sidepannel from './components/Sidepannel/Sidepannel.js';
import Navbar from './components/Navbar/Navbar.js';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
	  addressesToLocate: []
    }
  }

  getAddressesToLocate = (addressesToLocate) => {
  	this.setState({addressesToLocate});
  }

  render() {
    return (
      <div className="App">
        <Navbar />
        <div className="content">
          <div className="left">
            <Sidepannel 
							getAddressesToLocate={this.getAddressesToLocate}
						/>
          </div>
          <div className="right">
            <Webmap
							addressesToLocate={this.state.addressesToLocate}
						/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
