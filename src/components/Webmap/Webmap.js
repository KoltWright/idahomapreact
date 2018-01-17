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

	  view.on("click", function(event){
	    console.log(event);
	    var graphic = new Graphic({
		  geometry: event.mapPoint,
		  symbol: {
		    type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
		    color: "blue",
		    size: 8,
		    outline: {  // autocasts as new SimpleLineSymbol()
			  width: 0.5,
			  color: "darkblue"
		    }
		  }
	    });
      view.graphics.add(graphic);
	  });
    });
  }

  componentWillReceiveProps(nextProps) {
	var {addressesToLocate} = nextProps;

	test(addressesToLocate);

  	
  }

  render() {
    return (
      <div id="map-container">
      </div>
    )
  }
}

export default Webmap;
