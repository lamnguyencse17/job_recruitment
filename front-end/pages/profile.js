import React, { Component, Fragment } from 'react';

import { Provider } from 'react-redux';

import store from 'Components/store';

import Headnav from 'Components/Headnav/Headnav';
import Profile from "Components/Profile/Profile";

import { SET_PROFILE, SET_AUTH } from "Components/actions/types";
import { authProcess } from "Components/actions/auth";
var state = store.getState();

class profileIndex extends Component {
    async componentDidMount() {
        let authRedux, profileRedux;
        if (state.auth.id == "") {
            authRedux = {
                id: localStorage.getItem("id"),
                username: localStorage.getItem("username"),
                token: localStorage.getItem("token"),
                role: localStorage.getItem("role")
            };
        }
        let authorized = await store.dispatch(authProcess(authRedux.token));
        if (authorized) {
            store.dispatch({ type: SET_AUTH, payload: authRedux });
            if (state.profile.name == "") {
                profileRedux = {
                    name: localStorage.getItem("name"),
                    email: localStorage.getItem("email"),
                    dob: localStorage.getItem("dob"),
                    cvs: localStorage.getItem("cvs")
                };
                store.dispatch({ type: SET_PROFILE, payload: profileRedux });
            }
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
                    <Profile />
                </Provider>
            </Fragment>
        );
    }
}

export default profileIndex;