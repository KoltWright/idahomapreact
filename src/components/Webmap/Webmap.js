import React, { Component } from 'react';
import esriLoader from 'esri-loader';

import './Webmap.css';

import { adminBoundID } from '../../config.js'

const options = {url: 'https://js.arcgis.com/4.6/'};

class Webmap extends Component {
  constructor (props) {
    super(props);
	  this.state = {
	     view: {},
			 newMap: {}
	    }
  }

  componentDidMount() {
    esriLoader.loadModules([
      'esri/views/MapView',
      'esri/Map',
      'esri/layers/MapImageLayer'
			], options)
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

			this.setState({view, newMap});
    });
  }

  componentWillReceiveProps(nextProps) {
  	var {addressesToLocate} = nextProps;

		if (addressesToLocate.length > 1) {
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

					this.state.view.graphics.add(graphic);
				});
			});
		} else {
			esriLoader.loadModules([
				'esri/Graphic',
				'esri/PopupTemplate'
				], options)
			.then(([Graphic, PopupTemplate]) => {
				addressesToLocate.forEach(address => {
					var {coordinates, type} = address.point;

					var point = {
						type: type.toLowerCase(),
						latitude: coordinates[0],
						longitude: coordinates[1]
					};

					var attributes = {
						fullAddress: address.address.formattedAddress,
						confidence: address.confidence
					};

					var popup = new PopupTemplate({
						title: "Full Address: {fullAddress}<br>Confidence Level: {confidence}</br>"
					});

					var graphic = new Graphic({
						geometry: point,
						attributes: attributes,
						symbol: {
      				type: "simple-marker",
      				color: "blue",
      				size: 8,
      				outline: {
      					width: 0.5,
      					color: "darkblue"
      				}
						},
						popupTemplate: popup
  				});

					this.state.view.graphics.add(graphic);

				});
			});
		}
    
  };

  render() {
    return (
      <div id="map-container">
      </div>
    )
  }
}

export default Webmap;
