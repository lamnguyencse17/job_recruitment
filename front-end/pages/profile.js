import React, { Component, Fragment } from 'react';

import { Provider } from 'react-redux';

import store from './store';

import Headnav from './Headnav/Headnav';
import Profile from "./Profile/Profile";


class profileIndex extends Component {
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