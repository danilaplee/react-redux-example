import React, { Component } from 'react';
import { createStore } from 'redux';
import models from './models/form';
import Quiz from './views/quiz'
import logo from './logo.svg';
import {checkIt, submitIt} from './api'
import './App.css';



const api = {
  checkIt:checkIt,
  submitIt:submitIt
}

const store       = createStore(models)

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React-Redux <br /> Quiz Form</h1>
        </header>
          <Quiz store={store} api={api} />
      </div>
    );
  }
}

export default App;
