import React from "react";
import { Input, Row, Col } from "reactstrap";
import Dropdown from "../dropdown";
const Yearly = (props) => {
  const {} = props;
  return (
    <div className="recContent-wrapper">
      <div className="rec-content yearly-content pl-2">
        <div className="d-flex align-items-center mb-3">
          <label className="radioLabel">
            <input type="radio" name="days" />
            <span className="radioBtn"></span>
          </label>
          Recur every <Input /> year(s)
        </div>
        <div className="d-flex align-items-center mb-3 ml-2">
          On <Dropdown />
          <Input />
        </div>
        <div className="d-flex align-items-center mb-3 ml-2">
          On
          <Dropdown />
          <Dropdown /> of
          <Dropdown />
        </div>
      </div>
    </div>
  );
};
export default Yearly;
