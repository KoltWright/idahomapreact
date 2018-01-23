import React, { Component } from 'react';
import esriLoader from 'esri-loader';

import './Webmap.css';

import { adminBoundID } from '../../config.js'

const options = {url: 'https://js.arcgis.com/4.6/'};

var mapSymbology = {
  symbol: {
    type: "simple-marker",
    color: "blue",
    size: 8,
    outline: {
      width: 0.5,
      color: "darkblue"
    }
  }
};

class Webmap extends Component {
  constructor (props) {
    super(props);
	  this.state = {
	     view: {},
			 newMap: {},
       addressGraphicLayer: {},
       countyMapImageLayer: {},
       zoomed: false
	    }
  }

  componentDidMount() {
    esriLoader.loadModules([
      'esri/views/MapView',
      'esri/Map',
      'esri/layers/GraphicsLayer',
      'esri/layers/MapImageLayer'
			], options)
    .then(([MapView, Map, GraphicsLayer, MapImageLayer]) => {
      var newMap = new Map({
        basemap: 'streets',
      });

      var view = new MapView({
        map: newMap,
        container: 'map-container',
        zoom: 6.5,
        center: [-114.182650, 45.619913],
        highlightOptions: {
          color: [255, 255, 0, 1],
          haloOpacity: 0.9,
          fillOpacity: 0.2
        }
      });

      var addressGraphicLayer = new GraphicsLayer();
      newMap.add(addressGraphicLayer);

      var countyMapImageLayer = new MapImageLayer({
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
      newMap.add(countyMapImageLayer);

			this.setState({view, newMap, addressGraphicLayer, countyMapImageLayer});
    });
  }

  componentWillReceiveProps(nextProps) {
  	var {addressesToLocate} = nextProps;

		if (addressesToLocate.length > 1) {
      this.state.addressGraphicLayer.removeAll();

      var allGeomPoints = [];

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
					};

          allGeomPoints.push([coordinates[1], coordinates[0]]);

					var addressGraphic = new Graphic(Object.assign({
            geometry: point,
          }, mapSymbology));

					this.state.addressGraphicLayer.add(addressGraphic);
				});
        this.state.view.goTo({target: allGeomPoints});
			});
		} else if (addressesToLocate.length === 1) {
      this.state.addressGraphicLayer.removeAll();
			esriLoader.loadModules([
				'esri/Graphic',
				'esri/PopupTemplate',
        'esri/tasks/QueryTask',
        'esri/tasks/support/Query',
				], options)
			.then(([Graphic, PopupTemplate, QueryTask, Query]) => {

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

					var addressGraphic = new Graphic(Object.assign({
						geometry: point,
						attributes: attributes,
						popupTemplate: popup
  				}, mapSymbology));

          this.state.addressGraphicLayer.add(addressGraphic);

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
            console.log(attributes)

            if (attributes['SHAPE.STArea()'] < 12779318833) {
              this.state.view.goTo({target: geometry, zoom: 10});
            } else {
              this.state.view.goTo({target: geometry, zoom: 9});
            }


            var countyGraphic = new Graphic({
              geometry: geometry,
              attributes: attributes,
              symbol: {
                type: 'simple-fill',
                style: 'none',
                outline: {
                  color: '00FFFF',
                  width: 3
                }
              }
            });
            this.state.addressGraphicLayer.add(countyGraphic);
          });
				});
			});
		} else if (this.props.clearAll) {
      this.state.addressGraphicLayer.removeAll();
    } else {
      console.log("Not inside of Utah")
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
