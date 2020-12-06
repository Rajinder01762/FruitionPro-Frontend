import React from "react";
import { Input, FormGroup, Label, Col, Row } from "reactstrap";
import cx from "classnames";
import DateTimeCard from "../shared/DateTimeCard";
import DropDown from "../shared/DropDown";

class BasicInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // componentDidUpdate(_, ps) {
  // 	if (this.state.activeStep === 3 && ps.activeStep !== 3) {
  // 		this.props.setListner(false);
  // 	}
  // }

  render() {
    const {
      handleChange,
      title,
      project,
      startDateTime,
      endDateTime,
      department,
      projects,
      departments,
      hideTitle,
      errorText,
      errorType,
    } = this.props;

    return (
      <>
        {!hideTitle && <h2>Create Meeting</h2>}
        <Row>
          <Col sm={12}>
            <FormGroup>
              <Input
                onChange={handleChange("title")}
                type="text"
                id="title"
                value={title}
                placeholder=" "
              />
              <Label for="title" className="mb-0 label">
                Title
              </Label>
            </FormGroup>
            {errorType === "title" && <p className="error">{errorText}</p>}
          </Col>
        </Row>
        <Row className={cx({ "overlay-disabled": !title })}>
          <Col sm={6} className="pr-1">
            <div className="mb-4 mt-1 meetings-dropdown">
              <DropDown
                options={projects}
                selected={(project || {}).value}
                onSelect={handleChange("project")}
                defaultSel="Select Project"
              />
            </div>
          </Col>
          <Col sm={6} className="pl-1">
            <div className="mb-4 mt-1 meetings-dropdown">
              <DropDown
                options={departments}
                selected={(department || {}).value}
                onSelect={handleChange("department")}
                defaultSel="Select Department"
              />
            </div>
            {errorType === "project" && <p className="error">{errorText}</p>}

            {errorType === "department" && <p className="error">{errorText}</p>}
          </Col>
        </Row>
        <Row
          className={`text-white ${this.props.className || ""} ${
            !title || !project || !department ? "overlay-disabled" : null
          }`}
        >
          <Col sm={6} className="pr-1">
            <DateTimeCard
              date={startDateTime || new Date()}
              label="Start Date"
              onChange={handleChange("startDateTime")}
            />
          </Col>
          {errorType === "startDateTime" && (
            <p className="error">{errorText}</p>
          )}
          <Col sm={6} className="pl-1">
            <DateTimeCard
              date={endDateTime || new Date()}
              label="End Date"
              onChange={handleChange("endDateTime")}
              type="end"
              startDateTime={startDateTime}
            />
          </Col>
        </Row>
      </>
    );
  }
}
export default BasicInfo;
