import React, { Component } from 'react';
import './Navbar.css';

class Navbar extends Component {
  render() {
    return (
      <div id='navbar'>
        <img id="idaho-seal" src="idahostateseal.png" alt="Idaho State Seal"/>
		<h1>Idaho Address Search</h1>
      </div>
    )
  }
}

export default Navbar;
