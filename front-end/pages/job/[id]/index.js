import React, { Component, Fragment } from 'react';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';

import { Provider } from 'react-redux';

import store from 'Components/store';

import { SET_PROFILE, SET_AUTH, SET_JOB } from "Components/actions/types/control_types";

import Headnav from 'Components/Headnav/Headnav';
import SingleJob from "Components/Jobs/SingleJob";
import { getJob } from "Components/actions/models/job";
import { authProcess } from "Components/actions/auth";

var state = store.getState();

class JobIndex extends Component {
    static async getInitialProps(router) {
        let id = router.query.id;
        console.log(id);
        if (state.models.jobs.page.length == 0) {
            return { job: await store.dispatch(getJob(id)) };
        }
        return {};
    }

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
            if (state.models.profile.name == "") {
                profileRedux = {
                    name: localStorage.getItem("name"),
                    email: localStorage.getItem("email"),
                    dob: localStorage.getItem("dob"),
                    cvs: localStorage.getItem("cvs")
                };
                store.dispatch({ type: SET_PROFILE, payload: profileRedux });
            }
        }
        if (Object.entries(state.models.job).length === 0 && state.models.job.constructor === Object) {
            store.dispatch({ type: SET_JOB, payload: this.props.job });
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
                    <SingleJob job={this.props.job} />
                </Provider>
            </Fragment>
        );
    }
}

JobIndex.propTypes = {
    job: PropTypes.object.isRequired
};

export default withRouter(JobIndex);