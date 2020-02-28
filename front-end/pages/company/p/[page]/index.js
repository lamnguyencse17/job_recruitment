import React, { Component, Fragment } from 'react';

import PropTypes from 'prop-types';

import { Provider } from 'react-redux';

import store from 'Components/store';

import { getCompanies } from "Components/actions/companies";
import { SET_COMPANIES, SET_PROFILE, SET_AUTH } from "Components/actions/types";

import Headnav from 'Components/Headnav/Headnav';
import Companies from "Components/Companies/Companies";

var state = store.getState();
export default class CompaniesIndex extends Component {
    static async getInitialProps() {
        if (state.companies.page.length == 0) {
            return { page: await store.dispatch(getCompanies(1)) };
        }
        return {};
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
        if (state.companies.page.length == 0) {
            store.dispatch({ type: SET_COMPANIES, payload: this.props.page });
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
                    <Companies />
                </Provider>
            </Fragment>
        );
    }
}

CompaniesIndex.propTypes = {
    page: PropTypes.array.isRequired,
};