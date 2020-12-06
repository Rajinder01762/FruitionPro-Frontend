import React, { useState } from "react";
import { Row, Col, Input, Button } from "reactstrap";
import cx from "classnames";
import Check from "../../../../../icons/check";
import Daily from "./daily";
import Weekly from "./weekly";
import Monthly from "./monthly";
import Yearly from "./yearly";
import RecurrenceDateTimeCard from "../../../components/shared/RecurrenceDateTimeCard";
import DatePicker from "react-datepicker";
import CalendarIcon from "../../../../../../asset/images/virtual-assistant/calendar.png";

const optionsTabs = [
  {
    id: 1,
    name: "Daily",
    component: Daily,
  },
  {
    id: 2,
    name: "Weekly",
    component: Weekly,
  },
  {
    id: 3,
    name: "Monthly",
    component: Monthly,
  },
  {
    id: 4,
    name: "Yearly",
    component: Yearly,
  },
];
const Recurrence = (props) => {
  const {} = props;
  const [selectedTab, setSelectedTab] = useState(1);
  const RenderOption = optionsTabs.filter((data) => data.id === selectedTab)[0]
    .component;
  return (
    <div className="recurrenceComponent">
      <div className="r-header">
        <h3 className="title">Recurring Meeting</h3>
        <div>
          <label className="r-toggle">
            <input type="checkbox" />
            <span className="wrapper">
              <span className="active-text">ON</span>
              <span className="inactive-active-text">OFF</span>
            </span>
          </label>
        </div>
      </div>
      <Row className="tabsRow">
        {optionsTabs.map(({ id, name }) => (
          <Col xs={3} key={id} className="px-1">
            <button
              className={cx("btn tabBtn w-100", { active: selectedTab === id })}
              onClick={() => setSelectedTab(id)}
            >
              {selectedTab === id && (
                <span className="icon">
                  <Check />
                </span>
              )}
              {name}
            </button>
          </Col>
        ))}
        {<RenderOption />}
      </Row>
      <Row className="text-white text-center mt-3 recurrence-range">
        <Col xs={12}>
          <h3>Range of Recurrence</h3>
        </Col>
        <Col xs={12} className="recurranceCard">
          <div className="pr-1">
            <RecurrenceDateTimeCard type="start" />
          </div>
          <div className="pl-1">
            <RecurrenceDateTimeCard type="end" />
          </div>
        </Col>
      </Row>
      <div className="rec-content pl-2">
        <div className="d-flex align-items-center mb-3">
          <label className="radioLabel">
            <input type="radio" name="days" />
            <span className="radioBtn"></span>
          </label>
          Enter after: <Input />
          <label className="radioLabel">
            <input type="radio" name="days" />
            <span className="radioBtn"></span>
          </label>
          No End Date
        </div>
      </div>
      <div className="text-center doneBtn-wrapper">
        <Button color="gradient" className="no-arrow">
          Done
        </Button>
      </div>
    </div>
  );
};

export default Recurrence;
