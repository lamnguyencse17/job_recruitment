import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Router from "next/router"

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';


import Popup from '../Common/Popup';
import {deleteProfile} from "../actions/profile"
import { verifyProcess } from "../actions/auth";
import { setErrors, clearErrors } from "../actions/errors";


class DeleteModal extends Component {
    constructor() {
        super();
        this.password = React.createRef();
        this.confirm = React.createRef();
    }
    handleDelete = async () => {
        if (this.confirm.current.value != "I Confirm") {
            this.props.setErrors("Please enter correctly the phrase", 0);
        }
        if (this.props.popup) {
            this.props.clearErrors();
        }
        this.props.verifyProcess(this.props.token, this.password.current.value);
        let result = await this.props.deleteProfile(this.props.token)
        if (result) {
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
                        <Modal.Title>Deletion Of Your Account</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Please Enter Your Password</InputGroup.Text>
                        </InputGroup.Prepend>
                        <InputGroup className="mb-3">
                            <FormControl type="password" ref={this.password} aria-describedby="basic-addon1" />
                        </InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Please Type &quot;I Confirm&quot;</InputGroup.Text>
                        </InputGroup.Prepend>
                        <InputGroup className="mb-3">
                            <FormControl ref={this.confirm} aria-describedby="basic-addon1" />
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.handleDelete}>Delete</Button>
                        <Button variant="primary" onClick={this.props.toggleDeleteModal}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

DeleteModal.propTypes = {
    token: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    popup: PropTypes.bool.isRequired,
    toggleDeleteModal: PropTypes.func.isRequired,
    deleteProfile: PropTypes.func.isRequired,
    verifyProcess: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    setErrors: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        popup: state.errors.show,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        { deleteProfile, verifyProcess, clearErrors, setErrors },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteModal); 