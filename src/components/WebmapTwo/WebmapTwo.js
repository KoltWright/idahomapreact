import React, { Component } from 'react';
import esriLoader from 'esri-loader';
import axios from 'axios';

import './WebmapTwo.css';

import { adminBoundID, countyAddressUrl, userIdUSPS, bingKey } from '../../config.js'

const options = {url: 'https://js.arcgis.com/4.6/'};

class WebmapTwo extends Component {
  constructor (props) {
    super(props);
	  this.state = {
	     view: {},
			 newMap: {},
       countOfAddrs: 1,
       sortedAddrs: []
	    }
  };

  componentDidMount() {
    esriLoader.loadModules([
      'esri/views/MapView',
      'esri/Map',
      'esri/widgets/BasemapToggle',
      'esri/tasks/QueryTask',
      'esri/tasks/support/Query'
			], options)
    .then(([
      MapView, Map, BasemapToggle, QueryTask, Query
    ]) => {
      var newMap = new Map({
        basemap: 'streets',
      });

      var view = new MapView({
        map: newMap,
        container: 'map-container',
        zoom: 6.5,
        center: [-114.182650, 45.619913],
        popup: {
          dockEnabled: true,
          dockOptions: {
            buttonEnabled: false,
            breakpoint: false
          },
          actions: [],
          title: 'Valid Addresses',
          content: `Please hover over each county to see in which county
          the valid Idaho addresses are located in.`
        }
      });

      view.popup.open();

      var basemapToggle = new BasemapToggle({
        view: view,
        nextBasemap: 'satellite'
      });

      view.ui.add(basemapToggle, 'bottom-right');

      var queryAddressesTask = new QueryTask({
        url: `${countyAddressUrl}\\0`
      });

      var queryAddresses = new Query({
        where: '1=1',
        returnGeometry: true,
        outFields: ['*']
      });

      queryAddressesTask.execute(queryAddresses)
      .then( res => {
        this.setState({countOfAddrs: res.features.length});

        res.features.forEach(val => {
          var {attributes} = val;

          if (attributes.STATE !== 'ID') {
            for (var key in attributes) {
              attributes[key] = String(attributes[key]).toUpperCase().trim()
              .replace(/  +/g, ' ').replace(/[.,]/g, '')
            }

            this.setState({sortedAddrs: [...this.state.sortedAddrs, ['INVALID - OUTSIDE IDAHO', val]]});
          } else {
            var controller = 0;

            for (let key in attributes) {
              var formatted = String(attributes[key]).toUpperCase().trim()
              .replace(/  +/g, ' ').replace(/[.,]/g, '').replace(/ /g, '%20');
              if (!formatted || formatted === 'NULL') {
                for (let key in attributes) {
                  attributes[key] = String(attributes[key]).toUpperCase()
                  .trim().replace(/  +/g, ' ').replace(/[.,]/g, '').replace(/%20/g, ' ')
                }
                this.setState({sortedAddrs: [...this.state.sortedAddrs, ['INVALID - INCOMPLETE', val]]})
                controller = 1;
                break;
              }
              attributes[key] = formatted;
            }

            if (controller !== 1) {
              var formattedRequest = `%3CAddressValidateRequest%20USERID=%22${userIdUSPS}%22%3E%3CAddress
              %20ID=%22${attributes.OBJECTID}%22%3E%3CAddress1%3E%3C/Address1%3E
              %20%3CAddress2%3E${attributes.ADDRESS}
              %3C/Address2%3E%3CCity%3E${attributes.CITY}%3C/City%3E%3CState%3E${attributes.STATE}%3C/State%3E
              %3CZip5%3E${attributes.ZIP}%3C/Zip5%3E%20%3CZip4%3E%3C/Zip4%3E%3C/Address%3E%3C/AddressValidateRequest%3E`

              axios.get(`https://secure.shippingapis.com/ShippingAPITest.dll?API=Verify&XML=${formattedRequest}`)
              .then(res => {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(res.data,"text/xml");

                if (xmlDoc.getElementsByTagName('Error').length === 0) {
                  attributes.ADDRESS = xmlDoc.getElementsByTagName('Address2')[0].innerHTML;
                  attributes.CITY = xmlDoc.getElementsByTagName('City')[0].innerHTML;
                  attributes.STATE = xmlDoc.getElementsByTagName('State')[0].innerHTML;
                  attributes.ZIP = xmlDoc.getElementsByTagName('Zip5')[0].innerHTML;
                  this.setState({sortedAddrs: [...this.state.sortedAddrs, ['VARIFIED BY USPS', val]]});
                } else {
                  var queryStr = `${attributes.ADDRESS}%20${attributes.CITY},%20
                  ${attributes.STATE}%20${attributes.ZIP}`;

                  axios.get(`https://dev.virtualearth.net/REST/v1/Locations?query=${queryStr}&maxResults=3&key=${bingKey}`)
                  .then(res => {
                    var possAddrs = res.data.resourceSets[0].resources;
                    var suggestedAddrs = possAddrs.filter((val) => {
                      return val.address.adminDistrict === 'ID' && val.address.formattedAddress !== 'Idaho'
                    });

                    attributes.ADDRESS = suggestedAddrs[0].address.addressLine.toUpperCase();
                    attributes.CITY = suggestedAddrs[0].address.locality.toUpperCase();
                    attributes.STATE = suggestedAddrs[0].address.adminDistrict.toUpperCase();
                    attributes.ZIP = suggestedAddrs[0].address.postalCode;
                    this.setState({sortedAddrs: [...this.state.sortedAddrs, ['VARIFIED BY BING MAPS API', val]]});
                  })
                  .catch(err => console.log(err));
                }
              })
              .catch(err => console.log(err))
            }
            controller = 0;
          }
        })
      })
      .catch(err => console.log(err))

      this.setState({view, newMap});
    })
  }

