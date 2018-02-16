import React, { Component } from 'react';
import esriLoader from 'esri-loader';

import './WebmapTwo.css';

import { adminBoundID, countryAddressUrl } from '../../config.js'

const options = {url: 'https://js.arcgis.com/4.6/'};

const mapSymbology = {
  symbol: {
    type: "simple-marker",
    color: "blue",
    size: 6,
    outline: {
      width: 0.5,
      color: "darkblue"
    }
  }
};

const highlightSymbol = {
  type: "simple-marker",
  color: '00FFFF',
  size: 6,
  outline: {
    width: 0.5,
    color: "black"
  }
}

class WebmapTwo extends Component {
  constructor (props) {
    super(props);
	  this.state = {
	     view: {},
			 newMap: {}
	    }
  };

  componentDidMount() {
    esriLoader.loadModules([
      'esri/views/MapView',
      'esri/Map',
      'esri/layers/GraphicsLayer',
      'esri/Graphic',
      'esri/widgets/BasemapToggle',
      'esri/tasks/QueryTask',
      'esri/tasks/support/Query',
      'esri/PopupTemplate',
      'esri/geometry/Multipoint'
			], options)
    .then(([
      MapView,
      Map,
      GraphicsLayer,
      Graphic,
      BasemapToggle,
      QueryTask,
      Query,
      PopupTemplate,
      Multipoint
    ]) => {
      var newMap = new Map({
        basemap: 'streets',
      });

      var view = new MapView({
        map: newMap,
        container: 'map-container',
        zoom: 5,
        center: [-98.542162, 39.224087]
      });

      var basemapToggle = new BasemapToggle({
        view: view,
        nextBasemap: 'satellite'
      });

      view.ui.add(basemapToggle, 'bottom-right');

      var addressGraphicLayer = new GraphicsLayer();
      var countyGraphicLayer = new GraphicsLayer();
      var highlightGraphic = new GraphicsLayer();
      newMap.add(addressGraphicLayer);
      newMap.add(countyGraphicLayer);
      newMap.add(highlightGraphic);

      var queryAddressesTask = new QueryTask({
        url: `${countryAddressUrl}\\0`
      });

      var queryCountyTask = new QueryTask({
        url: `${adminBoundID}\\1`
      });

      var queryAddresses = new Query({
        where: '1=1',
        returnGeometry: true,
        outFields: ['*']
      });

      queryAddressesTask.execute(queryAddresses)
      .then( res => {
        var addressPoints = new Multipoint();

        res.features.forEach(val => {
          var {attributes, geometry} = val;

          var addressGraphic = new Graphic(Object.assign({
            geometry: geometry,
            attributes: attributes
          }, mapSymbology));
          addressGraphicLayer.add(addressGraphic);
          addressPoints.addPoint(geometry);
        })

        console.log(addressPoints);

        var queryCounties = new Query({
          returnGeometry: true,
          outFields: ['*'],
          geometry: addressPoints,
          spatialRelationship: 'intersects',
        });


        queryCountyTask.execute(queryCounties)
        .then(res => {
          var {attributes, geometry} = res.features;
          console.log(attributes);
        });
      });

      view.on('pointer-move', (e) => {
        view.hitTest(e)
        .then((res) => {
          var test = res.results.length > 0? true : false;

          if (test) {
            if (res.results.length === 1) {

              highlightGraphic.removeAll();

              var {attributes, geometry} = res.results[0].graphic;

              var highlightAddress = new Graphic({
                geometry: geometry,
                attributes: attributes,
                symbol: highlightSymbol
              });

              highlightGraphic.add(highlightAddress);
              view.popup.open({
                content: "test",
                location: geometry
              });
            }
          } else if (!test) {
            highlightGraphic.removeAll();
            view.popup.close();
          }


        })
      });


			this.setState({view, newMap});
    });
  };

  render() {
    return (
      <div id="map-container">
      </div>
    )
  }
}

export default WebmapTwo;
