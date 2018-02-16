import React, { Component } from 'react';

import './IdahoAddressesTwo.css';

import WebmapTwo from '../WebmapTwo/WebmapTwo.js';

class IdahoAddressesTwo extends Component {
  constructor(props) {
    super(props)
    this.state = {
    collapsed: false
    }
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
        <div className="content">
          <div id="left">
            <div className="collapse-button" onClick={this.collapseSidePannel}>
              <i className="fa fa-chevron-left"></i>
            </div>
          </div>
          <div id="right">
            <WebmapTwo />
          </div>
        </div>
    );
  }
}

export default IdahoAddressesTwo;
