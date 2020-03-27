import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { putProfile } from "../actions/profile";

class EditProfile extends Component {
    constructor() {
        super();
        this.state = {
            name: true,
            email: true,
            dob: true
        };
        this.email = React.createRef();
        this.dob = React.createRef();
        this.name = React.createRef();
    }
    toggleEdit = () => {
        this.setState({ [event.target.id]: !(this.state[event.target.id]) });
    };
    saveChanges = () => {
        if (this.email.current.value == this.props.email ||
            this.name.current.value == this.props.name ||
            this.dob.current.value == this.props.dob) {
            console.log("NOTHING HAPPENED");
            return;
        }
        this.props.putProfile(this.email.current.value, this.dob.current.value, this.name.current.value, this.props.token);
        this.setState({
            name: true,
            email: true,
            dob: true
        });
    };
    render() {
        return (
            <Fragment>
                <br></br>
                <Form>
                    <Form.Group controlId="formName">
                        <Form.Row className="align-items-center">
                            <div className="col-2"><Form.Label>Name</Form.Label></div>
                            <div className="col"><Form.Control type="text" readOnly={this.state.name} ref={this.name} placeholder={this.props.name} /></div>
                            <div className="col-2"><Button variant="warning" id="name" onClick={() => this.toggleEdit()}>Edit</Button></div>
                        </Form.Row>
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                        <Form.Row className="align-items-center">
                            <div className="col-2"><Form.Label>Email</Form.Label></div>
                            <div className="col"><Form.Control type="email" readOnly={this.state.email} ref={this.email} placeholder={this.props.email} /></div>
                            <div className="col-2"><Button variant="warning" id="email" onClick={() => this.toggleEdit()}>Edit</Button></div>
                        </Form.Row>
                    </Form.Group>
                    <Form.Group controlId="formDob">
                        <Form.Row className="align-items-center">
                            <div className="col-2"><Form.Label>Date of Birth</Form.Label></div>
                            <div className="col"><Form.Control type="text" readOnly={this.state.dob} ref={this.dob} placeholder={this.props.dob} /></div>
                            <div className="col-2"><Button variant="warning" id="dob" onClick={() => this.toggleEdit()}>Edit</Button></div>
                        </Form.Row>
                    </Form.Group>
                    <Button variant="primary" onClick={() => this.saveChanges()}>Save Changes</Button>
                </Form>
            </Fragment>
        );
    }
}

EditProfile.propTypes = {
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    dob: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    putProfile: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        email: state.profile.email,
        name: state.profile.name,
        dob: state.profile.dob,
        token: state.auth.token,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        { putProfile },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile); 