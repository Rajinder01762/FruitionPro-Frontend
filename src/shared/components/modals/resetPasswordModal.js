import React, { Component } from 'react'
import { Button, FormGroup, Label, Input, Modal, ModalHeader, ModalBody } from "reactstrap";

export default class ResetPasswordModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      error: {}
    }
  }

  onResetPassword = (e) => {
    e.preventDefault();
    const { changePassword, userId, toggle, userDetails } = this.props;
    const { oldPassword, newPassword, confirmPassword } = this.state;
    let error = {
      oldPassword: false,
      newPassword: false,
      confirmPassword: false,
      confirmPasswordMatch: false
    }
    if (!userDetails.socialLogin) {
      if (oldPassword === '') {
        error.oldPassword = true
      }
    }
    if (newPassword === "") {
      error.newPassword = true
    }
    if (newPassword !== '') {
      if (newPassword.length < 6) {
        error.newPassword = true
      }
    }
    if (confirmPassword === '') {
      error.confirmPassword = true
    }
    if (newPassword !== confirmPassword) {
      error.confirmPasswordMatch = true
    }
    this.setState({ error })
    if (!error.oldPassword && !error.newPassword && !error.confirmPassword && !error.confirmPasswordMatch) {
      const obj = {
        id: userId,
        socialLogin: userDetails.socialLogin,
        new_password: newPassword,
        old_password: oldPassword
      }
      changePassword(obj).then(result => {
        if (result.payload.data.status === 200) {
          this.setState({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            error: {}
          })
          toggle();
        }

      });
    }
  }
  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  onToggleModal = () => {
    const { toggle } = this.props;
    this.setState({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      error: {}
    })
    toggle();
  }

  render() {
    const { open, userDetails } = this.props;
    const { oldPassword, newPassword, confirmPassword, error } = this.state;
    return (

      <Modal isOpen={open} toggle={this.onToggleModal} className="create-meeting-modal account-form-screen reset-password ">
        <ModalHeader toggle={this.onToggleModal}>Reset Your Password<button type="button" className="close" aria-label="Close"><span aria-hidden="true">×</span></button></ModalHeader>
        <ModalBody>
          {!userDetails.socialLogin && <FormGroup>
            <Label htmlFor="old password" name="oldPassword" className="required">Old Password</Label>
            <Input
              type="password"
              name="oldPassword"
              placeholder="Enter Old Password"
              value={oldPassword}
              onChange={e => this.handleInput(e)}
            />
            {error.oldPassword && <span className="text-danger">Enter old Password</span>}
          </FormGroup>}
          <FormGroup>
            <Label htmlFor="new password" name="newPassword" className="required">New Password</Label>
            <Input
              type="password"
              name="newPassword"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={e => this.handleInput(e)}
            />
            {error.newPassword && <span className="text-danger">Password must be atleast of length 6</span>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="confirm password" name="confirmPassword" className="required">Confirm Password</Label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Enter Confirm Password"
              value={confirmPassword}
              onChange={e => this.handleInput(e)}
            />
            {error.confirmPassword ? <span className="text-danger">Confirm password is empty</span> : error.confirmPasswordMatch && <span className="text-danger">Password doesn't match</span>}

          </FormGroup>
          <div className="reset-btn">
            <Button color="gradient" type="submit" onClick={(e) => this.onResetPassword(e)}>Save</Button>
          </div>
        </ModalBody>
      </Modal>


    )
  }
}
