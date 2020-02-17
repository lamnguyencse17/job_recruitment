import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class DeleteModal extends Component {
    constructor(){
        super()
        this.password = React.createRef();
        this.confirm = React.createRef();
    }
    handleDelete = () => {
        if (this.confirm.current.value != "I Confirm"){
            console.log("HELL NO")
        }
    }
    render() {
        return (
            <div>
                <Modal show={this.props.show}>
                    <Modal.Header>
                        <Modal.Title>Deletion Of Your Account</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Please Enter Your Password</InputGroup.Text>
                        </InputGroup.Prepend>
                        <InputGroup className="mb-3">
                            <FormControl type="password" ref={this.password} aria-describedby="basic-addon1" />
                        </InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Please Type &quot;I Confirm&quot;</InputGroup.Text>
                        </InputGroup.Prepend>
                        <InputGroup className="mb-3">
                            <FormControl ref={this.confirm} aria-describedby="basic-addon1" />
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.handleDelete}>Delete</Button>
                        <Button variant="primary" onClick={this.props.toggleDeleteModal}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default DeleteModal;