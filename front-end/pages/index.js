import React, { Component, Fragment } from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';

import store from '../component/store';


import Headnav from '../component/Headnav/Headnav';

import { SET_AUTH, SET_PROFILE, SET_COMPANIES } from "../component/actions/types";
import { getCompanies } from "../component/actions/companies";


export default class App extends Component {
    static async getInitialProps() {
        let state = store.getState();
        if (state.companies.page.length == 0) {
            return { page: await store.dispatch(getCompanies(1)) };
        }
        return {};
    }

    componentDidMount() {
        let authRedux = {
            id: localStorage.getItem("id"),
            username: localStorage.getItem("username"),
            token: localStorage.getItem("token"),
            role: localStorage.getItem("role")
        };
        let profileRedux = {
            name: localStorage.getItem("name"),
            email: localStorage.getItem("email"),
            dob: localStorage.getItem("dob"),
            cvs: localStorage.getItem("cvs")
        };
        store.dispatch({ type: SET_AUTH, payload: authRedux });
        store.dispatch({ type: SET_PROFILE, payload: profileRedux });
        store.dispatch({ type: SET_COMPANIES, payload: this.props.page });
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
                    <h1> SOMETHING GOES HERE</h1>
                </Provider>
            </Fragment>
        );
    }
}

App.propTypes = {
    page: PropTypes.array.isRequired
};
