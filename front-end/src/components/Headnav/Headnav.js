import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
  Redirect,
  withRouter,
} from "react-router-dom";

class Headnav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      register: false,
      login: false,
      email: "",
      password: "",
    };
  }
  handleClose() {
    this.setState(state => ({
      register: false,
      login: false,
    }));
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleSubmission() {
    if (this.state.register == true) {
      console.log("REGISTER")
    } else {
      console.log("LOGIN")
    }
    this.setState(state => ({
      register: false,
      login: false,
    }));
  }
  render() {
    return (
      <div className="container-fluid" style={{ padding: 0 }}>
        <Navbar bg="dark" expand="lg" variant="dark">
          <Link to="/">
            <Navbar.Brand> IT Source</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav>
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </Nav>
              <Nav>
                <Link className="nav-link" to="/jobs">
                  All Jobs
                </Link>
              </Nav>

              <Nav>
                <Link className="nav-link" to="/companies">
                  Companies
                </Link>
              </Nav>
              <Nav>
                <Link className="nav-link" to="/posts">
                  Posts
                </Link>
              </Nav>
            </Nav>
            <Modal
              show={this.state.register || this.state.login}
              onHide={this.handleClose.bind(this)}>
              <Modal.Header closeButton>
                {this.state.register ? (
                  <Modal.Title>Sign up </Modal.Title>
                ) : (
                    <Modal.Title>Login </Modal.Title>
                  )}
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId="formSignup">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      onChange={this.handleChange.bind(this)}
                    />
                    <Form.Text className="text-muted">
                      We will never share your email with anyone else
                    </Form.Text>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      onChange={this.handleChange.bind(this)}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={this.handleClose.bind(this)}>
                  Close
                </Button>
                {this.state.login ? (
                  <Link to="/">
                    <Button
                      variant="primary"
                      onClick={this.handleSubmission.bind(this)}>
                      Submit
                    </Button>
                  </Link>
                ) : (
                    <Button
                      variant="primary"
                      onClick={this.handleSubmission.bind(this)}>
                      Submit
                  </Button>
                  )}
              </Modal.Footer>
            </Modal>
            {this.props.login ? (
              <Nav>
                <Nav>
                  <Link className="nav-link" to="/profile">
                    Profile
                  </Link>
                </Nav>
                <Nav>
                  <Link className="nav-link" to="/signout">
                    Sign Out
                  </Link>
                </Nav>
              </Nav>
            ) : (
                <Nav>
                  <Nav
                    onClick={() => {
                      this.setState(state => ({
                        register: true,
                      }));
                    }}>
                    <Link className="nav-link" to="/signup">
                      Sign Up Now
                  </Link>
                  </Nav>
                  <Nav
                    href="#login"
                    onClick={() => {
                      this.setState(state => ({
                        login: true,
                      }));
                    }}>
                    <Link className="nav-link" to="/login">
                      Login
                  </Link>
                  </Nav>
                </Nav>
              )}
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

// function mapStateToProps(state) {
//   return {
//     email: state.account.email,
//     token: state.account.token,
//     login: state.control.login,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     { registerProcess, loginProcess, displayHome, displayJobs },
//     dispatch
//   );
// }

export default withRouter(Headnav);

// export default withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(Headnav)
// );
