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
			 newMap: {},
       addressGraphicLayer: {},
       zoomed: false
	    }
  }

  componentDidMount() {
    esriLoader.loadModules([
      'esri/views/MapView',
      'esri/Map',
      'esri/layers/GraphicsLayer'
			], options)
    .then(([MapView, Map, GraphicsLayer]) => {
      var newMap = new Map({
        basemap: 'streets',
      });

      var view = new MapView({
        map: newMap,
        container: 'map-container',
        zoom: 6.5,
        center: [-114.182650, 45.055278]
      });

      var addressGraphicLayer = new GraphicsLayer();

      newMap.add(addressGraphicLayer);

			this.setState({view, newMap, addressGraphicLayer});
    });
  }

  componentWillReceiveProps(nextProps) {
  	var {addressesToLocate} = nextProps;

		if (addressesToLocate.length > 1) {
			esriLoader.loadModules([
        'esri/layers/GraphicsLayer',
				'esri/Graphic'
				], options)
			.then(([GraphicsLayer, Graphic]) => {
        var addressGraphicLayer = new GraphicsLayer()

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
					addressGraphicLayer.add(graphic);
				});
        this.state.map.add(addressGraphicLayer);
			});
		} else {
			esriLoader.loadModules([
				'esri/Graphic',
				'esri/PopupTemplate',
        'esri/tasks/QueryTask',
        'esri/tasks/support/Query',
        'esri/layers/MapImageLayer'
				], options)
			.then(([Graphic, PopupTemplate, QueryTask, Query, MapImageLayer]) => {

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

        this.state.newMap.add(layer);

				addressesToLocate.forEach(address => {
					var {coordinates, type} = address.point;

					var point = {
						type: type.toLowerCase(),
						latitude: coordinates[0],
						longitude: coordinates[1]
					};

					var attributes = {
						fullAddress: address.address.formattedAddress,
						confidence: address.confidence,
            image: "idahostateseal.png"
					};

					var popup = new PopupTemplate({
						title: "Full Address: {fullAddress}<br>Confidence Level: {confidence}</br>",
            content: "<input></input>"
					});

					var addressGraphic = new Graphic({
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

          var queryCountiesTask = new QueryTask({
            url: `${adminBoundID}\\1`
          });

          var query = new Query({
            returnGeometry: true,
            outFields: ['*'],
            geometry: point,
            spatialRelationship: 'intersects',
          });
          queryCountiesTask.execute(query)
          .then( result => {
            var {attributes, geometry} = result.features[0];

            this.state.view.goTo(geometry);
            layer.sublayers.map(subLayer => {
              if(subLayer.id === 1) {
                subLayer.visible = true;
                subLayer.definitionExpression = `CountyName = '${attributes.CountyName}'`;
								return subLayer;
              }
            });
          });

					this.state.view.graphics.add(addressGraphic);
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
