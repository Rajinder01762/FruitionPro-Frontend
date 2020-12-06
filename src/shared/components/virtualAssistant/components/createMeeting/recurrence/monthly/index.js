import React from "react";
import { Input, Row, Col } from "reactstrap";
import Dropdown from "../dropdown";

const Monthly = (props) => {
  const {} = props;
  return (
    <div className="recContent-wrapper">
      <div className="recMonthly-content pl-2">
        <div className="d-flex align-items-center mb-3">
          <label className="radioLabel">
            <input type="radio" name="days" />
            <span className="radioBtn"></span>
          </label>
          Day <Input /> Of every <Input /> month(s)
        </div>
        <div className="d-flex align-items-center mb-3">
          <label className="radioLabel">
            <input type="radio" name="days" />
            <span className="radioBtn"></span>
          </label>
          The <Dropdown />
          <Dropdown /> Of every
          <Input /> month(s)
        </div>
      </div>
    </div>
  );
};
export default Monthly;
