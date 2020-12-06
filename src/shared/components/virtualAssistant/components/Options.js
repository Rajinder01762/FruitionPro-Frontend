import React from "react";
import { Button, Row, Col } from "reactstrap";
import Meeting from "../../../../asset/images/virtual-assistant/meeting.png";
import Profile from "../../../../asset/images/virtual-assistant/profile.png";
import TaskManagement from "../../../../asset/images/virtual-assistant/taskManagement.png";
import More from "../../../../asset/images/virtual-assistant/more.png";

const Options = ({ setActiveStep }) => {
  return (
    <div className="assistant-options">
      <Row>
        <Col onClick={() => setActiveStep(2)} xs={6} className="pr-1">
          <Button style={{ background: "#fb5f5d" }}>
            <img src={Meeting} className="mr-2" />
            Meeting
          </Button>
        </Col>
        <Col xs={6} className="pl-1">
          <Button
            onClick={() => setActiveStep(4)}
            style={{ background: "#09d8aa" }}
          >
            <img src={TaskManagement} className="mr-2" />
            Task Management
          </Button>
        </Col>
        <Col xs={6} className="pr-1">
          <Button style={{ background: "#3387f9" }}>
            <img src={Profile} className="mr-2" />
            Profile
          </Button>
        </Col>
        <Col xs={6} className="pl-1">
          <Button style={{ background: "#fc9451" }}>
            <img src={More} className="mr-2" />
            Meeting
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Options;
