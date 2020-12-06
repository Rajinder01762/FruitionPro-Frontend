
import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import moment from "moment"

const Months = [
  { maxValue: 31, value: 1, label: "January" },
  { maxValue: new Date().getFullYear() % 4 === 0 ? 29 : 28, value: 2, label: "February" },
  { maxValue: 31, value: 3, label: "March" },
  { maxValue: 30, value: 4, label: "April" },
  { maxValue: 31, value: 5, label: "May" },
  { maxValue: 30, value: 6, label: "June" },
  { maxValue: 31, value: 7, label: "July" },
  { maxValue: 31, value: 8, label: "August" },
  { maxValue: 30, value: 9, label: "September" },
  { maxValue: 31, value: 10, label: "October" },
  { maxValue: 30, value: 11, label: "November" },
  { maxValue: 31, value: 12, label: "December" },
]
class RecurringModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRadioOn: false,
      checked: true,
      error: {},
      type: 'Daily',
      Daily: {},
      Weekly: {},
      Monthly: {},
      Yearly: {},
      Range: {},
    }
  }
  componentDidMount() {
    const { recurrenceData } = this.props

    if (recurrenceData) {
      this.setState({ ...recurrenceData });
    }

  }
  resetState = () => {
    this.setState({
      isRadioOn: true,
      error: {},
      type: 'Daily',
      Daily: {},
      Weekly: {},
      Monthly: {},
      Yearly: {},
      Range: {},
    })
  }
  onSelectRecurrence = (value) => {
    if (value === 'Daily') {
      this.setState({
        Weekly: {},
        Monthly: {},
        Yearly: {},
      })
    }
    if (value === 'Weekly') {
      this.setState({
        Daily: {},
        Monthly: {},
        Yearly: {},
      })
    }
    if (value === 'Monthly') {
      this.setState({
        Weekly: {},
        Daily: {},
        Yearly: {},
      })
    }
    if (value === 'Yearly') {
      this.setState({
        Weekly: {},
        Monthly: {},
        Daily: {},
      })
    }
    this.setState({
      type: value
    })
  }
  onUpdate(type, key, value) {

    const oldData = this.state[type];
    const newData = {
      ...oldData,
      [key]: value
    }
    this.setState({ [type]: newData });
  }
  validateDailyRecurence = () => {
    const { DailyRadio, dailyDays } = this.state.Daily;
    let error = { DailyRadio: false, dailyDays: false }

    let isError = false;
    if (DailyRadio === undefined) {
      error.DailyRadio = true;
      isError = true;
    }
    if (DailyRadio === 'dailyEvery') {
      if (dailyDays === undefined || dailyDays === '') {
        error.dailyDays = true;
        isError = true;
      } else {
        const dailyNumber = Number(dailyDays)
        if (isNaN(dailyNumber) || (dailyNumber > 366 || dailyNumber < 1)) {
          error.dailyDays = true;
          isError = true;
        }
      }
    }
    this.setState({ error });
    return isError;
  }
  validateWeeklyRecurence = () => {
    const { weekendDays, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday } = this.state.Weekly;
    let error = { weekendDays: false, isDaysSelected: false }
    let isError = false;
    if (weekendDays === undefined || weekendDays === '') {
      error.weekendDays = true;
      isError = true;
    } else {
      const weekendNumber = Number(weekendDays)
      if (isNaN(weekendNumber) || (weekendNumber > 50 || weekendNumber < 1)) {
        error.weekendDays = true;
        isError = true;
      }
    }
    let isDaysSelected = Sunday || Monday || Tuesday || Wednesday || Thursday || Friday || Saturday;
    if (isDaysSelected === true) {
      error.isDaysSelected = false;
    }
    else {
      error.isDaysSelected = true;
      isError = true;
    }
    this.setState({ error });
    return isError;
  }
  validateMonthlyRecurence = () => {
    const { MonthlyRadio, monthlyDay, monthlyMonth, selectDate, selectDay, monthlySelectMonthField } = this.state.Monthly;
    let error = {
      monthlySelectedDay: false,
      monthlySelectMonth: false,
      selectDate: false,
      selectDay: false,
      monthlySelectMonthField: false,
    }
    let isError = false;
    if (MonthlyRadio === undefined) {
      error.MonthlyRadio = true;
      isError = true;
    }
    if (MonthlyRadio === 'monthlySelectedDay') {
      if (monthlyDay === undefined || monthlyDay === '') {
        error.monthlyDay = true;
        isError = true;
      } else {
        const monthDayNumber = Number(monthlyDay)
        if (isNaN(monthDayNumber) || (monthDayNumber > 31 || monthDayNumber < 1)) {
          error.monthlyDay = true;
          isError = true;
        }
      }
      if (monthlyMonth === undefined || monthlyMonth === '') {
        error.monthlyMonth = true;
        isError = true;
      } else {
        const monthNumber = Number(monthlyMonth)
        if (isNaN(monthNumber) || (monthNumber > 12 || monthNumber < 1)) {
          error.monthlyMonth = true;
          isError = true;
        }
      }
    }

    if (MonthlyRadio === 'monthlySelectMonth') {
      if (selectDate === undefined || selectDate === '') {
        error.selectDate = true;
        isError = true;
      }
      if (selectDay === undefined || selectDay === '') {
        error.selectDay = true;
        isError = true;
      }
      if (monthlySelectMonthField === undefined || monthlySelectMonthField === '') {
        error.monthlySelectMonthField = true;
        isError = true;
      }
    }
    this.setState({ error });
    return isError;
  }
  validateYearlyRecurence = () => {
    const { yearlySelectYear, YearlyRadio, yearlySelectMonth, yearlySelectMonthField, yearlyNumber, yearlyWeek, yearlyMonth } = this.state.Yearly;
    let error = {
      yearlySelectYear: false,
      YearlyRadio: false,
      yearlySelectMonth: false,
      yearlySelectMonthField: false,
      yearlyNumber: false,
      yearlyWeek: false,
      yearlyMonth: false
    }

    let isError = false;
    if (yearlySelectYear === undefined || yearlySelectYear === '') {
      error.yearlySelectYear = true;
      isError = true;
    } else {
      const yearNumber = Number(yearlySelectYear)
      if (isNaN(yearNumber) || (yearNumber > 10 || yearNumber < 1)) {
        error.yearlySelectYear = true;
        isError = true;
      }
    }
    if (YearlyRadio === undefined) {
      error.YearlyRadio = true
      isError = true;
    }
    if (YearlyRadio === 'yearlyFirstRadio') {
      if (yearlySelectMonth === undefined || yearlySelectMonth === '') {
        error.yearlySelectMonth = true;
        isError = true;
      }
      if (yearlySelectMonthField === undefined || yearlySelectMonthField === '') {
        error.yearlySelectMonthField = true;
        isError = true;
      } else {
        const yearMonthNumber = Number(yearlySelectMonthField)
        const maxValue = this.getMonthMaxValue(Number(yearlySelectMonth))
        if (isNaN(yearMonthNumber) || (yearMonthNumber > maxValue || yearMonthNumber < 1)) {
          error.yearlySelectMonthField = true;
          isError = true;
        }
      }
    }
    if (YearlyRadio === 'yearlySecondRadio') {
      if (yearlyNumber === undefined || yearlyNumber === '') {
        error.yearlyNumber = true;
        isError = true;
      }
      if (yearlyWeek === undefined || yearlyWeek === '') {
        error.yearlyWeek = true;
        isError = true;
      }
      if (yearlyMonth === undefined || yearlyMonth === '') {
        error.yearlyMonth = true;
        isError = true;
      }
    }
    this.setState({
      error
    })
    return isError;
  }
  isFutureOrGreaterDate = (firstDate, selectedDate) => {
    const todayDate = moment(firstDate).format('YYYY/MM/DD');
    const compareDate = moment(selectedDate).format('YYYY/MM/DD');
    var a = moment(todayDate)
    var b = moment(compareDate)
    return b.diff(a) >= 0;
  }
  onRecurrence = () => {
    const { meetingStartDate } = this.props;
    const { type } = this.state;
    const { reccurenceStartDate, reccurenceEndDate, rangeRadio, EndAfterText } = this.state.Range;
    let error = {
      reccurenceStartDate: false,
      rangeRadio: false,
      reccurenceEndDate: false,
      EndAfterText: false,
      isPastReccurenceError: false
    };
    if (type && type !== '') {
      if (type === 'Daily') {
        if (this.validateDailyRecurence()) {
          return;
        }
      }
      else if (type === 'Weekly') {
        if (this.validateWeeklyRecurence()) {
          return;
        }
      }
      else if (type === 'Monthly') {
        if (this.validateMonthlyRecurence()) {
          return;
        }
      }
      else if (type === 'Yearly') {
        if (this.validateYearlyRecurence()) {
          return;
        }
      }
    }
    if (reccurenceStartDate === undefined) {
      error.reccurenceStartDate = true;
    }
    else {
      const today = new Date().getTime();

      if (!this.isFutureOrGreaterDate(today, reccurenceStartDate)) {
        error.reccurenceStartDate = true;
      } else {
        if (meetingStartDate && !this.isFutureOrGreaterDate(meetingStartDate, reccurenceStartDate)) {
          error.isPastReccurenceError = true;
        }
      }

    }
    if (rangeRadio === undefined) {
      error.rangeRadio = true
    }
    if (rangeRadio === 'EndByRadio') {
      if (reccurenceEndDate === undefined) {
        error.reccurenceEndDate = true
      } else {

        if (!this.isFutureOrGreaterDate(reccurenceStartDate, reccurenceEndDate)) {
          error.reccurenceEndDate = true;
        }
      }
    }
    if (rangeRadio === 'EndAfterRadio') {
      if (EndAfterText === undefined) {
        error.EndAfterText = true
      } else {
        const endNumber = Number(EndAfterText)
        if (isNaN(endNumber) || (endNumber > 100 || endNumber < 1)) {
          error.EndAfterText = true;
        }
      }
    }
    this.setState({ error });
    if (!error.reccurenceStartDate && !error.reccurenceEndDate && !error.rangeRadio && !error.EndAfterRadio && !error.EndAfterText) {
      const { isRadioOn, checked, error, Daily, type, Weekly, Monthly, Yearly } = this.state;
      const { reccurenceStartDate, reccurenceEndDate, rangeRadio, EndAfterText } = this.state.Range;


      const obj = {
        isRadioOn,
        checked,
        error,
        type,
        Daily,
        Weekly,
        Monthly,
        Yearly,
        Range: {
          reccurenceStartDate: reccurenceStartDate,
          reccurenceEndDate: reccurenceEndDate && reccurenceEndDate,
          rangeRadio,
          EndAfterText
        },
      }
      this.props.getRecurrenceData(obj)
      this.props.toggle();
      this.props.toggleRecurrence(true);
    }
  }
  getMonthMaxValue = (value) => {
    if (value) {
      const monthData = Months.find(monthItem => monthItem.value === value)
      if (monthData)
        return monthData.maxValue;
    }
    return 30
  }
  onCloseRecurrence = (e) => {
    const { toggleRecurrence, toggle, getRecurrenceData } = this.props;
    e.preventDefault();
    this.setState({
      Daily: {},
      Weekly: {},
      Monthly: {},
      Yearly: {},
      type: 'Daily',
      error: {},
      Range: {},
      isRadioOn: true
    })
    getRecurrenceData(null)
    toggle();
    toggleRecurrence(this.state.isRadioOn);
  }
  onToggleRecurrence = (e) => {
    const { toggleRecurrence } = this.props
    e.preventDefault();

    this.setState({
      isRadioOn: !this.state.isRadioOn
    })
    toggleRecurrence(this.state.isRadioOn);
  }

  render() {
    const { isRadioOn, error, Daily, Weekly, Monthly, Yearly, Range } = this.state;
    const Numbers = [
      { value: 1, label: 'First' },
      { value: 2, label: 'Second' },
      { value: 3, label: 'Third' },
      { value: 4, label: 'Fourth' }
    ]
    const Weeks = [
      { value: 0, label: "Sunday" },
      { value: 1, label: "Monday" },
      { value: 2, label: "Tuesday" },
      { value: 3, label: "Wednesday" },
      { value: 4, label: "Thursday" },
      { value: 5, label: "Friday" },
      { value: 6, label: "Saturday" },
    ]
    return (
      <div>
        <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className="recurring-modal create-meeting-modal modal-dialog-centered">
          <ModalHeader toggle={this.props.toggle}>Recurrence
          <span className="mt-0">
              <div className={`switch ${!isRadioOn ? 'active' : ''}`} onClick={(e) => this.onToggleRecurrence(e)}>
                <div className="switch-input" type="checkbox" ></div>
                <div className="switch-label" data-on="Off" data-off="On"></div>
                <div className="switch-handle"></div>
              </div>
            </span>
          </ModalHeader>
          <ModalBody className={`${isRadioOn ? 'isDisabled' : ''}`}>
            <div className="recurrence-section">
              <h4>Recurrence Pattern</h4>
              <div className="pattern-wrap">
                <div className="pattern-radio">
                  <FormGroup tag="fieldset">
                    <FormGroup>
                      <Input disabled={true} type="radio" value="Daily" name="daily" checked={this.state.type === 'Daily'} onChange={e => this.onSelectRecurrence(e.target.value)} />
                      <Label disabled={true} className="radio-icon" onClick={() => this.onSelectRecurrence('Daily')}>Daily</Label>
                    </FormGroup>
                    <FormGroup>
                      <Input disabled={true} type="radio" value="Weekly" name="weekly" checked={this.state.type === 'Weekly'} onChange={e => this.onSelectRecurrence(e.target.value)} />
                      <Label className="radio-icon" onClick={e => this.onSelectRecurrence('Weekly')}>Weekly</Label>
                    </FormGroup>
                    <FormGroup>
                      <Input disabled={true} type="radio" value="Monthly" name="monthly" checked={this.state.type === 'Monthly'} onChange={e => this.onSelectRecurrence(e.target.value)} />
                      <Label className="radio-icon" onClick={e => this.onSelectRecurrence('Monthly')}>Monthly</Label>
                    </FormGroup>
                    <FormGroup>
                      <Input disabled={true} type="radio" value="Yearly" name="yearly" checked={this.state.type === 'Yearly'} onChange={e => this.onSelectRecurrence(e.target.value)} />
                      <Label className="radio-icon" onClick={e => this.onSelectRecurrence('Yearly')}>Yearly</Label>
                    </FormGroup>
                  </FormGroup>
                </div>
                {this.state.type === 'Daily' &&
                  <div className="pattern-content">
                    <FormGroup className="every-pattern">
                      <div className="d-flex align-items-center">
                        <Input type="radio" name="days" checked={Daily.DailyRadio === 'dailyEvery'} value="dailyEvery" onChange={(e) => this.onUpdate('Daily', 'DailyRadio', e.target.value)} />
                        <Label className="radio-icon mb-0" onClick={(e) => this.onUpdate('Daily', 'DailyRadio', "dailyEvery")}>Every</Label>
                        <Input type="text" maxLength={3} name="dailyDays" value={Daily.dailyDays || ''} disabled={Daily.DailyRadio !== 'dailyEvery'} id="days" onChange={(e) => this.onUpdate('Daily', 'dailyDays', e.target.value)} /><Label className="mb-0">day(s)</Label></div>
                      {error.dailyDays === true && <span className="text-danger">Enter a valid number between 1 and 366</span>}
                    </FormGroup>
                    <FormGroup>
                      <div onClick={() => {
                        this.setState({ Daily: {} }, () => this.onUpdate('Daily', 'DailyRadio', "dailyEveryWeekend"))
                      }}>
                        <Input type="radio" name="days" checked={Daily.DailyRadio === 'dailyEveryWeekend'} value="dailyEveryWeekend" />
                        <Label className="radio-icon mt-2">Every Weekday</Label>
                      </div>
                    </FormGroup>
                    {(error.DailyRadio) && <span className="text-danger">Please select one field</span>}
                  </div>}
                {this.state.type === 'Weekly' && <div className="pattern-content week-content">
                  <FormGroup className="every-pattern">
                    <Label className="d-flex align-items-center">Recur every<Input
                      type="text"
                      maxLength={2}
                      name="days" id="days"
                      value={Weekly.weekendDays || ''} onChange={(e) => this.onUpdate('Weekly', 'weekendDays', e.target.value)}
                    />week(s) on</Label>
                    {error.weekendDays && <span className="text-danger">Enter a valid week number between 1 and 50</span>}

                  </FormGroup>
                  <div className="weeks-name d-flex align-items-center flex-wrap mt-3">
                    <FormGroup>
                      <Input type="checkbox" checked={Weekly.Sunday} />
                      <Label className="checkbox-icon" onClick={(e) => this.onUpdate('Weekly', 'Sunday', !Weekly.Sunday)}>Sunday</Label>
                    </FormGroup>
                    <FormGroup>
                      <Input type="checkbox" checked={Weekly.Monday} />
                      <Label className="checkbox-icon" onClick={(e) => this.onUpdate('Weekly', 'Monday', !Weekly.Monday)}>Monday</Label >
                    </FormGroup>
                    <FormGroup>
                      <Input type="checkbox" checked={Weekly.Tuesday} />
                      <Label className="checkbox-icon" onClick={(e) => this.onUpdate('Weekly', 'Tuesday', !Weekly.Tuesday)}>Tuesday</Label>
                    </FormGroup>
                    <FormGroup>
                      <Input type="checkbox" checked={Weekly.Wednesday} />
                      <Label className="checkbox-icon" onClick={() => this.onUpdate('Weekly', 'Wednesday', !Weekly.Wednesday)}>Wednesday</Label>
                    </FormGroup>
                    <FormGroup>
                      <Input type="checkbox" checked={Weekly.Thursday} />
                      <Label className="checkbox-icon" onClick={() => this.onUpdate('Weekly', 'Thursday', !Weekly.Thursday)}>Thursday</Label>
                    </FormGroup>
                    <FormGroup>
                      <Input type="checkbox" checked={Weekly.Friday} />
                      <Label className="checkbox-icon" onClick={() => this.onUpdate('Weekly', 'Friday', !Weekly.Friday)}>Friday</Label>
                    </FormGroup>
                    <FormGroup >
                      <Input type="checkbox" checked={Weekly.Saturday} />
                      <Label className="checkbox-icon" onClick={() => this.onUpdate('Weekly', 'Saturday', !Weekly.Saturday)}>Saturday</Label>
                    </FormGroup>
                  </div>
                  {!error.isDaysSelected === false && !error.weekendDays && <span className="text-danger">Please select day(s)</span>}
                </div>}
                {this.state.type === 'Monthly' && <div className="pattern-content month-content">
                  <Row>
                    <FormGroup className="every-pattern">
                      <div className="monthly-outer">
                        <Input type="radio" name="monthlySelectedDay" checked={Monthly.MonthlyRadio === 'monthlySelectedDay'} value="monthlySelectedDay" />
                        {/* <div className="monthly-div-one"> */}
                        <Label className="radio-icon" onClick={() => {
                          this.setState({ Monthly: {} }, () => this.onUpdate('Monthly', 'MonthlyRadio', 'monthlySelectedDay'))
                        }}>Day</Label>
                        {/* </div> */}
                        <div className="monthly-div-two">
                          <div className="inner-monthly-div-two d-flex align-items-center">
                            <Input disabled={Monthly.MonthlyRadio !== 'monthlySelectedDay'} type="text" name="days" maxLength={2} id="days" value={Monthly.monthlyDay || ''} onChange={(e) => this.onUpdate('Monthly', 'monthlyDay', e.target.value)} />
                            <Label>Of every</Label>
                          </div>
                          <div className="inner-monthly-div-two d-flex align-items-center">
                            <Input disabled={Monthly.MonthlyRadio !== 'monthlySelectedDay'} type="text" maxLength={2} name="month" id="month" value={Monthly.monthlyMonth || ''} onChange={(e) => this.onUpdate('Monthly', 'monthlyMonth', e.target.value)} />
                            <Label className="lb-width">month(s)</Label><br />
                          </div>
                        </div>
                      </div>
                      {error.monthlyDay && <span className="text-danger">Enter a valid day between 1 and 31</span>}
                      {error.monthlyMonth && !error.monthlyDay && <span className="text-danger">Enter a valid month between 1 and 12</span>}
                    </FormGroup>
                  </Row>
                  <Row>
                    <FormGroup className="every-pattern mt-2">
                      <div className="monthly-outer">
                        <Input type="radio" name="monthlySelectMonth" checked={Monthly.MonthlyRadio === 'monthlySelectMonth'} value="monthlySelectMonth" />

                        {/* <div className="sec-monthly-div-one"> */}
                        <Label className="radio-icon" onClick={() => {
                          this.setState({ Monthly: {} }, () => this.onUpdate('Monthly', 'MonthlyRadio', 'monthlySelectMonth'))
                        }
                        }>The</Label>
                        {/* </div> */}
                        <div className="sec-monthly-div-two">
                          <div className="inner-sec-monthly-div-fst">
                            <Select isDisabled={Monthly.MonthlyRadio !== 'monthlySelectMonth'} className="pattern-select ml-2 ml-sm-3 mr-2" value={Numbers.filter(option => option.value === Monthly.selectDate)} onChange={(e) => this.onUpdate('Monthly', 'selectDate', e.value)} options={Numbers} classNamePrefix="pattern" />
                            <Select isDisabled={Monthly.MonthlyRadio !== 'monthlySelectMonth'} className="pattern-select mr-3 ml-2" value={Weeks.filter(option => option.value === Monthly.selectDay)} onChange={(e) => this.onUpdate('Monthly', 'selectDay', e.value)} options={Weeks} classNamePrefix="pattern" />
                          </div>
                          <div className="inner-sec-monthly-div-scnd">
                            <Label className="lb-width">of every</Label>
                            <Input disabled={Monthly.MonthlyRadio !== 'monthlySelectMonth'} type="text" maxLength={2} name="month" id="month" value={Monthly.monthlySelectMonthField || ''} onChange={(e) => this.onUpdate('Monthly', 'monthlySelectMonthField', e.target.value)}
                            /><Label>month(s)</Label><br />
                          </div>
                        </div>
                      </div>
                    </FormGroup>
                    {error.selectDate && <span className="text-danger">Please select value</span>}
                    {error.selectDay && !error.selectDate && <span className="text-danger">Please select day of week</span>}
                    {error.monthlySelectMonthField && !error.selectDay && !error.selectDate && <span className="text-danger">Enter a valid month between 1 and 12</span>}
                    {error.MonthlyRadio && <span className="text-danger">Please select one</span>}
                  </Row>
                </div>}
                {this.state.type === 'Yearly' && <div className="pattern-content yearly-content">
                  <Row>
                    <FormGroup className="every-pattern">
                      <div className="d-flex align-items-center"><Label className="lb-recur-w">Recur every</Label>
                        <Input type="text" className="input-yearly" maxLength={2} name="days" id="days" value={Yearly.yearlySelectYear} onChange={(e) => this.onUpdate('Yearly', 'yearlySelectYear', e.target.value)} /><Label>year(s)</Label>
                      </div>
                      {error.yearlySelectYear && <span className="text-danger">Enter a valid year number between 1 and 10</span>}
                    </FormGroup>
                  </Row>
                  <Row>
                    <FormGroup className="every-pattern ml-3 mt-2">
                      <div className="d-flex align-items-center">
                        <Input type="radio" name="yearlyFirstRadio" onChange={() => {
                          this.setState({ Yearly: { yearlySelectYear: Yearly.yearlySelectYear } }, () => this.onUpdate('Yearly', 'YearlyRadio', 'yearlyFirstRadio'))
                        }
                        } checked={Yearly.YearlyRadio === 'yearlyFirstRadio'} value="yearlyFirstRadio" />
                        <Label className="radio-icon" onClick={() => this.setState({ Yearly: { yearlySelectYear: Yearly.yearlySelectYear } }, () => this.onUpdate('Yearly', 'YearlyRadio', 'yearlyFirstRadio'))}>On</Label>
                        <Select isDisabled={Yearly.YearlyRadio !== 'yearlyFirstRadio'} className="pattern-select ml-3" value={Months.filter(option => option.value === Yearly.yearlySelectMonth)} onChange={(e) => this.onUpdate('Yearly', 'yearlySelectMonth', e.value)} options={Months} classNamePrefix="pattern" />
                        <Input disabled={Yearly.YearlyRadio !== 'yearlyFirstRadio'} maxLength={this.getMonthMaxValue(Yearly.yearlySelectMonth)} type="text" name="month" id="month" value={Yearly.yearlySelectMonthField || ''} onChange={(e) => this.onUpdate('Yearly', 'yearlySelectMonthField', e.target.value)} />
                      </div>
                    </FormGroup>
                  </Row>
                  {error.yearlySelectMonth && <span className="text-danger">Please select a month</span>}
                  {error.yearlySelectMonthField && !error.yearlySelectMonth && <span className="text-danger">{`Enter a valid month number between 1 and ${this.getMonthMaxValue(Yearly.yearlySelectMonth)}`}</span>}
                  <Row>
                    <FormGroup className="every-pattern ml-3 mt-2">
                      <div className="d-flex align-items-start">
                        <Input type="radio" name="yearlySecondRadio" onChange={(e) => {
                          this.setState({ Yearly: { yearlySelectYear: Yearly.yearlySelectYear } }, () => this.onUpdate('Yearly', 'YearlyRadio', 'yearlySecondRadio'))
                        }
                        }

                          checked={Yearly.YearlyRadio === 'yearlySecondRadio'}
                          value="yearlySecondRadio" />
                        {/* <div className="sec-yearly-div-one"> */}
                        <Label className="radio-icon" onClick={() => this.setState({ Yearly: { yearlySelectYear: Yearly.yearlySelectYear } }, () => this.onUpdate('Yearly', 'YearlyRadio', 'yearlySecondRadio'))}>On</Label>
                        {/* </div> */}
                        <div className="sec-yearly-div-two">
                          <div className="inner-yearly-one">
                            <Select isDisabled={Yearly.YearlyRadio !== 'yearlySecondRadio'} className="pattern-select ml-3 mr-1" value={Numbers.filter(option => option.value === Yearly.yearlyNumber)} onChange={(e) => this.onUpdate('Yearly', 'yearlyNumber', e.value)} options={Numbers} classNamePrefix="pattern" />
                            <Select isDisabled={Yearly.YearlyRadio !== 'yearlySecondRadio'} className="pattern-select ml-1 mr-3" value={Weeks.filter(option => option.value === Yearly.yearlyWeek)} onChange={(e) => this.onUpdate('Yearly', 'yearlyWeek', e.value)} options={Weeks} classNamePrefix="pattern" />
                          </div>
                          <div className="inner-yearly-two">
                            <Label>of</Label>
                            <Select isDisabled={Yearly.YearlyRadio !== 'yearlySecondRadio'} className="pattern-select ml-3 mr-2" value={Months.filter(option => option.value === Yearly.yearlyMonth)} onChange={(e) => this.onUpdate('Yearly', 'yearlyMonth', e.value)} options={Months} classNamePrefix="pattern" />
                          </div>
                        </div>
                      </div>
                    </FormGroup>
                    {(error.yearlyNumber || error.yearlyWeek || error.yearlyMonth) && <span className="text-danger">All fields are required</span>}
                  </Row>
                  {error.YearlyRadio && !error.yearlySelectYear && <span className="text-danger">Please select any  option</span>}
                </div>
                }
              </div>
              <div className="recurrence-section">
                <h4>Range of Recurrence</h4>
                <Row>
                  <Col sm="6">
                    <FormGroup className="d-flex align-items-center dates ml-3">
                      <Label for="startDate" className="lb-strt required">Start</Label>
                      <DatePicker
                        selected={Range.reccurenceStartDate ? new Date(Range.reccurenceStartDate) : ''}
                        onChange={(date) => this.onUpdate("Range", 'reccurenceStartDate', date)}
                        showTimeInput={false}
                        dateFormat="d/MM/yyyy"
                        placeholderText="Start date"
                        className="form-control date"
                        minDate={moment().toDate()}
                      />
                    </FormGroup>
                    {error.reccurenceStartDate && <span className="text-danger">Please select a valid future date</span>}
                    {!error.reccurenceStartDate && error.isPastReccurenceError && <span className="text-danger">Reccurence start date should be equal or greater than meeting start date</span>}
                  </Col>
                  <Col sm="6">
                    <div className="range-wrap">
                      <div className="">
                        <FormGroup className="d-flex align-items-center dates ml-3">
                          <div onClick={() => this.setState({ Range: { reccurenceStartDate: Range.reccurenceStartDate } }, () => this.onUpdate("Range", 'rangeRadio', 'EndByRadio'))}>
                            <Input type="radio" name="radio4" value="EndByRadio" checked={Range.rangeRadio === 'EndByRadio'} />
                            <Label className="radio-icon">End By:</Label>
                          </div>
                          <DatePicker
                            disabled={Range.rangeRadio !== 'EndByRadio'}
                            selected={Range.reccurenceEndDate ? new Date(Range.reccurenceEndDate) : ''}
                            onChange={(date) => this.onUpdate("Range", 'reccurenceEndDate', date)}
                            showTimeInput={false}
                            dateFormat="d/MM/yyyy"
                            placeholderText="End date"
                            className="form-control date"
                            minDate={moment().toDate()}
                          />
                        </FormGroup>
                        {error.reccurenceEndDate && <span className="text-danger">Enter a valid end date and should be greater than start date</span>}
                        <FormGroup className="d-flex align-items-center every-pattern ml-3">
                          <div onClick={() =>
                            this.setState({ Range: { reccurenceStartDate: Range.reccurenceStartDate } }, () => this.onUpdate("Range", 'rangeRadio', 'EndAfterRadio'))
                          }>
                            <Input type="radio" name="radio4" value="EndAfterRadio" checked={Range.rangeRadio === 'EndAfterRadio'}
                            />
                            <Label className="radio-icon"
                            > End after:</Label>
                          </div>
                          <Input maxLength={3} type="text" value={Range.EndAfterText || ''} disabled={Range.rangeRadio !== 'EndAfterRadio'} onChange={(e) => this.onUpdate("Range", 'EndAfterText', e.target.value)} />
                          <Label >Occurences </Label>
                        </FormGroup>
                        {error.EndAfterText && <span className="text-danger">Enter a valid number between 1 and 100</span>}
                        <FormGroup className="ml-3">
                          <div onClick={() => this.setState({ Range: { reccurenceStartDate: Range.reccurenceStartDate } }, () => this.onUpdate("Range", 'rangeRadio', 'NoEndRadio'))}>
                            <div onClick={() => this.setState({ Range: { reccurenceStartDate: Range.reccurenceStartDate } }, () => this.onUpdate("Range", 'rangeRadio', 'NoEndRadio'))}>
                              <Input type="radio" name="radio4" value="NoEndRadio" checked={Range.rangeRadio === 'NoEndRadio'} />
                              <Label className="radio-icon" >No End Date
                          </Label>
                            </div></div>
                        </FormGroup>
                        {error.rangeRadio && !error.reccurenceStartDate && <span className="text-danger">Please select any option</span>}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="submitted-btn">
                <Button onClick={(e) => this.onRecurrence(e)}>Ok</Button>
                <Button onClick={(e) => this.onCloseRecurrence(e)}>Cancel</Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default RecurringModal;

