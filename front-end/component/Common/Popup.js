import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import Alert from "react-bootstrap/Alert";


export class Popup extends Component {
    static propTypes = {
        error: PropTypes.object
    };
    render() {
        return (
            <div><Alert show={this.props.error.show} variant={this.props.error.variant}>{this.props.error.msg}</Alert></div>
        );
    }
}

const mapStateToProps = state => ({
    error: state.errors,
});

export default connect(mapStateToProps, null)(Popup);
