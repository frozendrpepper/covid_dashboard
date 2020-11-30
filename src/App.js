import React, { useState, useEffect } from 'react';
import './App.css';
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import ControlPanel from './components/controlPanel.js';
import InputForm from './components/InputForm.js';
import DetailChart from './components/DetailChart.js';
import About from './components/About.js';
import { Container, Row, Col, Nav, Navbar, Button, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route, Link } from 'react-router-dom';

// The ICON design is largely derived from react-map-gl's examples
// https://visgl.github.io/react-map-gl/examples/controls
const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

function App() {
  const API_TOKEN = `${process.env.REACT_APP_API_KEY}`;
  // State setting for the initial viewport
  const [viewport, setViewport] = useState(
    {
      latitude: 20.511893,
      longitude: 12.286168,
      width: "100vw",
      height: "80vh",
      zoom: 1.75,
    }
  )
  const [curDate, setCurDate] = useState({id: '', date:'', updated:false});
  // mysql_result = accumulated data by date/country, mysql_result_pre = actual daily data by date/country, acc_result = data from mongodb
  const [mapData, setMapData] = useState({mysql_result_pre: [], mysql_result: [], acc_result: []});
  const [textColor, setTextcolor] = useState({myvisibility:"hidden"});
  // State hook used for drawing pin and detail window
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // This useeffect allows using ESC to hide currently popped detail window
    const listener = (e) => {
      if (e.key === "Escape") {
        setSelectedCountry(null);
      }
    };
    window.addEventListener("keydown", listener);

    // Following removes the listener when the app.js is done rendering
    return () => {
      window.removeEventListener("keydown", listener);
    }
  }, []);

  const updateDateHandler = (newData) => {
    // The setCurDate updates curDate asynchronously. So if you want to perform next action
    // with the new data, needs to be done inside setCurDate
    setCurDate((prevDate) => {
      callAPI(newData);
      return newData;
    });
  }

  const getColor = (data) => {
    // Color selecting function for the Marker
    if (data.confirmed < 50) {
      return "#ffffff"; // white
    } else if (data.confirmed < 100) {
      return "#00F9FF"; // teal
    } else if (data.confirmed < 500) {
      return "#4287f5"; // light blue
    } else if (data.confirmed < 1000) {
      return "#7754F2"; // light purple
    } else if (data.confirmed < 5000) {
      return "orange";
    } else {
      return "red";
    }
  }

  const getSize = (data) => {
    // Size selecting function for the Marker
    if (data.confirmed < 50) {
      return 13;
    } else if (data.confirmed < 100) {
      return 15;
    } else if (data.confirmed < 500) {
      return 17;
    } else if (data.confirmed < 1000) {
      return 20;
    } else if (data.confirmed < 5000) {
      return 23;
    } else {
      return 26;
    }
  }

  const callAPI = (curDate) => {
    // Makes API call to the Node.js backend
    setIsLoading(true);
    setTextcolor({myvisibility:"hidden"});
    const url = process.env.REACT_APP_BACKEND_URL + `/${curDate.date}`;
    fetch(url).then(response => response.json()).then(data => {
      // need to parse data. Result from MongoDB contains the accumulated data by date
      // and the result from MySQL contains data accumulated by each region and by each date
      setSelectedCountry(null);
      setMapData((prevData) => {
        setIsLoading(false);
        setTextcolor({myvisibility:"visible"});
        return data;
      });
    });
  }

  return (
      <Container fluid>
        <Router>
          <Navbar bg="primary" variant="dark">
            <Navbar.Brand>Covid-19 Dashboard</Navbar.Brand>
            <Nav className="mr-auto">
              <Link to="/"><Button variant="primary" style = {{width: '110%'}}>Dashboard</Button></Link>
              <Link to="about"><Button variant="primary" style = {{width: '110%'}}>About</Button></Link>
            </Nav>
          </Navbar>
          
          <InputForm getDate = {updateDateHandler}/>
          <Row className="justify-content-md-center">
            <Col md="auto" lg="auto">
            {(() => {
              if (isLoading) {
                return (
                  <ProgressBar animated now={50} />
                )
              }
            })()}
              <pre className="info pb-2" style={{visibility:textColor.myvisibility, color: "red", marginTop: "15px", marginBottom: "0"}}>Date: {curDate.date}    Confirmed: {parseInt(mapData.acc_result.confirmed).toLocaleString()}    Death: {parseInt(mapData.acc_result.death).toLocaleString()}    Recovered: {parseInt(mapData.acc_result.recovered).toLocaleString()}</pre>
            </Col>
          </Row>

          <Route exact path="/" render = {props => (
            <React.Fragment>
              <Row>
                <Col md="auto" lg="auto">
                  <ReactMapGL 
                    {...viewport} 
                    className="map-element"
                    mapboxApiAccessToken={API_TOKEN}
                    onViewportChange={(viewport) => {setViewport(viewport);}}
                    mapStyle="mapbox://styles/cck3/ckgbnmq824fwb19o6po9wlb32">
                    {mapData.mysql_result_pre.map(data => (
                      <Marker key={data.country} latitude={data.latitude} longitude={data.longitude}>
                        <svg
                          height = {getSize(data)}
                          viewBox="0 0 24 24"
                          style = {{
                            cursor: 'pointer',
                            fill: getColor(data)
                          }}
                          onClick = {e => {
                            e.preventDefault();
                            setSelectedCountry(data);
                          }}
                        >
                          <path d={ICON} />
                        </svg>
                      </Marker>
                    ))}
      
                    { // This logic is for the pop up
                    selectedCountry ? (
                        <Popup 
                          id = "country-popup"
                          latitude = {selectedCountry.latitude} 
                          longitude = {selectedCountry.longitude}
                          onClose = {() => {
                            setSelectedCountry(null);
                          }} 
                          closeOnClick= { true }
                          anchor="bottom-right">
                          <div style = {{width: "330px", textAlign: "left", fontFamily: "'Times New Roman', Times, serif"}}>
                            <h2 style = {{color: getColor(selectedCountry)}}>{selectedCountry.country}</h2>
                            <p style = {{color: "white"}}>Confirmed: {parseInt(selectedCountry.confirmed).toLocaleString()}</p>
                            <p style = {{color: "white"}}>Deaths: {parseInt(selectedCountry.deaths).toLocaleString()}</p>
                            <p style = {{color: "white"}}>Recovered: {parseInt(selectedCountry.recovered).toLocaleString()}</p>
                          </div>
                        </Popup>
                      ) : null}
                    <ControlPanel />
                  </ReactMapGL>
                </Col>
              </Row>
            </React.Fragment>
          )}/>

          <Route exact path="/charts" render = {props => (
            <React.Fragment>
              <DetailChart detail = {mapData['mysql_result'].slice(2)}/>
            </React.Fragment>
          )} />

          <Route exact path="/about" render = {props => (
            <React.Fragment>
              <About />
            </React.Fragment>
          )}>
          </Route>

        </Router>

      </Container>
  );
}

export default App;