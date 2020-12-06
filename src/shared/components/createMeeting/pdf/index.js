import React, { Component } from "react";
import { Container } from "reactstrap";
import Agenda from "./agenda";
import Documents from "./documents";
import MeetingsSample from "./meetingsSample";
import Notes from "./notes";
import Participants from "./participants";
import Logo from "./logo";

export default class CreateMeeting extends Component {
  render() {
    const { dataToPrint } = this.props;
    const {
      createMeetingData,
      paricipants,
      agendaItems,
      documents,
      meetingNotes
    } = dataToPrint;

    const pageTitle = {
      textTransform: "capitalize",
      fontSize: "20px",
      fontFamily: "Raleway",
      fontWeight: "700",
      color: "rgb(41, 197, 236)",
      textAlign: "center",
      borderBottom: "2px solid rgb(41, 197, 236)",
      paddingBottom: "10px"
    }

    const tableStyle = {
      width: "100%",
      marginBottom: "30px",
      fontFamily: "Raleway",
      borderCollapse: "collapse",
      borderSpacing: '0',
      border: 'none'
    }

    return (
      <div style={{ padding: "20px" }}>
        <Container>
          <table style={tableStyle}>
            <tr>
              <td style={pageTitle}>Meetings Summary</td>
            </tr>
          </table>
          <MeetingsSample details={createMeetingData} />
          {paricipants && paricipants.length > 0 && (
            <Participants paricipants={paricipants} adminEmail = {createMeetingData.adminEmail}/>
          )}
          {agendaItems && agendaItems.length > 0 && (
            <Agenda agendaItems={agendaItems} createMeetingData={createMeetingData} />
          )}
          {documents && documents.length > 0 && (
            <Documents documents={documents} />
          )}
          {meetingNotes && <Notes notes={meetingNotes} />}
          {/* <Logo /> */}
        </Container>
      </div>
    );
  }
}
