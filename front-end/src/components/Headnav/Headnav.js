import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";

import {logoutProcess} from "../../actions/auth"

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

import LoginModals from "./Modals/LoginModals"

class Headnav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      register: false,
      login: false,
    };
  }

  handleClose = () => {
    this.setState(() => ({
      register: false,
      login: false,
    }));
  }

  handleLogOut = () => {
    this.props.logoutProcess(this.props.token)
  }

  render() {
    return (
      <div className="container-fluid" style={{ padding: 0 }}>
        <LoginModals show={this.state.login} handleClose={this.handleClose} />
        <Navbar bg="dark" expand="lg" variant="dark">
          <Link to="/">
            <Navbar.Brand> Job_Recruitment</Navbar.Brand>
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
            {this.props.token ? (
              <Nav>
                <Nav>
                  <Link className="nav-link" to="/profile">
                    Profile
                  </Link>
                </Nav>
                <Nav>
                  <Link onClick={this.handleLogOut} className="nav-link" to="/signout">
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

Headnav.propTypes = {
  token: PropTypes.string,
  logoutProcess: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    id: state.auth.id,
    email: state.auth.email,
    token: state.auth.token,
    username: state.auth.username,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { logoutProcess },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Headnav)
);
