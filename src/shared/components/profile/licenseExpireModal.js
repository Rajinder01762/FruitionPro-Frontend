import React, { Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

export default class LicenseExpireModal extends Component {
  render() {
    return (
      <div>
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className="licenseKeyModal">
          <ModalHeader toggle={this.props.toggle}>Buy License key</ModalHeader>
          <ModalBody>
            <div className="freeTrial">
              <h3 className="heading">License Expired</h3>
              <p>Oops! Please buy a new license to continue with your account.</p>
            </div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}
