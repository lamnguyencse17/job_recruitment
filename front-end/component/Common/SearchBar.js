import React, { Component } from "react";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {bindActionCreators} from "redux";


import {connect} from 'react-redux';
import PropTypes from "prop-types";

class SearchBar extends Component {
  constructor(props){
    super(props)
    this.state = {
      term: ""
    }
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleSearch(){
    console.log("SEARCH")
  }
  render() {
    return (
                <Form inline>
                    <Form.Control type="text" name="term" onChange={this.handleChange.bind(this)} placeholder="Type in to search" className="mr-sm-2" style={{"width": "80%"}}/>
                    <Button variant="outline-primary" onClick={() => this.handleSearch()}>Search</Button>
                </Form>
    );
  }
}

export default SearchBar;