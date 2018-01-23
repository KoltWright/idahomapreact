import React, { Component } from 'react';
import renderIf from 'render-if';
import './ResultsPane.css';

const displayNothing = (displayType) => renderIf(displayType === "Nothing");

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
        {displayNothing(this.state.displayType)(
          <div></div>
        )}
      </div>
    )
  }
}

export default ResultsPane;
