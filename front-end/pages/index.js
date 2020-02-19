import React, { Component, Fragment } from 'react';

import { Provider } from 'react-redux';

import store from './store';


import Body from './Body/Body';
import Headnav from './Headnav/Headnav';

import {SET_AUTH, SET_PROFILE} from "./actions/types"


export default class App extends Component {
    componentDidMount(){
        let authRedux = {
            id: localStorage.getItem("id"),
            username: localStorage.getItem("username"),
            token: localStorage.getItem("token"),
            role: localStorage.getItem("role")
          }
        let profileRedux = {
            name: localStorage.getItem("name"),
            email: localStorage.getItem("email"),
            dob: localStorage.getItem("dob"),
            cvs: localStorage.getItem("cvs")
        }
        store.dispatch({type: SET_AUTH, payload: authRedux})
        store.dispatch({type: SET_PROFILE, payload: profileRedux})
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
                    <Body />
                </Provider>
            </Fragment>
        );
    }
}
