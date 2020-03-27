import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { connect } from "react-redux";

class Companies extends Component {
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
                        {this.props.companies.page.map(company => {
                            return (
                                <Card key={company._id} style={{ width: "100%" }}>
                                    <Card.Img variant="top" />
                                    <Card.Body>
                                        <Card.Title><Link href={`/company/${company._id}`}>
                                            <a className="nav-link">{company.name}</a>
                                        </Link></Card.Title>

                                        <Card.Text>{company.description}</Card.Text>
                                    </Card.Body>
                                </Card>
                            );
                        })}
                    </Col>
                    <Col></Col>
                </Row>
            </Container>) : <Container></Container>
        );
    }
}

Companies.propTypes = {
    companies: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        companies: state.companies
    };
}

export default connect(mapStateToProps, null)(Companies);