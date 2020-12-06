import React, { Component } from 'react';
import moment from "moment"

export default class MeetingsSample extends Component {
  render() {
    const { details } = this.props;
    const titleStyle = {
      textTransform: "capitalize",
      fontSize: "16px",
      fontFamily: "raleway",
      fontWeight: "700",
      color: "rgb(43, 43, 43)",
    }
    const contentStyle = {
      fontSize: "14px",
      color: "rgb(43, 43, 43)",
      fontFamily: "raleway",
      fontWeight: "500",
    }
    const tableStyle = {
      width: "100%",
      fontFamily: "Raleway",
      borderCollapse: "collapse",
      borderSpacing: '0',
      border: 'none'
    }
    return (
      <>

      <table style={{ ...tableStyle, marginBottom: '20px' }}>
        <tr>

          <td>
          </td>
          <td
            style={{ ...contentStyle, width: '270px' }}
          >
            <span style={{ fontWeight: 600, marginRight: '10px' }}>Department: </span>{details.department || ""}
          </td>
        </tr>
        <tr>
          <td>
          </td>
          <td
            style={{ ...contentStyle, width: '270px' }}
          >
            <span style={{ fontWeight: 600, marginRight: '10px' }}>Project Name: </span>{details.project_name || ""}
          </td>
        </tr>
        {/* <tr>
          <td
            style={{ ...contentStyle, textAlign: 'right' }}
          >
            <table style={{ ...tableStyle, textAlign: 'left' }}>
              <tr>
                <td >
                  <span style={{ fontWeight: 600, marginRight: '10px' }}>Department: </span>ABC Department
                </td>
              </tr>
              <tr>
                <td>
                  <span style={{ fontWeight: 600, marginRight: '10px' }}>Project Name: </span>ABC Project
                </td>
              </tr>
            </table>
          </td>
        </tr> */}

      </table>
      <table style={tableStyle}>
        <tr>
          <td
            style={{ ...contentStyle, width: '140px', fontWeight: 600 }}
          >
            Meeting Title:
          </td>
          <td
            style={contentStyle}
          >
            {details.title || ""} 
          </td>
        </tr>
        <tr>
          <td
            style={{ ...contentStyle, width: '140px', fontWeight: 600 }}
          >
            Date and time:{" "}
          </td>
          <td
            style={contentStyle}
          >
            {moment(details.startDateTime).format(
              "dddd, MMMM DD,YYYY [at] h: mm: A"
            )}
          </td>
        </tr>
        <tr>
          <td
            style={{ ...contentStyle, width: '140px', fontWeight: 600 }}
          >
            Location:
            </td>
          <td
            style={contentStyle}
          >
            {details.location || ""}
          </td>
        </tr>
      </table>
      <hr style={{ margin: "20px 0" }}></hr>
      </>
    );
  }
}