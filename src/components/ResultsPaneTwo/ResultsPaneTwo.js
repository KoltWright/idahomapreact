import React, { Component } from 'react';
import renderIf from 'render-if';
import './ResultsPaneTwo.css';

const finalResults = (countOfAddrs, addrsFromMap) => {
  return renderIf(countOfAddrs === addrsFromMap.length);
};

class ResultsPaneTwo extends Component {
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
                  <div>Address Status: {status}</div>
                  <div>Full Address:</div>
                  <div> {`${ADDRESS} ${CITY} ${STATE} ${ZIP}`}</div>
                  <div>County: {`${COUNTY}`}</div>
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
