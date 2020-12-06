import React, { Component } from 'react';
import moment from "moment";
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Button
} from "reactstrap";
import notificationManager from '../../util';

class EditReccurenceMeeting extends Component {

  onSelectEditType = (value, isDisabled) => {
    if (isDisabled === true) {
      notificationManager(400, "You can change only time of recurring meetings");
      return;
    }
    const { toggle, setUpdateMeetingData, setEditAllMeetings } = this.props;
    if (value === 'all') {
      setEditAllMeetings(true)
    }
    else {
      setEditAllMeetings(false)
    }

    toggle();
    setUpdateMeetingData(value);

    // toggleUpdateModal();
    // setEditAllMeetings(true)
  }

  render() {
    const { isOpen, toggle, meetingData, allMeetings, meetingId } = this.props;
    let allMeetingsData = allMeetings && allMeetings.meetings || [];
    let meetingDetail = meetingId && allMeetingsData && allMeetingsData.length > 0 && allMeetingsData.find(meeting => {
      return meeting._id === meetingId;
    });

    let StartDate = "";
    let EndDate = "";
    let oldStartDate = "";
    let oldEndDate = "";

    let startDate = meetingDetail && meetingDetail.start_date_time && moment.utc(meetingDetail.start_date_time).toDate();
      oldStartDate = (startDate && moment(startDate).format("ll")) || "";

      let endDate =  meetingDetail && meetingDetail.end_date_time && moment.utc(meetingDetail.end_date_time).toDate();
      oldEndDate = (endDate && moment(endDate).format("ll")) || "";

      let meetingStartDate =meetingData && meetingData.startDateTime && moment.utc(meetingData.startDateTime).toDate();
      StartDate = (meetingStartDate && moment(meetingStartDate).format("ll")) || "";

      let meetingEndDate =meetingData && meetingData.endDateTime && moment.utc(meetingData.endDateTime).toDate();
      EndDate = (meetingEndDate && moment(meetingEndDate).format("ll")) || "";

      let isDisabled = false;
    if (StartDate && EndDate && oldStartDate && oldEndDate) {
      if (StartDate === oldStartDate && EndDate === oldEndDate) {
        isDisabled = false;
      }
      else {
        isDisabled = true
      }
    }

    return (
      <Modal
        isOpen={isOpen}
        toggle={toggle}
      >
        <ModalHeader toggle={toggle} style={{ textAlign: 'center' }}>
          Reccurence Meeting
            </ModalHeader>
        <ModalBody>
          <div className="freeTrial">
            <h3 className="heading">Do you want to save changes to this meeting or subsequent recurring meetings.</h3>
            <p></p>
          </div>

          <div className="form-group text-center mt-5">
            <Button
              className="trialBtn bs-planw"
              onClick={() => {
                this.onSelectEditType('only')
              }}
            >
              Only this
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button
              // disabled={isDisabled}
              className="trialBtn bs-planw"
              onClick={() => {
                this.onSelectEditType('all', isDisabled)
              }}
            >
              Update All
                </Button>
          </div>
        </ModalBody>
      </Modal>
    )
  }
}

export default EditReccurenceMeeting;
