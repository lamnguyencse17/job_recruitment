import React, { Component } from "react";
import Router from "next/router";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";

import Popup from "Components/Common/Popup";

import { loginProcess } from "Components/actions/auth";
import { getProfile } from "Components/actions/models/profile";
import { clearErrors } from "Components/actions/control/errors";

class LoginModal extends Component {
  constructor() {
    super();
    this.username = React.createRef();
    this.password = React.createRef();
  }

  handleLogin = async () => {
    if (this.props.popup) {
      this.props.clearErrors();
    }
    let result = await this.props.loginProcess(
      this.username.current.value,
      this.password.current.value
    );
    if (result) {
      this.props.handleClose();
      this.props.getProfile(result.id, result.token);
      Router.push("/");
      return;
    }
  };

  render() {
    return (
      <div>
        <Modal show={this.props.show}>
          <Popup />
          <Modal.Header>
            <Modal.Title>Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Username
            <InputGroup className="mb-3">
              <FormControl
                ref={this.username}
                aria-describedby="basic-addon1"
              />
            </InputGroup>
            Password
            <InputGroup className="mb-3">
              <FormControl
                type="password"
                ref={this.password}
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleLogin}>
              Login
            </Button>
            <Button variant="secondary" onClick={this.props.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

LoginModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  loginProcess: PropTypes.func.isRequired,
  getProfile: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  popup: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    popup: state.control.errors.show
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { loginProcess, getProfile, clearErrors },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
