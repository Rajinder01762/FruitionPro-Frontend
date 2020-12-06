import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import DownloadSummary from "./downloadSummary";

export default class DeleteAccountModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDownloadModal: false,
      status: "",
    };
  }

  toggleDownloadModal = () => {
    this.setState((prevState) => ({
      isDownloadModal: !prevState.isDownloadModal,
    }));
  };

  onSetAccountStatus = (value, isAdmin) => {
    if (isAdmin) {
      this.setState({
        status: value,
      });
      this.toggleDownloadModal();
    } else {
      const { setAccountStatus, userDetails, onToggleModal } = this.props;
      const obj = {
        email: userDetails && userDetails.email,
        type: value,
      };
      setAccountStatus(obj).then((result) => {
        onToggleModal();
      });
    }
  };

  render() {
    const {
      isOpen,
      onToggleModal,
      isInvitedUser,
      isAdmin,
      setDeleteOrDeactivateAccount,
      userDetails,
      userId,
      setUserAccountStatus,
    } = this.props;
    const { isDownloadModal, status } = this.state;
    return (
      <>
        <Modal isOpen={isOpen} toggle={onToggleModal} className="deleteModal">
          <ModalHeader toggle={onToggleModal}>
            {isInvitedUser ? " Deactivation or Deletion" : "Delete"}
          </ModalHeader>
          <ModalBody>
            <h2>
              Do you want to deactivate or delete {isAdmin ? "this" : "your"}{" "}
              account?
            </h2>
            <div className="text-center">
              <Button
                color="gradient"
                className="no-arrow mx-2"
                onClick={() => this.onSetAccountStatus("deactivate", isAdmin)}
              >
                Deactivate
              </Button>
              <Button
                color="gradient"
                className="no-arrow mx-2"
                onClick={() => this.onSetAccountStatus("delete", isAdmin)}
              >
                Delete
              </Button>
            </div>
          </ModalBody>
        </Modal>
        {isDownloadModal && status && (
          <DownloadSummary
            isOpen={isDownloadModal}
            isToggle={this.toggleDownloadModal}
            status={status}
            setDeleteOrDeactivateAccount={setDeleteOrDeactivateAccount}
            userDetails={userDetails}
            userId={userId}
            toggleDeleteTypeModal={onToggleModal}
            setUserAccountStatus={setUserAccountStatus}
          />
        )}
      </>
    );
  }
}
