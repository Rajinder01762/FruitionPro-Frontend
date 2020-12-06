import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Button,
} from "reactstrap";

class DeleteMeetingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onlyMe: false,
      forAll: true,
    };
  }

  onSelectDeleteType = (value) => {
    const { onsetDeleteType, toggle } = this.props;
    const { onlyMe, forAll } = this.state;
    // console.log(value);
    onsetDeleteType(value, onlyMe);
    toggle();
    this.setState({
      onlyMe: true,
      forAll: false,
    });
  };

  onHandleChange = (e, value) => {
    if (value === "only") {
      this.setState({
        onlyMe: e.target.checked,
        forAll: !e.target.checked,
      });
    } else {
      this.setState({
        onlyMe: !e.target.checked,
        forAll: e.target.checked,
      });
    }
  };

  render() {
    const { isOpen, toggle, userDetails, selectedDeleteMeeting } = this.props;
    const { onlyMe, forAll } = this.state;
    let showRadioBtn = false;
    let reccBtn = false;
    let mySelfShow = false;

    if (
      selectedDeleteMeeting &&
      selectedDeleteMeeting.attendees &&
      selectedDeleteMeeting.attendees.length > 0
    ) {
      const index =
        selectedDeleteMeeting &&
        selectedDeleteMeeting.attendees.findIndex(
          (i) => i.email && i.email !== userDetails.email && i.can_edit === true
        );
      if (index > -1) {
        mySelfShow = true;
      }
    }
    if (
      userDetails &&
      userDetails.email &&
      selectedDeleteMeeting &&
      selectedDeleteMeeting.admin_email
    ) {
      if (userDetails.email === selectedDeleteMeeting.admin_email) {
        showRadioBtn = true;
      }
    }
    if (selectedDeleteMeeting && selectedDeleteMeeting.parent_id) {
      reccBtn = true;
    }
    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle} style={{ textAlign: "center" }}>
          Delete Meeting
        </ModalHeader>
        <ModalBody>
          <div className="freeTrial">
            <h3 className="heading">
              {selectedDeleteMeeting && selectedDeleteMeeting.parent_id ? (
                <span>
                  Do you want to delete this meeting or subsequent recurring
                  meetings.
                </span>
              ) : (
                <span>Do you want to delete this meeting?</span>
              )}
            </h3>
            {showRadioBtn && (
              <div className="delete-radio-btn">
                {mySelfShow && (
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        name="radio"
                        checked={onlyMe}
                        onChange={(e) => this.onHandleChange(e, "only")}
                      />
                      I am not attending
                    </Label>
                  </FormGroup>
                )}
                <FormGroup check>
                  <Label check>
                    <Input
                      type="radio"
                      name="radio"
                      checked={forAll}
                      onChange={(e) => this.onHandleChange(e, "all")}
                    />{" "}
                    Cancel Meeting
                  </Label>
                </FormGroup>
              </div>
            )}
          </div>

          {reccBtn ? (
            <div className="form-group text-center mt-4 deleteBtns">
              <Button
                className="delete-me"
                size="sm"
                onClick={() => {
                  this.onSelectDeleteType("only");
                }}
              >
                Only this
              </Button>

              <Button
                color="danger"
                className="delete-all"
                size="sm"
                onClick={() => {
                  this.onSelectDeleteType("all");
                }}
              >
                Delete All
              </Button>
            </div>
          ) : (
            <div className="text-center mt-3">
              <Button
                className="delete-me px-4"
                size="sm"
                onClick={() => {
                  this.onSelectDeleteType("only");
                }}
              >
                Confirm
              </Button>
            </div>
          )}
        </ModalBody>
      </Modal>
    );
  }
}

export default DeleteMeetingModal;