  componentDidUpdate(prevProps, prevState) {
    var addressUpdate = prevState.sortedAddrs === this.state.sortedAddrs? false: true;

    if(this.state.countOfAddrs === this.state.sortedAddrs.length && addressUpdate) {
      esriLoader.loadModules([
        'esri/layers/GraphicsLayer',
        'esri/Graphic',
        'esri/tasks/QueryTask',
        'esri/tasks/support/Query'
  			], options)
      .then(([
        GraphicsLayer, Graphic, QueryTask, Query
      ]) => {
        var addrsGraphicLayer = new GraphicsLayer();
        var countyGraphicLayer = new GraphicsLayer();

        var queryCountyTask = new QueryTask({
          url: `${adminBoundID}\\1`
        });

        this.state.sortedAddrs.forEach((val, index) => {
          if (val[0].substring(0, 8) === 'VARIFIED') {
            var {attributes, geometry} = val[1];

            var queryCounties = new Query({
              returnGeometry: true,
              outFields: ['*'],
              geometry: geometry,
              spatialRelationship: 'intersects',
            });


            queryCountyTask.execute(queryCounties)
            .then(res => {
              res.features.forEach(val => {
                var {attributes, geometry} = val;

                var sortedAddrs = this.state.sortedAddrs;
                sortedAddrs[index][1].attributes.COUNTY = attributes.CountyName;
                this.setState({sortedAddrs: sortedAddrs}, () => {
                  if(addressUpdate) {
                    this.props.getAddrsFromMap(this.state.sortedAddrs, this.state.countOfAddrs);
                  }
                });

                var counties = countyGraphicLayer.graphics.items;
                var addCounty = true;
                for (var i = 0; i < counties.length; i++) {
                  if (attributes.CountyName === counties[i].attributes.CountyName) {
                    addCounty = false;
                    break;
                  }
                }

                if (addCounty) {
                  var countyGraphic = new Graphic({
                    geometry: geometry,
                    attributes: attributes,
                    symbol: {
                      type: 'simple-fill',
                      style: 'solid',
                      color: [0, 0, 255, 0.75],
                      outline: {
                        color: 'black',
                        width: 2
                      }
                    }
                  });
                  countyGraphicLayer.add(countyGraphic);
                }
                addCounty = true;
              });
            });
          }
        })
        this.state.newMap.add(countyGraphicLayer);

        var highlightGraphic = new GraphicsLayer();

        this.state.newMap.add(highlightGraphic);
        this.state.view.on('pointer-move', (e) => {
          this.state.view.hitTest(e)
          .then((res) => {
            console.log(res);
            var test = res.results.length > 0? true : false;

            if (test) {
              if (res.results.length === 1) {
                highlightGraphic.removeAll();

                var {attributes} = res.results[0].graphic;

                var interectAddrs = this.state.sortedAddrs.filter(addr => {
                  return attributes.CountyName === addr[1].attributes.COUNTY;
                })

                var highlightedGraphicArray = interectAddrs.map(intersectAddr => {

                  var {attributes, geometry} = intersectAddr[1];

                  var highlightAddress = new Graphic({
                    geometry: geometry,
                    attributes: attributes,
                    type: 'point',
                    symbol: {
                      type: "simple-marker",
                      color: "00FFFF",
                      size: 8,
                      outline: {
                        width: 0.5,
                        color: "00FFFF"
                      }
                    }
                  });

                  highlightAddress.popupTemplate = {
                    title: "Valid Address Information",
                    content: 'test tester {ADDRESS}'
                  };

                  return highlightAddress;
                })

                highlightGraphic.addMany(highlightedGraphicArray);
                highlightGraphic.popup.open(highlightedGraphicArray[1]);
              }
            } else if (!test) {
              highlightGraphic.removeAll();
            }
          })
        });
      })
    }
  }

  notification = (test) => setTimeout(function(){alert(JSON.stringify(test))}, 1000)

  render() {
    return (
      <div id="map-container">
      </div>
    )
  }
}

export default WebmapTwo;
