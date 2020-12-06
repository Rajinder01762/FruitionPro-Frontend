import React from "react";
import { Button } from "reactstrap";
import Attachment from "./attachment";
import AddTaskOptions from "./addTaskOptions";
import ReviewInfo from "./ReviewInfo";
import AddLabel from "./addLabel";
import CloseIcon from "../../../../../asset/images/virtual-assistant/close.svg";
import Calendar from "./calendar";

export default () => {
  return (
    <div className="addTask-screen createMeeting">
      {/* <Attachment /> */}
      <div className="mt-3">
        <Button
          className="subMeetingsBtn blue w-100 partBtn"
          // onClick={this.toggleParticipantModal}
        >
          <i className="fas fa-plus" />
          Add Assignee
        </Button>
      </div>
      <AddTaskOptions />
      {/* <AddLabel />
      <div className="text-right">
        <button className="cross-btn">
          <img src={CloseIcon} alt="cross" />
        </button>
      </div> */}
      {/* <Calendar /> */}
      {/* <ReviewInfo /> */}
    </div>
  );
};
