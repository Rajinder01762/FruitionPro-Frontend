import React, { useEffect, useState, Component } from "react";
import DatePicker from "react-datepicker";

export default () => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <div className="calendar-wrapper">
      <div className="mt-3">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          inline
        />
      </div>
    </div>
  );
};
