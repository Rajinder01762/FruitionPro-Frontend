import React from "react";
import { Row, Col } from "reactstrap";
import DateTimeCard from "../../components/shared/DateTimeCard";
// import { defaultProps } from "react-select/src/Select";

const StartEndTime = (props) => {
  return (
    <Row className={`text-white times-info ${props.className || ""}`}>
      <Col xs={6} className="pr-1">
        <DateTimeCard type="start" />
      </Col>
      <Col xs={6} className="pl-1">
        <DateTimeCard type="end" />
      </Col>
    </Row>
  );
};
export default StartEndTime;
