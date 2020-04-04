import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { getProfile } from "../actions/models/profile";
import { authProcess } from "../actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";

import DeleteModal from "./DeleteModal";
import CompleteModal from "./CompleteModal";
import EditProfile from "./EditProfile";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      showCompleteModal: false,
      showDeleteModal: false
    };
  }
  componentDidMount() {
    this.props.authProcess(this.props.token);
    if (!this.props.username) {
      this.props.getProfile(this.props.id, this.props.token);
    }
    this.setState({
      showCompleteModal: this.props.id
        ? this.props.email
          ? false
          : true
        : false
    });
  }

  hideCompleteModal = () => {
    this.setState({
      ...this.state,
      showCompleteModal: false
    });
  };

  toggleDeleteModal = () => {
    this.setState({
      ...this.state,
      showDeleteModal: !this.state.showDeleteModal
    });
  };

  render() {
    return (
      <div>
        <CompleteModal
          show={this.state.showCompleteModal}
          hide={this.hideCompleteModal}
        />
        <DeleteModal
          show={this.state.showDeleteModal}
          toggleDeleteModal={this.toggleDeleteModal}
        />
        <div className="row">
          <div className="col-2"></div>
          <div className="col">
            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
              <Tab eventKey="profile" title="Profile">
                <EditProfile />
                <hr></hr>
                <Button
                  className="float-right"
                  onClick={this.toggleDeleteModal}
                  variant="danger"
                >
                  Delete Your Account
                </Button>
              </Tab>
              <Tab eventKey="setting" title="Settings">
                <p>Settings goes here</p>
              </Tab>
            </Tabs>
          </div>
          <div className="col-2"></div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  email: PropTypes.string,
  username: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  getProfile: PropTypes.func.isRequired,
  authProcess: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    id: state.auth.id,
    email: state.models.profile.email,
    token: state.auth.token,
    username: state.auth.username
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getProfile, authProcess }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
