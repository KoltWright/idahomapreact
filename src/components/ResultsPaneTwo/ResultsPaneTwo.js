import React, { Component } from 'react';
import renderIf from 'render-if';
import './ResultsPaneTwo.css';

const finalResults = (countOfAddrs, addrsFromMap) => {
  return renderIf(countOfAddrs === addrsFromMap.length);
};

class ResultsPaneTwo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationFired: false
    }
  }

  componentWillReceiveProps(props) {
    if (!this.state.notificationFired) {
      this.setState({notificationFired: true}, () => {
        this.notificationToUser(this.props.countOfAddrs, this.props.addrsFromMap)
      })
    };
  }

  notificationToUser = (countOfAddrs, addrsFromMap) => {
    var invalidAddrs = addrsFromMap.filter((val) => val[0].substring(0, 7) === 'INVALID');
    var notificationStr = 'The following addresses are Invalid:\n';

    invalidAddrs.forEach((val) => {
      var status = val[0];
      var {ADDRESS, CITY, STATE, ZIP} = val[1].attributes;

      notificationStr += `\nFull Address: ${ADDRESS} ${CITY}, ${STATE} ${ZIP}\nStatus: ${status}\n`;
    })

    setTimeout(() => alert(notificationStr), 1000);
  }

  render() {


    return (
      <div id="results-pane-container-two">
        {finalResults(this.props.countOfAddrs, this.props.addrsFromMap)(
            this.props.addrsFromMap.map(val => {
              var status = val[0];
              var {
                ADDRESS,
                CITY,
                COUNTY,
                STATE,
                ZIP,
                OBJECTID
              } = val[1].attributes;

              return (
                <div key={OBJECTID} className="address-result">
                  <div><b>Address Status:</b> {status}</div>
                  <div className="full-address">
                    <div>
                      <b>Full Address: </b>
                    </div>
                    <div>
                      <div>{`${ADDRESS}`}</div>
                      <div> {` ${CITY}, ${STATE} ${ZIP}`}</div>
                    </div>
                  </div>
                  <div><b>County:</b> {COUNTY? `${COUNTY}`: 'N/A'}</div>
                </div>
              )
            })
          )
        }

      </div>
    )
  }
}

export default ResultsPaneTwo;
