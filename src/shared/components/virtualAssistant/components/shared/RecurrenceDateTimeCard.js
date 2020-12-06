import React from "react";
import cx from "classnames";
import moment from "moment";
import DatePicker from "react-datepicker";
import DateCalendar from "../../../../../asset/images/virtual-assistant/dateCalendar.png";
const RecurrenceDateTimeCard = (props) => {
  const { date, onDateChange, type = "start" } = props;

  const displayDate = moment(date).format("DD/MM/YYYY");
  const time = moment(date).format("h:mm");
  return (
    <div className={`timerCard ${type}`}>
      <p className="timeLabel justify-content-center">Start Date</p>
      <div className="timer DTCardWrapper">
        <DatePicker
          selected={date}
          onChange={onDateChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="time"
          dateFormat="MMMM d, yyyy h:mm aa"
          popperPlacement="left"
        />
        <img src={DateCalendar} />
      </div>
    </div>
  );
};
export default RecurrenceDateTimeCard;
