import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { registerProcess } from "../../../actions/auth";
import {
    withRouter,
  } from "react-router-dom";

import PropTypes from 'prop-types';

class RegisterModal extends Component {
    constructor() {
        super()
        this.state = {
            role: ""
        }
        this.username = React.createRef();
        this.password = React.createRef();
    }
    roleSelect = (role) => {
        this.setState({...this.state, role: role})
    }
    handleRegister = () => {
        this.props.handleClose()    
        this.props.registerProcess(this.username.current.value, this.password.current.value, this.state.role)
        this.props.history.push('/profile')
    }

    render() {
        return (
            <div>
                <Modal show={this.props.show}>
                    <Modal.Header>
                        <Modal.Title>Register</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Username</InputGroup.Text>
                        </InputGroup.Prepend>
                        <InputGroup className="mb-3">
                            <FormControl ref={this.username} aria-describedby="basic-addon1" />
                            <DropdownButton
                                as={InputGroup.Append}
                                variant="outline-secondary"
                                title="Register as"
                                id="input-group-dropdown-2">
                                <Dropdown.Item onSelect={() => {this.roleSelect(1)}}>An Employee</Dropdown.Item>
                                <Dropdown.Item onSelect={() => {this.roleSelect(2)}}>A Recruiter</Dropdown.Item>
                            </DropdownButton>
                        </InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Password</InputGroup.Text>
                        </InputGroup.Prepend>
                        <InputGroup className="mb-3">
                            <FormControl type="password" ref={this.password} aria-describedby="basic-addon1" />
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleRegister}>Register</Button>
                        <Button variant="secondary" onClick={this.props.handleClose}>Close</Button>
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
    history: PropTypes.object
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        { registerProcess },
        dispatch
    );
}

export default withRouter(connect(null, mapDispatchToProps)(RegisterModal));