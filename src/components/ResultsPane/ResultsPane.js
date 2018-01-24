import React, { Component } from 'react';
import renderIf from 'render-if';
import './ResultsPane.css';

const displayNothing = (queryStrVis, suggestedAddrs, querySubmitted) => {
  return renderIf(queryStrVis === '' && suggestedAddrs.length === 0 && querySubmitted === true);
};

class ResultsPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayType: "Nothing",
      dataToDisplay: ""
    }
  }
  render() {
    return (
      <div id="results-pane-container">
        <h1>Results:</h1>
        {displayNothing(this.props.queryStrVis, this.props.suggestedAddrs, this.props.querySubmitted)(
          <div>This address is not a Valid Idaho Address</div>
        )}
      </div>
    )
  }
}

export default ResultsPane;
