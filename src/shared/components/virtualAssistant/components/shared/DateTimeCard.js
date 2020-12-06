import React from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import CalendarIcon from "../../../../../asset/images/virtual-assistant/calendar.png";
const DateTimeCard = (props) => {
  const { date, onChange, type = "start", startDateTime } = props;

  const displayDate = moment(date).format("DD/MM/YYYY");
  const time = moment(date).format("h:mm");
  return (
    <div className={`timerCard ${type}`}>
      <p className="timeLabel">
        {props.label}
        <span>
          <img src={CalendarIcon} alt="" />
        </span>
      </p>
      <div className="timer DTCardWrapper">
        <DatePicker
          minDate={startDateTime ? startDateTime : new Date()}
          selected={date}
          onChange={onChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="time"
          dateFormat="MMMM d, yyyy h:mm aa"
          popperPlacement="left"
        />
        <p className="time">{time}</p>
        <p className="date">{displayDate}</p>
      </div>
    </div>
  );
};
export default DateTimeCard;
