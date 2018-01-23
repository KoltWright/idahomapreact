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
    collapsed: false,
	  addressesToLocate: [],
    clearAll: false
    }
  }

  getAddressesToLocate = (addressesToLocate, clearAll) => {
  	this.setState({addressesToLocate, clearAll});
  }

  collapseSidePannel = () => {
    var sidePannel = document.getElementById('left');
    var map = document.getElementById('right');
    var icon = document.getElementsByTagName('i')[0];

    if(!this.state.collapsed) {
      sidePannel.style.left = "-450px";
      map.style.width = '100%';
      icon.className = 'fa fa-chevron-right';
      this.setState({collapsed: true});
    } else {
      sidePannel.style.left = "0px";
      map.style.width = 'calc(100vw - 450px)';
      icon.className = 'fa fa-chevron-left';
      this.setState({collapsed: false});
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar />
        <div className="content">
          <div id="left">
            <div className="collapse-button" onClick={this.collapseSidePannel}>
              <i className="fa fa-chevron-left"></i>
            </div>
            <Sidepannel
							getAddressesToLocate={this.getAddressesToLocate}
						/>
          </div>
          <div id="right">
            <Webmap
							addressesToLocate={this.state.addressesToLocate}
              clearAll={this.state.clearAll}
						/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
