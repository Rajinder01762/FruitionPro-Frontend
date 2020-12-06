import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

class CloseModal extends React.Component {
  render() {
  
    const { isOpen, toggle, title, message, onDone, children } = this.props;

    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggle} className="alert-modal">
          <ModalHeader toggle={toggle}>{title}</ModalHeader>
          <ModalBody>
            {message}
            {children || ""}
            {onDone && (
              <div className="attendingBtn-wrap">
                <Button
                  onClick={onDone}
                  color="secondary"
                  className="attending-btn"
                >
                  Ok
                </Button>{" "}
                <Button
                  onClick={toggle}
                  color="secondary"
                  className="attending-btn"
                >
                  Cancel
                </Button>
              </div>
            )}
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default CloseModal;
