import React, { Component, Fragment } from 'react';
import Router from "next/router";
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';

import { Provider } from 'react-redux';

import store from '../../store';

import Headnav from '../../Headnav/Headnav';

import { getCompany } from "../../actions/company";
import { SET_AUTH, SET_PROFILE, SET_COMPANY } from "../../actions/types";
var state = store.getState();

class CompanyIndex extends Component {
    static async getInitialProps(router) {
        let id = router.query.id;
        return { company: await store.dispatch(getCompany(id)) };
    }

    componentDidMount() {
        let authRedux, profileRedux;
        if (state.auth.id == "") {
            authRedux = {
                id: localStorage.getItem("id"),
                username: localStorage.getItem("username"),
                token: localStorage.getItem("token"),
                role: localStorage.getItem("role")
            };
            store.dispatch({ type: SET_AUTH, payload: authRedux });
        }
        if (state.profile.name == "") {
            profileRedux = {
                name: localStorage.getItem("name"),
                email: localStorage.getItem("email"),
                dob: localStorage.getItem("dob"),
                cvs: localStorage.getItem("cvs")
            };
            store.dispatch({ type: SET_PROFILE, payload: profileRedux });
        }
        console.log(state.company);
        if (Object.entries(state.company).length === 0 && state.company.constructor === Object) {
            store.dispatch({ type: SET_COMPANY, payload: this.props.company });
        }
    }
    render() {
        return (
            <Fragment>
                <head>
                    <link
                        rel="stylesheet"
                        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
                        crossOrigin="anonymous"
                    />
                </head>
                <Provider store={store}>
                    <Headnav />
                    <p>{this.props.company.name}</p>
                    <p>{this.props.company.location}</p>
                    <p>{this.props.company.description}</p>
                    <p>{this.props.company.size}</p>
                    <p>{this.props.company.email}</p>
                    <p>{this.props.company.phone}</p>
                </Provider>
            </Fragment>
        );
    }
}

CompanyIndex.propTypes = {
    company: PropTypes.object.isRequired
};

export default withRouter(CompanyIndex);