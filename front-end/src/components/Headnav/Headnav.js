import React, { Component } from "react";
import PropTypes from "prop-types";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, withRouter } from "react-router-dom";

import { logoutProcess } from "../../actions/auth";

import LoginModal from "./Modals/LoginModal";
import RegisterModal from "./Modals/RegisterModal";

class Headnav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      register: false,
      login: false,
    };
  }
  handleClose = () => {
    this.setState({
      register: false,
      login: false,
    });
  };

  handleLogOut = () => {
    this.props.logoutProcess(this.props.token);
  };

  render() {
    return (
      <div className="container-fluid" style={{ padding: 0 }}>
        <LoginModal show={this.state.login} handleClose={this.handleClose} />
        <RegisterModal show={this.state.register} handleClose={this.handleClose} />
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
                  <Link onClick={this.handleLogOut} className="nav-link" to="/logout">
                    Logout
                  </Link>
                </Nav>
              </Nav>
            ) : (
                <Nav>
                  <Nav
                    onClick={() => {
                      this.setState({
                        ...this.state,
                        register: true,
                      });
                    }}>
                    <Link className="nav-link" to="/signup">
                      Register Now
                  </Link>
                  </Nav>
                  <Nav href="#login" onClick={() => {
                    this.setState({
                      ...this.state, login: true,
                    });
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
};

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Headnav));
