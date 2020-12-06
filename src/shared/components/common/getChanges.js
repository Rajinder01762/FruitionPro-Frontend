import { diff } from "deep-diff";
import _ from "lodash";
import moment from "moment";

export const calculateDifference = (meetingDetail, oldParticipants) => {
  const updatedBits = [];
  const unWantedInMeetingDetail = [
    "canEdit",
    "isAdmin",
    "meetingStatus",
    "status",
    "isCreate",
    "editAllMeetings",
  ];
  const unWantedInCreateMeetingData = [
    "recurrenceData",
    "isMeetingClosed",
    "adminEmail",
    "meetingId",
    "attendees",
  ];
  const oldData = _.omit(
    { ...meetingDetail.oldMeetingData, paricipants: oldParticipants },
    unWantedInMeetingDetail
  );
  const newData = _.omit(meetingDetail, [
    "oldMeetingData",
    ...unWantedInMeetingDetail,
  ]);

  const oldObj = {
    ...oldData,
    createMeetingData: {
      ..._.omit(oldData.createMeetingData, unWantedInCreateMeetingData),
      startDateTime: moment(oldData.createMeetingData.startDateTime).format(),
      endDateTime: moment(oldData.createMeetingData.endDateTime).format(),
    },
  };
  const newObj = {
    ...newData,
    createMeetingData: {
      ..._.omit(newData.createMeetingData, unWantedInCreateMeetingData),
      startDateTime: moment(newData.createMeetingData.startDateTime).format(),
      endDateTime: moment(newData.createMeetingData.endDateTime).format(),
    },
  };
  const difference = diff({ ...oldObj }, { ...newObj });
  if (difference && difference.length > 0) {
    for (let item of difference) {
      const { path } = item;
      let value = "";
      if (item.kind !== "D" && path) {
        let len = path.length;
        if (len > 0) {
          switch (len) {
            case 1:
            case 3:
            case 4:
              value = path[0];
              break;
            case 2:
              value = path[1];
          }
        }
      }
      if (value) {
        switch (value) {
          // case 'paricipants':
          // 	const ind = updatedBits.indexOf('participants');
          // 	if (ind === -1) updatedBits.push('participants');
          // 	break;
          case "meetingNotes":
            updatedBits.push("notes");
            break;
          case "agendaItems":
            const index = updatedBits.indexOf("agendas");
            if (index === -1) updatedBits.push("agendas");
            break;
          default:
            updatedBits.push(value);
        }
      }
    }
  }
  return { updatedBits, difference };
};
