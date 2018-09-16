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
      jsonFromAV: [],
      jsonFromIEX: [],
      price: [],
      logo: [],
      news: [],
    }

    this.getJson = this.getJson.bind(this);
  }

  getJson(dataFromAV, dataFromIEX, tickerPrice, logoPic, newsFromIEX){
    this.setState({
      jsonFromAV: dataFromAV,
      jsonFromIEX: dataFromIEX,
      price: tickerPrice,
      logo: logoPic,
      news: newsFromIEX
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

              <Route exact path='/:ticker' render={() =>(
                  <JsonGraph AVData={this.state.jsonFromAV} IEXData={this.state.jsonFromIEX} priceData={this.state.price} logoData={this.state.logo} newsData={this.state.news}  />
              )}/>
            </Switch>
          </div>
        </Router>
    );
  }
}

export default App;
