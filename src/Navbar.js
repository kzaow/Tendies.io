import React, { Component } from "react";
import "./Navbar.css";
import { Redirect } from "react-router-dom";
import moneyIcon from "./pics/money.png";
import csIcon from "./pics/cs.svg";
import timeIcon from "./pics/time.png";
import newsIcon from "./pics/news.svg";
import presentationIcon from "./pics/presentation.svg";
import stockIcon from "./pics/stock.png";
import earningIcon from "./pics/earning.svg";
import {
  Form,
  Navbar,
  Button,
  Nav,
  FormControl,
  FormGroup,
  NavItem,
  Modal,
  ProgressBar,
  Grid,
  Col,
  Row,
  Image,
  ListGroup,
  ListGroupItem
} from "react-bootstrap";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      userinput: "",
      AVinfo: [],
      IEXinfo: [],
      priceOfStock: [],
      logoImage: [],
      showModal: false,
      isLoading: false,
      redirect: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);

  }

  handleChange(event) {
    this.setState({
      userinput: event.target.value
    });
  }

  handleSubmit(event) {
    if (this.state.userinput === "") {
      event.preventDefault();
      return;
    }

    var i = this.state.userinput.toUpperCase();
    var AVurl =
      "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" +
      i +
      "&interval=5min&outputsize=full&apikey=RNLFUDCH5SIH5FZ4";
    var IEXcompany = "https://api.iextrading.com/1.0/stock/" + i + "/company";
    var IEXPrice = "https://api.iextrading.com/1.0/stock/" + i + "/price";
    var IEXLogo = "https://api.iextrading.com/1.0/stock/" + i + "/logo";
    console.log(AVurl);
    console.log(IEXcompany);

    event.preventDefault();
    this.setState({
      isLoading: true
    });

    var avRequest = fetch(AVurl).then(avResults => {
      return avResults.json();
    });

    var iexRequest = fetch(IEXcompany).then(iexResults => {
      console.log(iexResults);
      if (iexResults.status === 404) {
        return;
      } else {
        return iexResults.json();
      }
    });

    var priceIEX = fetch(IEXPrice).then(priceResult => {
      if (priceResult.status === 404) {
        return;
      } else {
        return priceResult.json();
      }
    });

    var logoIEX = fetch(IEXLogo).then(logoResult => {
      if (logoResult.status === 404) {
        return;
      } else {
        return logoResult.json();
      }
    });

    Promise.all([avRequest, iexRequest, priceIEX, logoIEX]).then(values => {
      this.setState({
        AVinfo: values[0],
        IEXinfo: values[1],
        priceOfStock: values[2],
        logoImage: values[3]
      });

      if (this.state.AVinfo.hasOwnProperty("Error Message")) {
        console.log("Error messages occured");
        this.setState({
          isLoading: false,
          userinput: "",
          showModal: true
        });
      } else {
        console.log("No Error Messages");
        this.setState({
          fieldEmpty: false,
          isLoading: false,
          redirect: true
        });
        this.props.returnJson(
          this.state.AVinfo,
          this.state.IEXinfo,
          this.state.priceOfStock,
          this.state.logoImage
        );
      }

      console.log(this.state.AVinfo);
      console.log(this.state.IEXinfo);
      console.log(this.state.priceOfStock);
      console.log(this.state.logoImage);
    });
  }

  handleClose() {
    console.log("close");
    this.setState({ showModal: false });
  }

  handleOpen() {
    console.log("Open");
    this.setState({ showModal: true });
  }

  render() {
    const modalStyle = {
      textAlign: "center"
    };


    return (
      <div>
          <Navbar fluid className="navbar">
            <Navbar.Header>
              <Navbar.Brand>
                <div className="logo">
                  <a href="/" className="moneyIcon">
                    {" "}
                    <img src={moneyIcon} alt="money" />{" "}
                  </a>
                  <a style={{color: 'white'}} href="/">Tendies</a>
                </div>
              </Navbar.Brand>
            </Navbar.Header>

            <Nav className="logIn">
              <NavItem eventKey={2} href="/">
                <Button style={{borderRadius:'2px', fontSize: '12px'}} bsStyle="primary">Log In</Button>
              </NavItem>
            </Nav>

            <h1 className="nav-title" style={{color: 'white'}}>Tendies finds everything for you:</h1>


            <Navbar.Form className="searchForm">
              <Form>
                <FormGroup>
                  <FormControl
                    type="text"
                    placeholder="Ticker Symbol"
                    value={this.state.userinput}
                    onChange={this.handleChange}
                    maxLength="5"
                    className="search-button"
                  />
                </FormGroup>
                <Button
                  className="search-button"
                  bsStyle="primary"
                  type="submit"
                  disabled={false}
                  onClick={!this.state.isLoading ? this.handleSubmit : null}
                >
                  {this.state.isLoading ? "Loading..." : "Search"}
                </Button>
              </Form>
            </Navbar.Form>
          </Navbar>

          {this.state.isLoading ? (
            <ProgressBar bsStyle="info" active now={100} />
          ) : null}

          <Modal
            show={this.state.showModal}
            onHide={this.handleClose}
            bsSize="small"
            animation={true}
            keyboard={true}
            className="modal"
          >
            <Modal.Header closeButton>
              <Modal.Title style={modalStyle}>{"Incorrect Ticker"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p style={modalStyle}>{"Please input a correct ticker"}</p>
            </Modal.Body>
          </Modal> 

        {this.state.redirect ? (
          <Redirect to='/graphs' />
        ) : null}

        <div>
      <Grid className="body">
          <h3 className="body-title">Tendies Features</h3>
        <Row className="show-grid1">
          <Col xs={6} md={4}>
              <Image className="bodyImg" src={stockIcon} responsive/>
              <h4>Intraday Stock Charts</h4>
              <p>Gives you the intraday data of the ticker you searched.</p>
          </Col>
          <Col xs={6} md={4}>
              <Image className="bodyImg" src={newsIcon} responsive/>
              <h4>Up to date stock news</h4>
              <p>Gives you the most recent and up to date news of the ticker you search. </p>
          </Col>
          <Col xsHidden md={4}>
            <Image className="bodyImg" src={presentationIcon} responsive/>
            <h4>Stock Information</h4>
            <p>Gives you information concering the ticker you search, such as sector, description, exchange, etc. </p>
          </Col>
        </Row>

        <Row className="show-grid2">
          <Col xs={6} md={4}>
              <Image className="bodyImg" src={earningIcon} responsive/>
              <h4>Printing Money</h4>
              <p>Your money will easily be turned into profits. </p>
          </Col>
          <Col xs={6} md={4}>
              <Image className="bodyImg" src={timeIcon} responsive/>
              <h4>Fast and accurate data</h4>
              <p>Any data recieved is from our API, which is trusted and approved.</p>
          </Col>
          <Col xsHidden md={4}>
            <Image className="bodyImg" src={csIcon} responsive/>
            <h4>Solve any of your questions</h4>
            <p> If you have any questions, you can feel free to contact us in the contact us link. </p>
          </Col>
        </Row>
      </Grid>
      </div>

      <div className="followUs">

      </div>

      <div className="footer">
    <Grid>
    <Row>
    <Col md={6} mdPush={6}>
    <h5 className="footer-aboutme">Contact Me</h5>
      <p style={{textAlign: 'left'}}>Kevin Zhou</p>
      <p style={{textAlign: 'left'}}>917-881-8428</p>
  </Col>
  <Col md={6} mdPull={6}>
  <h5 className="footer-title">About Tendies</h5>
  <ListGroup>
    <ListGroupItem>
      <a href="/">About</a>
    </ListGroupItem>
    <ListGroupItem>
      <a href="/">FAQ</a>
    </ListGroupItem>
    <ListGroupItem>
      <a href="/">Terms & Privacy</a>
    </ListGroupItem>
  </ListGroup>
</Col>
    </Row>
    </Grid>
    <p style={{textAlign: 'center'}}>Tendies © 2018</p>
    <div className="hideThis">Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a></div>

  </div>

      </div>
    );
  }
}

export default NavBar;
