import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './Navbar.css';

class Navbar extends Component {
  constructor (props) {
    super (props);
    this.state = {
      titleOneActive: true,
      titleTwoActive: false
    }
  };

  componentWillMount () {
    if (window.location.href.slice(-1) !== "/") {
      this.setState({titleOneActive: false, titleTwoActive: true});
    }
  }

  activeTitle = (id) => {
    if(id === 'one') {
      this.setState({titleOneActive: true, titleTwoActive: false})
    } else if (id === 'two') {
      this.setState({titleOneActive: false, titleTwoActive: true})
    }
  }

  render() {
    return (
      <div id='navbar'>
        <div id="navbar-left">
          <img id="idaho-seal" src="idahostateseal.png" alt="Idaho State Seal"/>
          <h1 className={this.state.titleOneActive ? 'active': 'inactive'}>Idaho Addresses Part 1</h1>
          <h1 className={this.state.titleTwoActive ? 'active': 'inactive'}>Idaho Addresses Part 2</h1>
        </div>
        <div id="navbar-right">
          <Link to="/">
            <div id="one" className={this.state.titleOneActive ? 'navbar-button navbar-button-active': 'navbar-button navbar-button-inactive'} onClick={(e) => this.activeTitle(e.target.id)}>1</div>
          </Link>
          <Link to="/addressesTwo">
            <div id="two" className={this.state.titleOneActive ? 'navbar-button navbar-button-inactive': 'navbar-button navbar-button-active'} onClick={(e) => this.activeTitle(e.target.id)}>2</div>
          </Link>
        </div>
      </div>
    )
  }
}

export default Navbar;
