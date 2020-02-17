import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from '../store';
import ReactDOM from 'react-dom';
import Body from './Body/Body'
import Headnav from './Headnav/Headnav';
import {
    HashRouter as Router,
} from "react-router-dom";
import { Alert } from './Alert/Alert';

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Alert/>
                    <Headnav />
                    <Body />
                </Router>
            </Provider>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("app"));
