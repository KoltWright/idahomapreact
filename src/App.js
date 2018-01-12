import React, { Component } from 'react';
import axios from 'axios';

import './App.css';

import Webmap from './components/Webmap/Webmap.js';
import Sidepannel from './components/Sidepannel/Sidepannel.js';
import Navbar from './components/Navbar/Navbar.js';
import {bingKey} from './config.js';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
	  queryStr: '',
	  suggestedAddrs: [],
	  queryExcuted: false
    }
  }

  getAddress = (queryStr) => {
	if (!queryStr.match(/id/gi)) {
	  queryStr = queryStr.replace(/ /g, "%").toUpperCase() + '%ID';
	  this.setState({queryStr});
	} else {
	  queryStr = queryStr.replace(/ /g, "%").toUpperCase();
	  this.setState({queryStr});
	}

	axios.get(`https://dev.virtualearth.net/REST/v1/Locations?query=${queryStr}&maxResults=6&key=${bingKey}`)
	.then(res => {
	  var possAddrs = res.data.resourceSets[0].resources;
	  var suggestedAddrs = possAddrs.filter((val) => val.address.adminDistrict === 'ID' && val.address.formattedAddress !== 'Idaho');
	  this.setState({suggestedAddrs});
	})
	.catch(err => console.log(err));
  }

  autoFillqueryStr = (queryStr) => {
  	this.setState({queryStr});
  }

  render() {
    return (
      <div className="App">
        <Navbar />
        <div className="content">
          <div className="left">
            <Sidepannel 
			 getAddress={this.getAddress}
			 suggestedAddrs={this.state.suggestedAddrs}
			/>
          </div>
          <div className="right">
            <Webmap />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
