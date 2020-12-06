import React from "react";
import { FormGroup, Input, Label, Row, Col, Button } from "reactstrap";
import UserImg from "../../../../../../asset/images/virtual-assistant/user.jpg";
import DueDate from "../../../../../../asset/images/virtual-assistant/dueDate.png";
import Goal from "../../../../../../asset/images/virtual-assistant/Goal.png";
import Projects from "../../../../../../asset/images/virtual-assistant/projects.png";
import AddLabel from "../../../../../../asset/images/virtual-assistant/addLabel.png";

export default () => {
  return (
    <>
      <h2>Add Tasks</h2>
      <div className="assistant-meeting">
        <h5 className="list-title">Participants</h5>
        <div className="participantsUsers">
          <img src={UserImg} alt="" />
          <img src={UserImg} alt="" />
          <div className="add-user">
            <i className="fas fa-pencil-alt" />
          </div>
        </div>
        <div className="d-flex flex-wrap mb-5">
          <Button className="subMeetingsOptions red pl-3 due-date">
            Due Date
            <span>
              <img src={DueDate} alt="due-date" />
            </span>
          </Button>
          <Button className="subMeetingsOptions green pl-3 projects">
            Projects
            <span>
              <img src={Projects} alt="projects" />
            </span>
          </Button>
          <Button className="subMeetingsOptions orange pl-3 add-label">
            Add Label
            <span>
              <img src={AddLabel} alt="AddLabel" />
            </span>
          </Button>
          <Button className="subMeetingsOptions blue pl-3 goal">
            Goal
            <span>
              <img src={Goal} alt="Goal" />
            </span>
          </Button>
        </div>
      </div>
    </>
  );
};
