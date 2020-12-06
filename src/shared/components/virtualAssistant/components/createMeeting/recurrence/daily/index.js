import React from "react";
import { Input, Row, Col } from "reactstrap";

const Daily = (props) => {
  const {} = props;
  return (
    <div className="recContent-wrapper">
      <div className="rec-content pl-2">
        <div className="d-flex align-items-center mb-3">
          <label className="radioLabel">
            <input type="radio" name="days" />
            <span className="radioBtn"></span>
          </label>
          Every <Input /> Day(s)
        </div>
        <div className="d-flex align-items-center mb-3">
          <label className="radioLabel">
            <input type="radio" name="days" />
            <span className="radioBtn active"></span>
          </label>
          Every Weekday
        </div>
      </div>
    </div>
  );
};
export default Daily;
