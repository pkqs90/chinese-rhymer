import _ from 'lodash';
import { Component } from 'react'
import fetch from 'isomorphic-fetch'

import getRhyme from '../src';

export default class extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      inputWord: '',
      isWorking: false
    };

    this.onTextChange = ::this.onTextChange;
    this.onButtonClick = ::this.onButtonClick;
  }

  onTextChange(event) {
    this.setState({
      inputWord: _.trim(event.target.value)
    });
  }

  onButtonClick() {
    if (this.state.isWorking || !this.state.inputWord) {
      return;
    }
    this.setState({ isWorking: true });
    const outputRhymes = getRhyme(this.state.inputWord).join(' ');
    this.setState({ outputRhymes, isWorking: false });
  }

  render () {
    return (
      <main>
        <input type='text' onChange={this.onTextChange} /><br />
        <button onClick={this.onButtonClick} style={{width: '100px', height: '20px'}}>Go</button>
        <div>{ this.state.outputRhymes }</div>
      </main>
    )
  }
}
