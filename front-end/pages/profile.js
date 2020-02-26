import React, { Component, Fragment } from 'react';

import { Provider } from 'react-redux';

import store from '../component/store';

import Headnav from '../component/Headnav/Headnav';
import Profile from "../component/Profile/Profile";

import { SET_PROFILE, SET_AUTH } from "../component/actions/types";
var state = store.getState();

class profileIndex extends Component {
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