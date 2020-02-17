import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from "react-redux";
import { Switch, Route, withRouter, } from "react-router-dom";

import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';

import Profile from './Profile/Profile';


class Body extends Component {
    constructor() {
        super();
        this.textInput = React.createRef();
    }
    handleSearch() {
        // console.log(this.textInput.current.value)
        // Search function goes here
    }
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-3"></div>
                    <div className="col">
                        <InputGroup className="mb-3">
                            <FormControl ref={this.textInput} aria-describedby="basic-addon1" />
                            <InputGroup.Append>
                                <Button onClick={() => this.handleSearch()} variant="outline-secondary">Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                    <div className="col-3"></div>
                </div>
                <Switch>
                    <Route path="/profile">
                        <Profile />
                    </Route>
                </Switch>
            </div>
        );
    }
}

Body.propTypes = {
    token: PropTypes.string,
    id: PropTypes.string
};

function mapStateToProps(state) {
    return {
        id: state.auth.id,
        token: state.auth.token,
    };
}

export default withRouter(connect(mapStateToProps, null)(Body));