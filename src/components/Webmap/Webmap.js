import React, { Component } from 'react';
import esriLoader from 'esri-loader';

import './Webmap.css';

import { adminBoundID } from '../../config.js'

const options = {url: 'https://js.arcgis.com/4.6/'};

const mapSymbology = {
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

var extentCalc = (coordsArr) => {
  let yValues = []
  let xValues = []
  coordsArr.map((val) => {
    yValues.push(val[1]);
    xValues.push(val[0])
  });

  return {
    xmin: Math.min.apply(null, xValues) - 0.2,
    ymin: Math.min.apply(null, yValues) - 0.2,
    xmax: Math.max.apply(null, xValues) + 0.2,
    ymax: Math.max.apply(null, yValues) + 0.2,
  };
};

class Webmap extends Component {
  constructor (props) {
    super(props);
	  this.state = {
	     view: {},
			 newMap: {},
       graphicLayer: {},
	    }
  };

  componentDidMount() {
    esriLoader.loadModules([
      'esri/views/MapView',
      'esri/Map',
      'esri/layers/GraphicsLayer',
			], options)
    .then(([MapView, Map, GraphicsLayer]) => {
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

      var graphicLayer = new GraphicsLayer();
      newMap.add(graphicLayer);

			this.setState({view, newMap, graphicLayer});
    });
  };

  componentWillReceiveProps(nextProps) {
  	var {addressesToLocate, clearAll} = nextProps;

    esriLoader.loadModules([
      'esri/Graphic',
      'esri/geometry/Polyline',
      'esri/PopupTemplate',
      'esri/geometry/Extent',
      'esri/tasks/QueryTask',
      'esri/tasks/support/Query',
    ], options)
    .then(([Graphic, Polyline, PopupTemplate, Extent, QueryTask, Query]) => {
      if (clearAll) {

        this.state.graphicLayer.removeAll();

      } else if (addressesToLocate.length > 1) {

        this.state.graphicLayer.removeAll();

        var paths = [];

				addressesToLocate.forEach(address => {
					var {coordinates, type} = address.point;

					var point = {
						type: type.toLowerCase(),
						latitude: coordinates[0],
						longitude: coordinates[1]
					};

          paths.push([coordinates[1], coordinates[0]]);

					var addressGraphic = new Graphic(Object.assign({
            geometry: point,
          }, mapSymbology));

          this.state.graphicLayer.add(addressGraphic);
				});

        var lineExtent = extentCalc(paths);

        this.state.view.extent = new Extent({
          xmin: lineExtent.xmin,
          ymin: lineExtent.ymin,
          xmax: lineExtent.xmax,
          ymax: lineExtent.ymax,
        });

  		} else if (addressesToLocate.length === 1) {
        this.state.graphicLayer.removeAll();

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

          this.state.graphicLayer.add(addressGraphic);

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

           this.state.graphicLayer.add(countyGraphic);

           var polygonExtent = extentCalc(geometry.rings[0]);

           this.state.view.extent = new Extent({
             xmin: polygonExtent.xmin,
             ymin: polygonExtent.ymin,
             xmax: polygonExtent.xmax,
             ymax: polygonExtent.ymax,
           });
         });
       });
     } else {
       console.log("Not inside of Utah")
     }
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
