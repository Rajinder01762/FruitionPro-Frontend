import React from "react";
import { FormGroup, Input, Label, Row, Col } from "reactstrap";
import Attachment from "../../../../../asset/images/virtual-assistant/clip.png";

export default () => {
  return (
    <>
      <h2>Add Tasks</h2>
      <Row>
        <Col sm={12}>
          <div className="addTaskInput">
            <FormGroup>
              <Input type="textarea" name="text" id="title" placeholder=" " />
              <Label for="title" className="mb-0 label">
                Enter task details
              </Label>
            </FormGroup>
            <div className="file-wrapper">
              <span className="file-attachment">
                <input type="file" name="photo" id="photo" />
                <span className="attachment-label">
                  <img src={Attachment} alt="Attachment" />
                </span>
              </span>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};
