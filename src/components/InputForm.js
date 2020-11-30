import React, { useState } from 'react';
import './inputForm.css';
import { Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function InputForm(props) {
    const [enteredDate, setDate] = useState('');
    const [inputValue, setInput] = useState("2020-01-22"); // This property is used to update input value of date

    const submitHandler = (event) => {
        // Makes sure the form does not perform its default behavior
        event.preventDefault({});

        const newDate = {id: Math.random().toString(), date:enteredDate, updated:true}
        // the getDate represents updateDateHandler in the app compoonent
        props.getDate(newDate);
    };

    const dateChangeHandler = (event) => {
        // This function is called upon onChange event on date input and set the State enteredDate to
        // currently selected date such that proper date can be updated upon submission
        setDate(event.target.value);
        setInput(event.target.value);
    };

    return (
        <div>
            <Form onSubmit={submitHandler} className="pt-3">
                <Form.Group>
                    <Row>
                        <Col md={{span:4, offset:2}} lg={{span:4, offset:2}}>
                            <Form.Label>Enter a date</Form.Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={{span:3, offset:2}} lg={{span:4, offset:2}}>
                            <Form.Control type="date" value = {inputValue} min="2020-01-22" max="2020-09-23" onChange = {dateChangeHandler}></Form.Control>
                        </Col>
                        <Col md={2}>
                            <Button variant="outline-info" type="submit">Select Date</Button>
                        </Col>
                        <Col md={1}>
                            <Link to="/"><Button variant="primary" style = {{width: '110%'}}>Map</Button></Link>
                        </Col>
                        <Col md={1}>
                            <Link to="/charts"><Button variant="primary" style = {{width: '110%'}}>Chart</Button></Link>
                        </Col>
                    </Row>
                </Form.Group>
            </Form>
        </div>
    )
}

export default InputForm;