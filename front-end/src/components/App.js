import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom";

import store from '../store';


import Body from './Body/Body';
import Headnav from './Headnav/Headnav';


class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Headnav />
                <Body />
            </Provider>
        );
    }
}

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById("app"));
