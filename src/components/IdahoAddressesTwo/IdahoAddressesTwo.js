import React, { Component } from 'react';

import './IdahoAddressesTwo.css';

import WebmapTwo from '../WebmapTwo/WebmapTwo.js';
import ResultsPaneTwo from '../ResultsPaneTwo/ResultsPaneTwo.js';

class IdahoAddressesTwo extends Component {
  constructor(props) {
    super(props)
    this.state = {
    collapsed: false,
    addrsFromMap: [],
    countOfAddrs: 1
    }
  }

  collapseSidePannel = () => {
    var sidePannel = document.getElementById('left-two');
    var map = document.getElementById('right-two');
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

  getAddrsFromMap = (addrsFromMap, countOfAddrs) => {
    this.setState({addrsFromMap, countOfAddrs});
  }

  render() {
    return (
        <div className="content-two">
          <div id="left-two">
            <div id="address-results-container">
              <h1>Addresses:</h1>
              <ResultsPaneTwo
                addrsFromMap={this.state.addrsFromMap}
                countOfAddrs={this.state.countOfAddrs}
              />
            </div>
            <div className="collapse-button" onClick={this.collapseSidePannel}>
              <i className="fa fa-chevron-left"></i>
            </div>
          </div>
          <div id="right-two">
            <WebmapTwo
              getAddrsFromMap={this.getAddrsFromMap}
            />
          </div>
        </div>
    );
  }
}

export default IdahoAddressesTwo;
