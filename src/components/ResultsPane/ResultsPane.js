import React, { Component } from 'react';
import renderIf from 'render-if';
import './ResultsPane.css';

const singleAddr = (sugAddrsSubmited) => {
  return renderIf(sugAddrsSubmited.length === 1 && sugAddrsSubmited[0] !== 'Not in Idaho');
};

const multipleAddrs = (sugAddrsSubmited) => {
  return renderIf(sugAddrsSubmited.length > 1);
};

const nonIdahoAddr = (sugAddrsSubmited) => {
  return renderIf(sugAddrsSubmited[0] === 'Not in Idaho')
};

class ResultsPane extends Component {
  render() {
    return (
      <div id="results-pane-container">
        <h1>Results:</h1>
        {singleAddr(this.props.sugAddrsSubmited)(
          this.props.sugAddrsSubmited.map((addr, index) => {
            if (addr !== "Not in Idaho") {
              var {
                addressLine,
                locality,
                adminDistrict2,
                adminDistrict,
                postalCode
              } = addr.address;

              return (
                  <ol key={index}>
                    <li>Address: {addressLine}</li>
                    <li>City: {locality}</li>
                    <li>County: {adminDistrict2}</li>
                    <li>State: {adminDistrict}</li>
                    <li>Zip Code: {postalCode}</li>
                    <li>Confidence: {addr.confidence}</li>
                  </ol>
              )
            } else {
              return (
                <div></div>
              )
            }
          })
        )}
        {multipleAddrs(this.props.sugAddrsSubmited)(
          <div>
            There are multiple Idaho addresses matching your search criteria.
            Please select the desired address from the map.
          </div>
        )}
        {nonIdahoAddr(this.props.sugAddrsSubmited)(
          <div>This address is not a valid Idaho Address</div>
        )}

      </div>
    )
  }
}

export default ResultsPane;
