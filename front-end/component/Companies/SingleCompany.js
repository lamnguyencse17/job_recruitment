import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import JobsFooter from './SingleCompany/JobsFooter';

class SingleCompany extends Component {
    render() {
        return (
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
                                <h1>{this.props.company.name}</h1>
                                <Container>
                                    <p>Location: {this.props.company.location}</p>
                                    <p>Description: {this.props.company.description}</p>
                                    <p>Size: {this.props.company.size}</p>
                                    <p>Email: {this.props.company.email}</p>
                                    <p>Phone: {this.props.company.phone}</p>
                                </Container>
                            </Col>
                        </Row>
                        <br></br>
                        <JobsFooter jobs={this.props.company.jobs}/>
                    </Col>
                    <Col xs={2}></Col>
                </Row>
            </Container>
        );
    }
}

SingleCompany.propTypes = {
    company: PropTypes.object.isRequired,
};

export default SingleCompany;