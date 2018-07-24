import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css';
import './Navbar.css';
import NavBar from './Navbar.js';
import JsonGraph from './JsonGraph.js';

class App extends Component {

  constructor(){
    super();
    this.state = {
      showImage: true,
      jsonFromAV: [],
      jsonFromIEX: [],
      price: [],
      logo: []
    }

    this.getJson = this.getJson.bind(this);
  }

  getJson(dataFromAV, dataFromIEX, tickerPrice, logoPic){
    this.setState({
      jsonFromAV: dataFromAV,
      jsonFromIEX: dataFromIEX,
      price: tickerPrice,
      logo: logoPic,
      showImage: false
    });
  }

  render() {
    return (
        <Router>
          <div className="App">
            <Switch>
              <Route exact path="/" render={() => (
                  <NavBar returnJson={this.getJson}/>
              )}/>
            <Route exact path="/graphs" render={() => (
                  <JsonGraph AVData={this.state.jsonFromAV} IEXData={this.state.jsonFromIEX} priceData={this.state.price} logoData={this.state.logo} />
              )}/>
            </Switch>
          </div>
        </Router>
    );
  }
}

export default App;
