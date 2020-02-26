import React, { Component, Fragment } from 'react';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

import { withRouter } from 'next/router';
import PropTypes from 'prop-types';

import { Provider } from 'react-redux';

import store from '../../../component/store';

import Headnav from '../../../component/Headnav/Headnav';

import { getCompany } from "../../../component/actions/company";
import { SET_AUTH, SET_PROFILE, SET_COMPANY } from "../../../component/actions/types";
var state = store.getState();

class CompanyIndex extends Component {
    static async getInitialProps(router) {
        let id = router.query.id;
        return { company: await store.dispatch(getCompany(id)) };
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
        if (Object.entries(state.company).length === 0 && state.company.constructor === Object) {
            store.dispatch({ type: SET_COMPANY, payload: this.props.company });
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
                    <Container fluid>
                        <Row>
                            <Col xs={2}></Col>
                            <Col>
                                <Row className="bg-light">
                                    <Col xs={4}>
                                        <Container className="position-relative">
                                            <Image src="https://cdn.itviec.com/employers/itviec-com-s-client/logo/social/21Hhw7GCbkU2ntEmjUHdmNn8/itviec-com-s-client-logo.jpg"></Image>
                                        </Container>
                                    </Col>
                                    <Col>
                                        <h1>{this.props.company.name}</h1>
                                        <Container>
                                            <p>Location: {this.props.company.location}</p>
                                            <p>Description: {this.props.company.description}</p>
                                            <p>Size: {this.props.company.size}</p>
                                            <p>Email: {this.props.company.email}</p>
                                            <p>Phone: {this.props.company.phone}</p>
                                        </Container>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={2}></Col>
                        </Row>
                    </Container>
                </Provider>
            </Fragment>
        );
    }
}

CompanyIndex.propTypes = {
    company: PropTypes.object.isRequired
};

export default withRouter(CompanyIndex);