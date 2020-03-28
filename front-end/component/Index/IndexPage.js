import React, { Component } from "react";
import PropTypes from "prop-types";

import SearchBar from "Components/Common/SearchBar";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class IndexPage extends Component {
  handleVisitCompany = () => {
    console.log(event.target.id);
  };
  handleVisitJob = () => {
    console.log(event.target.id);
  };
  render() {
    return (
      <Container>
        <br></br>
        <Row>
          <Col xs={3}></Col>
          <Col>
            <SearchBar />
          </Col>
          <Col xs={3}></Col>
        </Row>
        <br></br>
        <Row>
          <Col xs={1}></Col>
          <Col>
            <h3>Recent Companies</h3>
            {this.props.company_page.map(company => {
              return (
                <Card
                  style={{ width: "18rem", display: "inline-block" }}
                  key={company._id}
                >
                  <Card.Img variant="top" src="holder.js/100px180" />
                  <Card.Body>
                    <Card.Title>{company.name}</Card.Title>
                    <Card.Text>{company.description}</Card.Text>
                    <Button
                      variant="primary"
                      onClick={this.handleVisitCompany}
                      id={company._id}
                    >
                      {company.jobs.length} Jobs Available
                    </Button>
                  </Card.Body>
                </Card>
              );
            })}
            <br></br>
            <br></br>
            <h3>Recently Posted Jobs</h3>
            {this.props.job_page.map(job => {
              return (
                <Card
                  style={{ width: "18rem", display: "inline-block" }}
                  key={job._id}
                >
                  <Card.Img variant="top" src="holder.js/100px180" />
                  <Card.Body>
                    <Card.Title>{job.name}</Card.Title>
                    <Card.Text>{job.description}</Card.Text>
                    <Card.Text>{job.salary}</Card.Text>
                    <Button
                      variant="primary"
                      onClick={this.handleVisitJob}
                      id={job._id}
                    >
                      Learn More
                    </Button>
                  </Card.Body>
                </Card>
              );
            })}
          </Col>
          <Col xs={1}></Col>
        </Row>
      </Container>
    );
  }
}

IndexPage.propTypes = {
  company_page: PropTypes.array.isRequired,
  job_page: PropTypes.array.isRequired
};

export default IndexPage;
