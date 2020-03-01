import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Image from "react-bootstrap/Image"

class SingleJob extends Component {
    componentDidMount() {
    }
    render() {
        return (
            <div>
                <Container fluid>
                    <Row>
                        <Col xs={2}></Col>
                        <Col>
                            <Row className="bg-light">
                                <Col xs={4}>
                                    <Container className="position-relative">
                                        <Image src="https://cdn.itviec.com/employers/itviec-com-s-client/logo/social/21Hhw7GCbkU2ntEmjUHdmNn8/itviec-com-s-client-logo.jpg"></Image>
                                    </Container>
                                </Col>
                                <Col>
                                    <h1>{this.props.job.name}</h1>
                                    <Container>
                                        <p>Location: {this.props.job.location}</p>
                                        <p>Description: {this.props.job.description}</p>
                                        <p>Open Positions: {this.props.job.employees}</p>
                                        <p>Salary: {this.props.job.salary}</p>
                                        <p>Date: {this.props.job.date}</p>
                                    </Container>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={2}></Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

SingleJob.propTypes = {
    job: PropTypes.object.isRequired
}

export default SingleJob;