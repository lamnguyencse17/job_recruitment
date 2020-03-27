import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

class JobsFooter extends Component {
    constructor(){
        super()
        this.state = {
            col1 : [],
            col2 : [],
            col3 : []
        }
    }
    colDivide = () => {
        let col1 = [];
        let col2 = [];
        let col3 = [];
        this.props.jobs.map(job => {
            console.log(this.props.jobs.indexOf(job) % 3)
            if (this.props.jobs.indexOf(job) % 3 == 0) {
                col1.push(job);
            } else if (this.props.jobs.indexOf(job) % 3 == 1) {
                col2.push(job);
            } else if (this.props.jobs.indexOf(job) % 3 == 2) {
                col3.push(job);
            }
        });
        this.setState({col1: col1, col2: col2, col3: col3})
    };
    componentDidMount(){
        this.colDivide()
    }
    render() {
        return (
            <div>
                <h3>Jobs available goes here</h3>
                <Container>
                    <Row>
                        <Col>
                        {this.state.col1.map(job => {
                            return (
                                <Card style={{ width: '18rem' }} key= {job._id}>
                                <Card.Body>
                                    <Card.Title>{job.name}</Card.Title>
                                    <Card.Text>
                                        {job.description}</Card.Text>
                                    <Button variant="primary">Go somewhere</Button>
                                </Card.Body>
                            </Card>
                            )
                        })}
                            
                        </Col>
                        <Col>
                        {this.state.col2.map(job => {
                            return (
                                <Card style={{ width: '18rem' }} key= {job._id}>
                                <Card.Body>
                                    <Card.Title>{job.name}</Card.Title>
                                    <Card.Text>
                                        {job.description}</Card.Text>
                                    <Button variant="primary">Go somewhere</Button>
                                </Card.Body>
                            </Card>
                            )
                        })}
                        </Col>
                        <Col>
                        {this.state.col3.map(job => {
                            return (
                                <Card style={{ width: '18rem' }} key= {job._id}>
                                <Card.Body>
                                    <Card.Title>{job.name}</Card.Title>
                                    <Card.Text>
                                        {job.description}</Card.Text>
                                    <Button variant="primary">Go somewhere</Button>
                                </Card.Body>
                            </Card>
                            )
                        })}
                        </Col>
                    </Row>
                </Container>
            </div >
        );
    };
}

JobsFooter.propTypes = {
    jobs: PropTypes.array.isRequired
};

export default JobsFooter;