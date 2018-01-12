import React, { Component } from 'react';
import esriLoader from 'esri-loader';

import './Webmap.css';

import { adminBoundID } from '../../config.js'

class Webmap extends Component {

  componentDidMount() {
    const options = {
      url: 'https://js.arcgis.com/4.6/'
    }

    esriLoader.loadModules([
      'esri/views/MapView',
      'esri/Map',
      'esri/layers/MapImageLayer'], options)
    .then(([MapView, Map, MapImageLayer]) => {
      var newMap = new Map({
        basemap: 'streets',
      });

      var view = new MapView({
        map: newMap,
        container: 'map-container',
        zoom: 6.5,
        center: [-114.182650, 45.055278]
      });

      var layer = new MapImageLayer({
        url: adminBoundID,
        sublayers: [{
          id: 2,
          visible: false
        },{
          id: 1,
          visible: false
        }, {
          id: 0,
          visible: false
        }]
      });

      newMap.add(layer);
    });
  }
  render() {
 
    return (
      <div id="map-container">
      </div>
    )
  }
}

export default Webmap;
