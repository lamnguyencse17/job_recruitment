import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { getProfile } from "../../../actions/profile"
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import Tabs from "react-bootstrap/Tabs"
import Tab from "react-bootstrap/Tab"

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
import CompleteModal from "./CompleteModal"


class Profile extends Component {
    constructor() {
        super()
        this.state = {
            showCompleteModal: false
        }
    }
    componentDidMount() {
        if (!this.props.username) {
            this.props.getProfile(this.props.id, this.props.token)
        }
        this.setState({
            showCompleteModal: this.props.id ? (this.props.email ? false : true) : false
        })
    }

    hideCompleteModal = () => {
        this.setState({
            ...this.state,
            showCompleteModal: false
        })
    }

    render() {
        return (
            <div>
                <CompleteModal show={this.state.showCompleteModal} hide={this.hideCompleteModal} />
                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                    <Tab eventKey="home" title="Profile">
                        <p>Profile goes here</p>
                    </Tab>
                    <Tab eventKey="profile" title="Settings">
                        <p>Settings goes here</p>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

Profile.propTypes = {
    email: PropTypes.string,
    username: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    getProfile: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        id: state.auth.id,
        email: state.profile.email,
        token: state.auth.token,
        username: state.auth.username
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        { getProfile },
        dispatch
    );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));