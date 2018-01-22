import React, { Component } from 'react';
import axios from 'axios';

import './Sidepannel.css';
import {bingKey} from '../../config.js';
import ResultsPane from '../ResultsPane/ResultsPane.js';

class Sidepannel extends Component {
  constructor (props) {
    super(props);
	  this.state = {
	     queryStr: '',
	     queryStrVis: '',
	     suggestedAddrs: [],
	    }
  }

 getAddress = (queryStr) => {
	var queryStrVis = queryStr;

	if (!queryStr.match(/id/gi)) {
	  queryStr = queryStr.replace(/ /g, "%").toUpperCase() + '%ID';
	  this.setState({queryStr, queryStrVis});
	} else {
	  queryStr = queryStr.replace(/ /g, "%").toUpperCase();
	  this.setState({queryStr, queryStrVis});
	}

	axios.get(`https://dev.virtualearth.net/REST/v1/Locations?query=${queryStr}&maxResults=3&key=${bingKey}`)
	.then(res => {
	  var possAddrs = res.data.resourceSets[0].resources;
	  var suggestedAddrs = possAddrs.filter((val) => val.address.adminDistrict === 'ID' && val.address.formattedAddress !== 'Idaho');
	  this.setState({suggestedAddrs});
	})
	.catch(err => console.log(err));
  }

  autoFillqueryStr = (mappedAddr) => {
	  var queryStrVis = mappedAddr.address.formattedAddress;
	  var queryStr = mappedAddr.address.formattedAddress;
  	this.setState({queryStrVis, queryStr, suggestedAddrs: []});
	this.props.getAddressesToLocate([mappedAddr]);
  }

  submitQuery = () => {
  	this.props.getAddressesToLocate(this.state.suggestedAddrs);
  }

  clearQuery = () => {
    this.setState({queryStr: '', queryStrVis: '', suggestedAddrs: []});
  }

  render() {
    return (
      <div id="side-pannel">
				<div id="side-pannel-search">
					<div id="search-toolbar">
            <div id="address-input">
              <input type="text" value={this.state.queryStrVis} onChange={(e) => this.getAddress(e.target.value)} placeholder="Search for Address"></input>
            </div>
            <div id="search-button" onClick={this.submitQuery}>
              <div className="tool-tip">
                <i className="fa fa-search fa-lg" aria-hidden="true"></i>
                <span className="tool-tip-text">
                  <div className="tail"></div>
                  Search
                </span>
              </div>
            </div>
            <div id="clear-search" onClick={this.clearQuery}>
              <div className="tool-tip">
                <i className="fa fa-times fa-lg" aria-hidden="true"></i>
                <span className="tool-tip-text">Clear Search</span>
              </div>
            </div>
					</div>
          {
      			this.state.suggestedAddrs.map((val, index) => (
      				<div id={index.toString()} className="search-result" key={index.toString()} value={val.address.formattedAddress} onClick={(e) => this.autoFillqueryStr(this.state.suggestedAddrs[e.target.id])}>
      					{val.address.formattedAddress}
      				</div>
      				)
      			)
      		}
				</div>
        <div className="divide-line"></div>
        <ResultsPane />
      </div>
    )
  }
}

export default Sidepannel;
