import React, { Component } from 'react';
import esriLoader from 'esri-loader';

import './Webmap.css';

import { adminBoundID } from '../../config.js'

const options = {url: 'https://js.arcgis.com/4.6/'};

class Webmap extends Component {
  constructor (props) {
    super(props);
	  this.state = {
	     view: {}
	    }
  }

  componentDidMount() {
    esriLoader.loadModules([
      'esri/views/MapView',
      'esri/Map',
      'esri/layers/MapImageLayer',
	    'esri/Graphic'], options)
    .then(([MapView, Map, MapImageLayer, Graphic]) => {
      var newMap = new Map({
        basemap: 'streets',
      });

      var view = new MapView({
        map: newMap,
        container: 'map-container',
        zoom: 6.5,
        center: [-114.182650, 45.055278]
      });

      this.setState({view});

      var layer = new MapImageLayer({
        url: adminBoundID,
        sublayers: [{
          id: 2,
          visible: false
        },{
          id: 1,
          visible: true
        }, {
          id: 0,
          visible: false
        }]
      });

      newMap.add(layer);
    });
  }

  componentWillReceiveProps(nextProps) {
  	var {addressesToLocate} = nextProps;
    esriLoader.loadModules([
      'esri/Graphic'
    ], options)
    .then(([Graphic]) => {
      addressesToLocate.forEach(address => {
        var {coordinates, type} = address.point;

        var point = {
          type: type.toLowerCase(),
          latitude: coordinates[0],
          longitude: coordinates[1]
        }
        console.log(point);

        var graphic = new Graphic({
          geometry: point,
      		  symbol: {
      		    type: "simple-marker",
      		    color: "blue",
      		    size: 8,
      		    outline: {
      			  width: 0.5,
      			  color: "darkblue"
      		    }
      		  }
  	    });
        console.log(graphic);
        this.state.view.graphics.add(graphic);
      });
	   });
  };

  render() {
    return (
      <div id="map-container">
      </div>
    )
  }
}

export default Webmap;
