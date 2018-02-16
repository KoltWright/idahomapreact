import React, { Component } from 'react';

import './IdahoAddressesOne.css';

import Webmap from '../Webmap/Webmap.js';
import Sidepannel from '../Sidepannel/Sidepannel.js';

class IdahoAddressesOne extends Component {
  constructor(props) {
    super(props)
    this.state = {
    collapsed: false,
	  addressesToLocate: [],
    clearAll: false,
    addressFromMap: ''
    }
  }

  getAddressesToLocate = (addressesToLocate, clearAll) => {
  	this.setState({addressesToLocate, clearAll});
  }

  submitAddressFromMap = (addressFromMap) => {
    this.setState({addressFromMap});
  }

  collapseSidePannel = (test) => {
    console.log(test)
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
        <div className="content">
          <div id="left">
            <div className="collapse-button" onClick={this.collapseSidePannel}>
              <i className="fa fa-chevron-left"></i>
            </div>
            <Sidepannel
							getAddressesToLocate={this.getAddressesToLocate}
              addressFromMap={this.state.addressFromMap}
						/>
          </div>
          <div id="right">
            <Webmap
							addressesToLocate={this.state.addressesToLocate}
              clearAll={this.state.clearAll}
              submitAddressFromMap={this.submitAddressFromMap}
						/>
          </div>
        </div>
    );
  }
}

export default IdahoAddressesOne;
