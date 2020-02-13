import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { postProfile } from "../../../actions/profile";

import PropTypes from 'prop-types';

class CompleteModal extends Component {
    constructor() {
        super()
        this.email = React.createRef();
        this.dob = React.createRef();
        this.name = React.createRef();
    }

    handleSaveProfile = () => {
        this.props.postProfile(this.name.current.value, this.name.current.value, this.dob.current.value, this.props.token)
        this.props.hide()
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
                            <InputGroup.Text>Name</InputGroup.Text>
                        </InputGroup.Prepend>
                        <InputGroup className="mb-3">
                            <FormControl ref={this.dob} aria-describedby="basic-addon1" />
                        </InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Date of Birth</InputGroup.Text>
                        </InputGroup.Prepend>
                        <InputGroup className="mb-3">
                            <FormControl ref={this.name} aria-describedby="basic-addon1" />
                        </InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Email</InputGroup.Text>
                        </InputGroup.Prepend>
                        <InputGroup className="mb-3">
                            <FormControl type="email" ref={this.email} aria-describedby="basic-addon1" />
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleSaveProfile}>Save</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

CompleteModal.propTypes = {
    show: PropTypes.bool.isRequired,
    postProfile: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
    hide: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        token: state.auth.token,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        { postProfile },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(CompleteModal);