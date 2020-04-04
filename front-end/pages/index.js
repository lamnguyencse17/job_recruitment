import React, { Component, Fragment } from "react";
import { Provider } from "react-redux";
import PropTypes from "prop-types";

import store from "Components/store";

import Headnav from "Components/Headnav/Headnav";


import {
  SET_AUTH,
  SET_PROFILE,
  SET_COMPANIES,
  SET_JOBS
} from "Components/actions/types/control_types";
import { getCompanies } from "Components/actions/models/companies";
import { getJobs } from "Components/actions/models/jobs";
import { authProcess } from "Components/actions/auth";
import IndexPage from "Components/Index/IndexPage";

export default class Index extends Component {
  constructor() {
    super();
    this.state = {
      company_page: [],
      job_page: []
    };
  }
  static async getInitialProps() {
    let state = store.getState();
    if (state.models.companies.page.length == 0 || state.models.jobs.page.length == 0) {
      return {
        company_page: await store.dispatch(getCompanies(1)),
        job_page: await store.dispatch(getJobs(1))
      };
    }
    return { company_page: state.models.companies.page, job_page: state.models.jobs.page };
  }

  async componentDidMount() {
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
    let authorized = await store.dispatch(authProcess(authRedux.token));
    if (authorized) {
      store.dispatch({ type: SET_AUTH, payload: authRedux });
      store.dispatch({ type: SET_PROFILE, payload: profileRedux });
    }
    store.dispatch({ type: SET_COMPANIES, payload: this.props.company_page });
    store.dispatch({ type: SET_JOBS, payload: this.props.job_page });
    this.setState({
      company_page: this.props.company_page.slice(0, 4),
      job_page: this.props.job_page.slice(0, 4)
    });
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
          <IndexPage company_page={this.state.company_page} job_page={this.state.job_page}/>
        </Provider>
      </Fragment>
    );
  }
}

Index.propTypes = {
  company_page: PropTypes.array.isRequired,
  job_page: PropTypes.array.isRequired
};
