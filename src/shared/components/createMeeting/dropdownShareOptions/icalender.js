import {frontendUrl} from "../../../../api"
export const handleIcsDownload = (meetingData, userDetails) => {
  
  const { createMeetingData, paricipants } = meetingData;
  const {
    department,
    endDateTime,
    location,
    project_name,
    recurrenceData,
    startDateTime,
    title,
    topic
  } = createMeetingData;
  const { email, name } = userDetails;
  const url = `${frontendUrl}/view`;

  let attendee = "";
  paricipants &&
    paricipants.length > 0 &&
    paricipants.forEach(item => {
      //  let attendeeFormat='';
      if (item.email && item.name) {
        attendee += `ATTENDEE;CN="${item.name}";RSVP=TRUE:mailto:${item.email}\n`;
      } else {
        attendee += `ATTENDEE;RSVP=TRUE:mailto:${item.email}\n`;
      }
    });
//DTSTAMP:20191009T103447Z
  const formttedLines = `BEGIN:VCALENDAR
PRODID:-//Schedule a Meeting
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatDateTime(startDateTime)}
DTEND:${formatDateTime(endDateTime)}
LOCATION: ${location ||''}
UID:${getUuidv4()}
DESCRIPTION:${url}
X-ALT-DESC;FMTTYPE=text/html:${url}
SUMMARY:${title || "meeting"}
ORGANIZER;CN="${name}";SENT-BY="MAILTO:noreply@getminute.com";LANGUAGE=se:MAILTO:${email}
${attendee}
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
END:VCALENDAR
`;

  const source = "data:application/txt," + encodeURIComponent(formttedLines);
  const fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  fileDownload.href = source;
  fileDownload.download = `${title||"meeting"}.ics`;
  fileDownload.click();
  document.body.removeChild(fileDownload);
};

const getUuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hour = pad(date.getUTCHours());
  const minute = pad(date.getUTCMinutes());
  const second = pad(date.getUTCSeconds());
  return `${year}${month}${day}T${hour}${minute}${second}Z`;
};

const pad = i => {
  return i < 10 ? `0${i}` : `${i}`;
};
