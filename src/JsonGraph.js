import React, { Component } from "react";
import "./JsonGraph.css";
import { Line } from "react-chartjs-2";
import { Image, Grid, Col, Row, ListGroup, ListGroupItem } from "react-bootstrap";
import { Redirect } from 'react-router-dom'

class JsonGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showChart: false,
      symbol: "",
      companyName: "",
      ceo: "",
      exchange: "",
      industry: "",
      issueType: "",
      website: "",
      description: "",
      sector: "",
      price: "",
      logo: "",
      date: "",
      chartData: {},
      chartVolume: {},
    };
    this.parseAVData(props.AVData);
    this.parseIEXData(props.IEXData, props.priceData, props.logoData, props.newsData);
  }

  parseAVData(AVData) {
    console.log("Length of AVData: " + AVData.length);

    if (AVData.length === 0) {
      console.log("You have no AV data");
      return;
    } else if (
      AVData.length === undefined &&
      AVData.hasOwnProperty("{Error Message")
    ) {
      console.log("You have error data");
      return;
    } else if (
      AVData.length === undefined &&
      AVData.hasOwnProperty("Meta Data")
    ) {
      console.log("You have AV data");

      let o = [];
      let c = [];
      let h = [];
      let l = [];
      let v = [];
      let t = [];

      let i = Object.keys(AVData["Time Series (5min)"]);
      console.log(i);
      // Hardcode the amount of 5 minutes intervals from 9:30AM to 4:00PM
      for (let x = 0; x < 79; x++) {
        o[x] = AVData["Time Series (5min)"][i[x]]["1. open"];
        c[x] = AVData["Time Series (5min)"][i[x]]["4. close"];
        h[x] = AVData["Time Series (5min)"][i[x]]["2. high"];
        l[x] = AVData["Time Series (5min)"][i[x]]["3. low"];
        v[x] = AVData["Time Series (5min)"][i[x]]["5. volume"];
        t[x] = i[x].substring(11, 16);
      }

      // Convert military time to standard time
      let newT = t.map(function(val) {
        if (parseInt(val.substring(0, 2), 10) > 12) {
          let standardTime = parseInt(val.substring(0, 2), 10) - 12;
          return standardTime.toString() + val.substring(2, 5);
        } else {
          return val;
        }
      });

      return [
        o.reverse(),
        c.reverse(),
        h.reverse(),
        l.reverse(),
        v.reverse(),
        newT.reverse(),
        AVData["Meta Data"]["3. Last Refreshed"]
      ];
    }
  }

  parseIEXData(IEXData, priceData, logoData, newsData) {
    if (IEXData.length === 0) {
      console.log("You have no IEX data");
      return;
    } else if (
      IEXData.length === undefined &&
      IEXData.hasOwnProperty("unknown symbol")
    ) {
      console.log("You have error data");
      return;
    } else if (
      IEXData.length === undefined &&
      !IEXData.hasOwnProperty("unknown symbol")
    ) {
      console.log("You have IEX data");

      let newsUrl = [];
      let newsDate = [];
      let newsHead = [];
      let newsSource = [];
      let newNewsDate = [];

      for(let x = 0; x < newsData.length; x++){
        newsUrl[x] = newsData[x].url;
        newsDate[x] = newsData[x].datetime.split('-');
        newsHead[x] = newsData[x].headline;
        newsSource[x] = newsData[x].source;
      }

      //Format newsDate
      for(let i = 0; i < newsDate.length; i++){
      newNewsDate[i] = newsDate[0][1] +"/"+ newsDate[0][2].substr(0,2) +"/"+ newsDate[0][0];
      console.log(newsDate[0][1] +"/"+ newsDate[0][2].substr(0,2) +"/"+ newsDate[0][0]);
      }

      return [
        IEXData.symbol,
        IEXData.companyName,
        IEXData.CEO,
        IEXData.exchange,
        IEXData.industry,
        IEXData.issueType,
        IEXData.website,
        IEXData.description,
        IEXData.sector,
        priceData,
        logoData.url,
        newsUrl,
        newNewsDate,
        newsHead,
        newsSource
      ];
    }
  }

  componentWillReceiveProps(newProps) {
    if (
      this.props.AVData !== newProps.AVData &&
      newProps.AVData.hasOwnProperty("Meta Data")
    ) {
      const timeSeries = this.parseAVData(newProps.AVData);
      let chart_data = {
        labels: timeSeries[5],
        datasets: [
          {
            label: "Open",
            data: timeSeries[0],
            fill: false,
            type: "line",
            borderColor: "#EF476F",
            backgroundColor: "#EF476F",
            pointRadius: 0
          },
          {
            label: "Close",
            data: timeSeries[1],
            fill: false,
            type: "line",
            borderColor: "#FFD166",
            backgroundColor: "#FFD166",
            pointRadius: 0
          },
          {
            label: "High",
            data: timeSeries[2],
            fill: false,
            type: "line",
            borderColor: "#06D6A0",
            backgroundColor: "#06D6A0",
            pointRadius: 0
          },
          {
            label: "Low",
            data: timeSeries[3],
            fill: false,
            type: "line",
            borderColor: "#118AB2",
            backgroundColor: "#118AB2",
            pointRadius: 0
          }
        ]
      };
      let chart_volume = {
        labels: timeSeries[5],
        datasets: [
          {
            label: "Volume",
            data: timeSeries[4],
            fill: true,
            type: "line",
            borderColor: "#073B4C",
            backgroundColor: "#073B4C",
            pointRadius: 0
          }
        ]
      };

      this.setState(
        {
          showChart: true,
          chartData: chart_data,
          chartVolume: chart_volume,
          date: timeSeries[6]
        },
        function() {
          console.log(timeSeries[5]);
        }
      );
    } else {
      return;
    }

    if (this.props.IEXData !== newProps.IEXData) {
      const IEX = this.parseIEXData(newProps.IEXData, newProps.priceData, newProps.logoData, newProps.newsData);

      // Add .00 to the price if its a whole number
      if((parseFloat(IEX[9]) % 1) === 0){
        IEX[9] = parseFloat(IEX[9]).toFixed(2);
      }

      this.setState({
        symbol: IEX[0],
        companyName: IEX[1],
        ceo: IEX[2],
        exchange: IEX[3],
        industry: IEX[4],
        issueType: IEX[5],
        website: IEX[6],
        description: IEX[7],
        sector: IEX[8],
        price: IEX[9],
        logo: IEX[10],
        newsUrl: IEX[11],
        newNewsDate: IEX[12],
        newsHeadLine: IEX[13],
        newsSource: IEX[14]
      },
      function() {
        console.log(this.state.newsUrl);
        console.log(this.state.newsDate);
        console.log(this.state.newsHeadLine);
        console.log(this.state.newsSource);
      }
    );
    } else {
      return;
    }
  }

  static defaultProps = {
    displayTitle: true
  }

  render() {
    return (
      <React.Fragment>

      <div style={{position: "relative"}}>
        <div className="nameLogo">
          {this.state.showChart ? this.state.companyName : null}
          <span style={{fontWeight: "400"}}>{this.state.showChart ? " (" + this.state.symbol + ")" : null}</span>
        </div>

        <div className="price">
          {this.state.showChart ? this.state.price : null}
          <span style={{fontSize: "12px", fontWeight: "400"}}>{this.state.showChart ? " As of " + this.state.date : null}</span>
        </div>
        </div>

          <Grid container-fluid="true">
          <Row>
          <Col md={8}>
          {this.state.showChart ? (
            <Line
              data={this.state.chartData}
              options={{
                responsive: true,
                tooltips: {
                  mode: 'index',
                  intersect: false,
                  titleFontSize: 16,
                  bodyFontSize: 16
                },
                hover: {
                  mode: 'nearest',
                  intersect: true
                },
                scales: {
                  xAxes: [{
                    display: true,
                    scaleLabel: {
                    display: true,
                    labelString: 'Time'
                    }
                  }],
                  yAxes: [{
                    display: true
                  }]
                },
                layout: {
                  padding: {
                    left: 25,
                    right: 25,
                    bottom: 25
                  }
                }
              }}
            />
          ) : null}
          </Col>
        <Col md={4}>
          {this.state.showChart ? <h5>Profile</h5> : null}
          {this.state.website.length > 0 && this.state.showChart && <div style={{float: 'left'}}><a href={this.state.website}  target="_blank"><Image src={this.state.logo} responsive thumbnail className="logoPic"/></a></div>}
          {this.state.description.length > 0 && <div style={{fontSize: "14px", textAlign: 'left'}}>{this.state.description}</div>}
          {this.state.ceo.length > 0 && <div style={{fontSize: "14px", float: 'left'}}> <strong>CEO:</strong> {this.state.ceo}</div>}
          <br></br>
          {this.state.exchange.length > 0 && <div style={{fontSize: "14px" , float: 'left'}}> <strong>Exchange:</strong> {this.state.exchange}</div>}
          <br></br>
          {this.state.sector.length > 0 && <div style={{fontSize: "14px", float: 'left'}}> <strong>Sector:</strong> {this.state.sector}</div>}
          <br></br>
          {this.state.industry.length > 0 && <div style={{fontSize: "14px", float: 'left'}}> <strong>Industry:</strong> {this.state.industry}</div>}
          <br></br>
          {this.state.issueType.length > 0 && <div style={{fontSize: "14px", float: 'left'}}> <strong>Issue Type:</strong> {this.state.issueType}</div>}

        </Col>
          </Row>
          </Grid>

          <Grid container-fluid="true">
          <Row>
          <Col md={8}>
          {this.state.showChart ? (
            <Line
              data={this.state.chartVolume}
              options={{
                title: {
                  display: this.props.displayTitle,
                  text: " Volume",
                  fontSize: 25
                },
                tooltips: {
                  mode: 'index',
                  intersect: false,
                  titleFontSize: 16,
                  bodyFontSize: 16,
                },
                hover: {
                  mode: 'nearest',
                  intersect: true
                },
                layout: {
                  padding: {
                    left: 25,
                    right: 25,
                  }
                },
                scales: {
                  xAxes: [{
                    display: true,
                    scaleLabel: {
                    display: true,
                    labelString: 'Time'
                    }
                  }]
                }
              }}
            />
          ) : null}
          </Col>
        <Col md={4}>
          {this.state.showChart ? <h5>Recent News</h5> : null}
          <ListGroup>
          {this.state.showChart ? this.state.newsUrl.map((articles, index) =>
            <a href={articles} target="_blank">
            <ListGroupItem style={{fontSize: "14px", color: 'blue', textAlign: 'left'}} header={this.state.newsSource[index] +" "+ this.state.newNewsDate[index]} >{this.state.newsHeadLine[index]}</ListGroupItem>
            </a>
            ) : null}
          </ListGroup>
        </Col>
          </Row>
          </Grid>
      </React.Fragment>
    );
  }
}

export default JsonGraph;
