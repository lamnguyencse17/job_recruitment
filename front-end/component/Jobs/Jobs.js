import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { connect } from "react-redux";

class Jobs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mounted: false,
        };
    }
    componentDidMount() {
        this.setState({ ...this.state, mounted: true });
    }
    render() {
        return (this.state.mounted ?
            (<Container>
                <br></br>
                <Row>
                    <Col></Col>
                    <Col xs={8}>
                        <p>something goes here</p>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>) : <Container></Container>
        );
    }
}

Jobs.propTypes = {
  };

function mapStateToProps(state) {
    return {
        jobs: state.jobs
    };
}

export default connect(mapStateToProps, null)(Jobs);