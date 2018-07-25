import React, { Component } from "react";
import "./JsonGraph.css";
import { Line } from "react-chartjs-2";
import { Image, Grid, Col, Row } from "react-bootstrap";

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
    this.parseIEXData(props.IEXData, props.priceData, props.logoData);
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

      var o = [];
      var c = [];
      var h = [];
      var l = [];
      var v = [];
      var t = [];

      var i = Object.keys(AVData["Time Series (5min)"]);
      console.log(i);
      // Hardcode the amount of 5 minutes intervals from 9:30AM to 4:00PM
      for (var x = 0; x < 79; x++) {
        o[x] = AVData["Time Series (5min)"][i[x]]["1. open"];
        c[x] = AVData["Time Series (5min)"][i[x]]["4. close"];
        h[x] = AVData["Time Series (5min)"][i[x]]["2. high"];
        l[x] = AVData["Time Series (5min)"][i[x]]["3. low"];
        v[x] = AVData["Time Series (5min)"][i[x]]["5. volume"];
        t[x] = i[x].substring(11, 16);
      }

      // Convert military time to standard time
      var newT = t.map(function(val) {
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

  parseIEXData(IEXData, priceData, logoData) {
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
      ];
    }
  }

  componentWillReceiveProps(newProps) {
    if (
      this.props.AVData !== newProps.AVData &&
      newProps.AVData.hasOwnProperty("Meta Data")
    ) {
      var timeSeries = this.parseAVData(newProps.AVData);
      var chart_data = {
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
      var chart_volume = {
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
      var IEX = this.parseIEXData(newProps.IEXData, newProps.priceData, newProps.logoData);

      // Add .00 to the price if its a whole number
      if((parseFloat(IEX[9]) % 1) == 0){
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
        logo: IEX[10]
      });
    } else {
      return;
    }
  }

  static defaultProps = {
    displayTitle: true
  }

  render() {
    return (
      <div>
      <div style={{position: "relative"}}>
        <div className="nameLogo">
          {/**{this.state.showChart ? <Image src={this.state.logo} responsive thumbnail /> : null}{" "} **/}
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
          <Col md={6} md={9}>
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
        <Col md={6} md={3}>
          {this.state.showChart ? <h5>Profile</h5> : null}
          {this.state.description.length > 0 && <div style={{fontSize: "14px", borderRadius: "1"}}>{this.state.description}<br></br></div>}
          {this.state.ceo.length > 0 && <div style={{fontSize: "14px"}}> <strong>CEO:</strong> {this.state.ceo}<br></br></div>}
          {this.state.exchange.length > 0 && <div style={{fontSize: "14px"}}> <strong>Exchange:</strong> {this.state.exchange}<br></br></div>}
          {this.state.sector.length > 0 && <div style={{fontSize: "14px"}}> <strong>Sector:</strong> {this.state.sector}<br></br></div>}
          {this.state.industry.length > 0 && <div style={{fontSize: "14px"}}> <strong>Industry:</strong> {this.state.industry}<br></br></div>}
          {this.state.issueType.length > 0 && <div style={{fontSize: "14px"}}> <strong>Issue Type:</strong> {this.state.issueType}<br></br></div>}
        </Col>
          </Row>
          </Grid>

          <Grid container-fluid="true">
          <Row>
          <Col md={6} md={9}>
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
        <Col md={6} md={3}>
          {this.state.showChart ? <h5>Website</h5> : null}
          {this.state.website.length > 0 && <div style={{fontSize: "14px", color: 'blue'}}><a href={this.state.website}  target="_blank">{this.state.website}</a><br></br></div>}
          {this.state.showChart ? <Image src={this.state.logo} responsive thumbnail className="logoPic"/> : null}
        </Col>
          </Row>
          </Grid>

    {/**  <div className="chartSize">
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
        {this.state.showChart ? (
          <Line
            data={this.state.chartVolume}
            options={{
              title: {
                display: this.props.displayTitle,
                text: this.state.symbol + " Volume",
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
      </div>**/}
      </div>
    );
  }
}

export default JsonGraph;
