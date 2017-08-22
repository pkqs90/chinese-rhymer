import _ from 'lodash';
import React, { Component } from 'react';
import JSONPretty from 'react-json-pretty';

import getRhyme from '../src';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputWord: '',
      errorMessage: '',
      isWorking: false,
      minFreq: '',
      maxFreq: '',
      outputRhymes: {},
    };

    this.onWordChange = this.onWordChange.bind(this);
    this.onMinFrequencyChange = ::this.onMinFrequencyChange;
    this.onMaxFrequencyChange = ::this.onMaxFrequencyChange;
    this.onButtonClick = ::this.onButtonClick;
  }

  onWordChange(event) {
    this.setState({
      inputWord: _.trim(event.target.value),
    });
  }

  onMinFrequencyChange(event) {
    this.setState({
      minFreq: _.trim(event.target.value),
    });
  }

  onMaxFrequencyChange(event) {
    this.setState({
      maxFreq: _.trim(event.target.value),
    });
  }

  onButtonClick() {
    let errorMessage = '';
    if (this.state.isWorking) {
      return;
    }
    if (!this.state.inputWord) {
      errorMessage = 'Must input a Chinese word.';
    }
    if (errorMessage) {
      this.setState({ errorMessage });
      return;
    }

    const trans = str =>
      (!_.isNaN(_.parseInt(str, 10)) ? _.parseInt(str, 10) : undefined);

    const minFrequency = trans(this.state.minFreq);
    const maxFrequency = trans(this.state.maxFreq);

    this.setState({ isWorking: true });

    const results = getRhyme(this.state.inputWord, {
      minFrequency, maxFrequency,
    });
    const outputRhymes = {};
    results.forEach((result) => {
      outputRhymes[result.word] = result.frequency;
    });

    this.setState({ outputRhymes, isWorking: false });
  }

  render() {
    return (
      <main>
        输入词语 <input type="text" onChange={this.onWordChange} /><br />
        最小词频 (默认 5000) <input type="text" onChange={this.onMinFrequencyChange} /><br />
        最大词频 (默认无上限) <input type="text" onChange={this.onMaxFrequencyChange} /><br />

        <button onClick={this.onButtonClick} style={{ width: '100px', height: '20px' }}>Go</button>
        <div>{ this.state.errorMessage }</div><br />
        <JSONPretty id="json-pretty" json={this.state.outputRhymes} />
      </main>
    );
  }
}
