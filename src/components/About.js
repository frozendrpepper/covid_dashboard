import React from 'react';
import { Jumbotron, Row, Col, ListGroup } from 'react-bootstrap';
import './About.css';

function About() {
    return (
        <Jumbotron fluid style={{backgroundColor: "black", paddingLeft: 20}}>
            <h1 className="about-text">About COVID-19 Dashboard Project</h1>
            <h3 className="about-text" style={{paddingTop: 20, paddingBottom: 20}}>Author: Charlie Kang</h3>
            <ListGroup variant="flush">
                <ListGroup.Item style={{backgroundColor: "black"}}>
                    <h4 className="about-text">Quick Summary</h4>
                    <p className="about-text">
                        A COVID-19 dashbaord based on Kaggle's COVID dataset. Constructed using full MERN stack with Mysql as additional
                        database and Apache Spark for preprocessing and aggregating the dataset.
                    </p>
                </ListGroup.Item>
                <ListGroup.Item style={{backgroundColor: "black"}}>
                    <h4 className="about-text">Instruction</h4>
                    <ul>
                        <li className="about-text">The map section will display aggregated total number of confirmed, death and recovered 
                        cases in red text and display pins with varying color and size on the map based on daily 
                        confirmed cases for each country (Non-aggregated). <br/>You can click on the pin to display
                        a pop-up window with more details and click again or press ESC to hide pop-up window.</li>
                        <li className="about-text">Toggle to Chart section to see two charts, each displaying aggregated confirmed and death cases, for
                        selected countries.</li>
                        <li className="about-text">On initial data submit, there may be some lag before
                        the Node.js server "wakes up" and processes the data. Give it just a few seconds and it 
                        will work properly.</li>
                    </ul>
                </ListGroup.Item>
                <ListGroup.Item style={{backgroundColor: "black"}}>
                    <h4 className="about-text">Technology used: </h4>
                    <p className="about-text">React.js, Node.js, Apache Spark, Mysql, MongoDB, React-MapGL, React-Chart.js</p>
                </ListGroup.Item>
                <ListGroup.Item style={{backgroundColor: "black"}}><h4 className="about-text">Dataset</h4><a href="https://www.kaggle.com/sudalairajkumar/novel-corona-virus-2019-dataset">Kaggle COVID-19 Dataset</a></ListGroup.Item>
                <ListGroup.Item style={{backgroundColor: "black"}}><h4 className="about-text">Contact Info</h4><p className="about-text">changkik@usc.edu</p></ListGroup.Item>
            </ListGroup>
        </Jumbotron>
    )
}

export default About
