import React, { Component } from 'react';
import './Sidepannel.css';

class Sidepannel extends Component {
  constructor (props) {
    super(props);
	this.state = {
      suggestedAddrs: []
	}
  }

 componentWillReceiveProps(nextProps) {
    var {suggestedAddrs} = nextProps;
	this.setState({suggestedAddrs});
  }

  render() {
    return (
      <div id="side-pannel">
        <input type="text" onChange={(e) => this.props.getAddress(e.target.value)}></input>
        <button>Search</button>
		{
			this.state.suggestedAddrs.map((val, index) => (
				<div id={index.toString()} key={index.toString()}>
					{val.address.formattedAddress}
				</div>
				)
			)
		}
      </div>
    )
  }
}

export default Sidepannel;
