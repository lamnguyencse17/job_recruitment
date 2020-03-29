import React, { Component } from "react";
import PropTypes from "prop-types";
import Router from "next/router";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

import { registerProcess } from "Components/actions/auth";
import { clearErrors } from "Components/actions/control/errors";

class RegisterModal extends Component {
  constructor() {
    super();
    this.state = {
      role: ""
    };
    this.username = React.createRef();
    this.password = React.createRef();
  }
  roleSelect = role => {
    this.setState({ ...this.state, role: role });
  };
  handleRegister = async () => {
    if (this.props.popup) {
      this.props.clearErrors();
    }
    this.props.handleClose();
    let result = await this.props.registerProcess(
      this.username.current.value,
      this.password.current.value,
      this.state.role
    );
    if (result) {
      Router.push("/profile");
      return;
    }
  };

  render() {
    return (
      <div>
        <Modal show={this.props.show}>
          <Modal.Header>
            <Modal.Title>Register</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Username
            <InputGroup className="mb-3">
              <FormControl
                ref={this.username}
                aria-describedby="basic-addon1"
              />
              <DropdownButton
                as={InputGroup.Append}
                variant="outline-secondary"
                title="Register as"
                id="input-group-dropdown-2"
              >
                <Dropdown.Item
                  onSelect={() => {
                    this.roleSelect(1);
                  }}
                >
                  An Employee
                </Dropdown.Item>
                <Dropdown.Item
                  onSelect={() => {
                    this.roleSelect(2);
                  }}
                >
                  A Recruiter
                </Dropdown.Item>
              </DropdownButton>
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
            <Button variant="primary" onClick={this.handleRegister}>
              Register
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

RegisterModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  registerProcess: PropTypes.func.isRequired,
  history: PropTypes.object,
  popup: PropTypes.bool.isRequired,
  clearErrors: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    popup: state.errors.show
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ registerProcess, clearErrors }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterModal);
