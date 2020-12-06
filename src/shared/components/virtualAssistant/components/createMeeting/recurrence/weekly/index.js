import React from "react";
import { Input, button } from "reactstrap";

const Weekly = (props) => {
  const {} = props;
  return (
    <div className="recContent-wrapper">
      <div className="rec-content pl-2">
        <div className="d-flex align-items-center mb-3">
          <label className="radioLabel">
            <input type="radio" name="days" />
            <span className="radioBtn"></span>
          </label>
          Recur every <Input /> week(s) on
        </div>
        <div className="week-list">
          <button className="active">Su</button>
          <button>Mo</button>
          <button>Tu</button>
          <button>We</button>
          <button>Th</button>
          <button>Fr</button>
          <button>St</button>
        </div>
      </div>
    </div>
  );
};

export default Weekly;
