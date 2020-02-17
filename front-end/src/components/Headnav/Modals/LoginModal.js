import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loginProcess } from "../../../actions/auth";
import { getProfile } from "../../../actions/profile"
import {
    withRouter,
  } from "react-router-dom";

import PropTypes from 'prop-types';

class LoginModal extends Component {
    constructor() {
        super()
        this.username = React.createRef();
        this.password = React.createRef();
    }

    handleLogin = async () => {
        this.props.handleClose()
        let result = await this.props.loginProcess(this.username.current.value, this.password.current.value)
        this.props.getProfile(result.id, result.token)
        this.props.history.push("/")
    }

    render() {
        return (
            <div>
                <Modal show={this.props.show}>
                    <Modal.Header>
                        <Modal.Title>Login</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Username</InputGroup.Text>
                        </InputGroup.Prepend>
                        <InputGroup className="mb-3">
                            <FormControl ref={this.username} aria-describedby="basic-addon1" />
                        </InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Password</InputGroup.Text>
                        </InputGroup.Prepend>
                        <InputGroup className="mb-3">
                            <FormControl type="password" ref={this.password} aria-describedby="basic-addon1" />
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleLogin}>Login</Button>
                        <Button variant="secondary" onClick={this.props.handleClose}>Close</Button>
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
    history: PropTypes.object.isRequired
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        { loginProcess, getProfile },
        dispatch
    );
}

export default withRouter(connect(null, mapDispatchToProps)(LoginModal));