import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Row, Col } from 'react-bootstrap';
import './DetailChart.css';

function DetailChart(props) {
    const [confirmData, setConfirmData] = useState({label:'', datasets:[]});
    const [deathData, setDeathData] = useState({label:'', datasets:[]});

    const chart = (cur_data) => {
        // without this if condition, when the app initially loads, cur_data is emtpy and this causes
        // an error in the function
        if (cur_data.length !== 0) {
            const country_list = ["China", "South Korea", "India", "France", "Italy", "United States", "Brazil"];
            const color_list = ["#c45850", "#8e5ea2", "#3cba9f", "#e8c3b9", "white", "#3e95cd", "grey"];
            var confirmed_data = {labels: [], datasets: []}; // accumulated confirmed data that will be graphed
            var death_data = {labels: [], datasets: []}; // accumulated death data that will be graphed
            var date_list = [];
            var date_index_map = {}; // maps current date to the index at which it was derived from

            // First compile labels since we need this data to sort data that doesn't have any info on a specific date
            for (var k = 0; k < cur_data[0].length; k++) {
                var date_cleansed = cur_data[0][k].datecase.split('T')[0];
                date_list.push(date_cleansed);
                date_index_map[date_cleansed] = k;

                var date_label = date_cleansed.split('-');
                confirmed_data.labels.push(date_label[1] + "-" + date_label[2]);
                death_data.labels.push(date_label[1] + "-" + date_label[2]);
            }

            for (var i = 0; i < cur_data.length; i++) {
                var cur_confirmed = {fill: false, borderColor: color_list[i], pointRadius: 0, borderWidth: 2, data: Array(date_list.length).fill(0), label: country_list[i]};
                var cur_death = {fill: false, borderColor: color_list[i], pointRadius: 0, borderWidth: 2, data: Array(date_list.length).fill(0), label: country_list[i]};
                for (var j = 0; j < cur_data[i].length; j++) {
                    // Compile other data
                    var date_preprocess = cur_data[i][j].datecase.split('T')[0];
                    // date_index_map ensures that if certain countries doesn't have data on that date, the data remains 0
                    cur_confirmed.data[date_index_map[date_preprocess]] = cur_data[i][j].confirmed;
                    cur_death.data[date_index_map[date_preprocess]] = cur_data[i][j].deaths;
                }
                confirmed_data.datasets.push(cur_confirmed);
                death_data.datasets.push(cur_death);
            }
            setConfirmData(confirmed_data);
            setDeathData(death_data);
        }
    }

    // update the data passed from parent component
    useEffect(() => {
        chart(props.detail);
    }, [props])

    return (
        <div>
            <Row className = "chartRow" md = {12}>
                <Col className= "line-chart">
                    <Line data = { confirmData } options = {{
                        maintainAspectRatio: false,
                        responsive: true,
                        title: {
                            display: true,
                            text: "Accumulated Confirmed",
                            fontSize: 20,
                            fontColor: "white",
                            padding: 20
                        },
                        legend: {
                            labels: {
                                fontColor: "white",
                                fontSize: 10
                            }
                        },
                        scales: {
                            yAxes: [
                                {
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Confirmed",
                                        fontColor: "white",
                                        fontSize: 15,
                                    },
                                    ticks: {
                                        beginAtZero: true,
                                        fontColor: "white",
                                        color: "white"
                                    },
                                    gridLines: {
                                        display: true,
                                        color: "#072308",
                                        zeroLineColor: "white"
                                    }
                                }
                            ],
                            xAxes: [
                                {
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Date",
                                        fontColor: "white",
                                        fontSize: 15,
                                        padding: 10 
                                    },
                                    ticks: {
                                        beginAtZero: true,
                                        fontColor: "white",
                                        maxTicksLimit: 15
                                    },
                                    gridLines: {
                                        display: true,
                                        color: "#072308",
                                        zeroLineColor: "white",
                                        zeroLineWidth: 1.5
                                    }
                                }
                            ]
                        }
                    }}/>
                </Col>
                <Col>
                <Line data = { deathData } options = {{
                        maintainAspectRatio: false,
                        responsive: true,
                        title: {
                            display: true,
                            text: "Accumulated Death",
                            fontSize: 20,
                            fontColor: "white",
                            padding: 20
                        },
                        legend: {
                            labels: {
                                fontColor: "white",
                                fontSize: 10
                            }
                        },
                        scales: {
                            yAxes: [
                                {
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Deaths",
                                        fontColor: "white",
                                        fontSize: 15 
                                    },
                                    ticks: {
                                        beginAtZero: true,
                                        fontColor: "white",
                                        color: "white"
                                    },
                                    gridLines: {
                                        display: true,
                                        color: "#072308",
                                        zeroLineColor: "white"
                                    }
                                }
                            ],
                            xAxes: [
                                {
                                    scaleLabel: {
                                        display: true,
                                        labelString: "Date",
                                        fontColor: "white",
                                        fontSize: 15,
                                        padding: 10 
                                    },
                                    ticks: {
                                        beginAtZero: true,
                                        fontColor: "white",
                                        maxTicksLimit: 15
                                    },
                                    gridLines: {
                                        display: true,
                                        color: "#072308",
                                        zeroLineColor: "white",
                                        zeroLineWidth: 1.5
                                    }
                                }
                            ]
                        }
                    }}/>
                </Col>
            </Row>
        </div>
    )
}

export default DetailChart