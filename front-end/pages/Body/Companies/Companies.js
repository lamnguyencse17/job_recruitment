import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from "react-redux";

class Companies extends Component {
    componentDidMount() {
        console.log(this.props);
    }
    render() {
        return (
            <div>
                1
            </div>
        );
    }
}

export default connect(null, null)(Companies);