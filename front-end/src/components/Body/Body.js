import React, { Component } from 'react';
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'


class Body extends Component {
    constructor(){
        super()
        this.textInput = React.createRef(); 
    }
    handleSearch(){
        // console.log(this.textInput.current.value)
        // Search function goes here
    }
    render() {
        return (
            <div className="row">
                <div className="col-3"></div>
                <div className="col">
                    <InputGroup className="mb-3">
                        <FormControl ref={this.textInput} aria-describedby="basic-addon1" />
                        <InputGroup.Append>
                            <Button onClick={() => this.handleSearch()} variant="outline-secondary">Search</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </div>
                <div className="col-3"></div>
            </div>
        );
    }
}

export default Body;