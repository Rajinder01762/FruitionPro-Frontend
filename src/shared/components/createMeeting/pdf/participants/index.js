import React, { Component } from "react";
import _ from "lodash"
// import { Button, Label, Container } from "reactstrap";

export default class Participants extends Component {
  render() {
    const { paricipants, adminEmail } = this.props;
    const paricipantsByAttendance = _.mapValues(
      _.groupBy(paricipants, "is_present"),
      clist => clist.map(paricipant => paricipant)
    );
    const present = paricipantsByAttendance["true"] ? paricipantsByAttendance["true"] : [];
    const absent = paricipantsByAttendance["false"] ? paricipantsByAttendance["false"] : [];
    const index = absent.findIndex(item => item.email === adminEmail)
    if (index > -1) absent.splice(index, 1)
    present.push({ email: adminEmail });
    const titleStyle = {
      textTransform: "capitalize",
      fontSize: "16px",
      fontFamily: "raleway",
      fontWeight: "700",
      color: "rgb(43, 43, 43)"
    }
    const contentStyle = {
      fontSize: "14px",
      color: "rgb(85, 83, 83)",
      fontFamily: "raleway",
      fontWeight: "500",
      borderColor: "rgb(150, 220, 240)",
    }
    const tableStyle = {
      width: "100%",
      fontFamily: "Raleway",
      borderCollapse: "collapse",
      borderSpacing: '0',
      border: 'none'
    }
    const tableWidthStyle = {
      width: "500px",
      margin: '0 auto',
      textAlign: 'center'
    }
    return (
      <>
        <table style={{ ...tableStyle, marginBottom: '25px' }}>
          <tr>
            <td
              style={{ ...titleStyle, color: 'rgb(41, 197, 236)' }}
            >
              <span style={{ marginRight: '5px' }}> Total Attendees/Participants:</span>{paricipants && paricipants.length > 0 ? paricipants.length : 0}
            </td>
          </tr>
        </table >
        <table style={tableStyle}>
          {/* {paricipants.map((data, index) => {
          return (
            <tr>
              <td style={{ ...contentStyle, width: '20px' }}>{index + 1}.</td>
              <td style={{ ...contentStyle, fontWeight: "500" }}>{data.email || ""}</td>
            </tr>
          );
        })} */}

          <tr>
            <td>
              <table style={{ ...tableWidthStyle, borderColor: 'rgb(150, 220, 240)', borderCollapse: 'collapse' }} border="1">
                <tr>
                  <th style={{ ...contentStyle, borderLeft: 'hidden', fontWeight: '600', color: '#000' }}>Present</th>
                  <th style={{ ...contentStyle, borderRight: 'hidden', fontWeight: '600', color: '#000' }}>Absent</th>
                </tr>
                {(present.length > 0 || absent.length > 0) && present.length > absent.length ? present.map((data, index) => {
                  let absentPart = absent[index];
                  return <tr style={{ backgroundColor: index % 2 !== 0 ? '#bfecf9' : '' }}>
                    <td style={{ ...contentStyle, borderLeft: 'hidden' }}>{data.name || data.email}</td>
                    <td style={{ ...contentStyle, borderRight: 'hidden' }}>{absentPart ? absentPart.name || absentPart.email : ""}</td>
                  </tr>
                }) : absent.map((data, index) => {
                  let presentPart = present[index];
                  return <tr style={{ backgroundColor: index % 2 !== 0 ? '#bfecf9' : '' }}>
                    <td style={{ ...contentStyle, borderLeft: 'hidden' }}>{presentPart ? presentPart.name || presentPart.email : ""}</td>
                    <td style={{ ...contentStyle, borderRight: 'hidden' }}>{data.name || data.email}</td>
                  </tr>
                })}
              </table>
            </td>
          </tr>
        </table >

        <hr style={{ margin: "20px 0" }}></hr>
      </>
    );
  }
}
