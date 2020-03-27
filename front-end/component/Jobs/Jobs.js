import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";

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

    handleApply = (id) => {
        console.log(id)
    }

    render() {
        return (this.state.mounted ?
            (<Container>
                <br></br>
                <Row>
                    <Col></Col>
                    <Col xs={8}>
                        {this.props.jobs.page.map(job => {
                            return (
                                <Card key={job._id} style={{ width: "100%" }}>
                                    <Card.Img variant="top" />
                                    <Card.Body>
                                        <Card.Title>
                                            <Link href={`/job/${job._id}`}>
                                                <a className="nav-link">{job.name}</a>
                                            </Link>
                                        </Card.Title>
                                        <Card.Text>{job.description} - {job.salary} </Card.Text>
                                        <Card.Text>Open Positions: {job.employees} </Card.Text>
                                        <Card.Text>{job.date}</Card.Text>
                                            <Button variant="primary" onClick={() => this.handleApply(job._id)}>Apply Now</Button>
                                    </Card.Body>
                                </Card>);
                        })}
                    </Col>
                    <Col></Col>
                </Row>
            </Container>) : <Container></Container>
        );
    }
}

Jobs.propTypes = {
    jobs: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        jobs: state.jobs
    };
}

export default connect(mapStateToProps, null)(Jobs);