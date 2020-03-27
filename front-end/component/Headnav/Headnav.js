import React, { Component } from "react";
import PropTypes from "prop-types";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import Link from 'next/link';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { logoutProcess } from "../actions/auth";

import LoginModal from "./Modals/LoginModal";
import RegisterModal from "./Modals/RegisterModal";
import Router from "next/router";

class Headnav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
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
    Router.push("/")
  };

  componentDidMount(){
    this.setState({...this.state, mounted: true})
  }

  render() {
    return (this.state.mounted ? (
      <div className="container-fluid" style={{ padding: 0 }}>
        <LoginModal show={this.state.login} handleClose={this.handleClose} />
        <RegisterModal show={this.state.register} handleClose={this.handleClose} />
        <Navbar bg="dark" expand="lg" variant="dark">
          <Link href="/">
            <Navbar.Brand> Job_Recruitment</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav>
                <Link href="/">
                <a className="nav-link">Home</a>
                </Link>
              </Nav>
              <Nav>
                <Link href="/job/p/1">
                <a className="nav-link">All Jobs</a>
                </Link>
              </Nav>

              <Nav>
                <Link href="/company/p/1">
                <a className="nav-link">Companies</a>
                </Link>
              </Nav>
              <Nav>
                <Link href="/posts">
                <a className="nav-link">Posts</a>
                </Link>
              </Nav>
            </Nav>
            {this.props.token != "" ? (
              <Nav>
                <Nav>
                  <Link href="/profile">
                  <a className="nav-link">Profile</a>
                  </Link>
                </Nav>
                <Nav onClick={this.handleLogOut}>
                  <a  className="nav-link">Logout</a>
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
                      <a className="nav-link">Register Now</a>
                  </Nav>
                  <Nav onClick={() => {
                    this.setState({
                      ...this.state, login: true,
                    });
                  }}>
                    <a className="nav-link">Login</a>
                  </Nav>
                </Nav>
              )}
          </Navbar.Collapse>
        </Navbar>
      </div>) : <div></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Headnav)
