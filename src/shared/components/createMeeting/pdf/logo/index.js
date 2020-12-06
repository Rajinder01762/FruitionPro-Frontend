import React, { Component } from "react";

export default class Logo extends Component {
  render() {
    // const paginationStyle = {
    //   display: 'inline-table',
    //   borderCollapse: "collapse",
    //   borderSpacing: '0',
    //   border: 'none'
    // }
    const tableStyle = {
      width: "100%",
      marginTop: "20px",
      fontFamily: "Raleway",
      borderCollapse: "collapse",
      borderSpacing: '0',
      border: 'none',
      textAlign: "right"
    }
    return (

      <table style={tableStyle}>
        <tr>
          <td style={{ verticalAlign: "middle" }}>
            <table style={{ display: "inline-table" }}>
              <tr>
                <td>
                  <img
                    alt="noImg"
                    src={`data:image/png;base64,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`}
                    style={{ width: "50px" }}
                  />
                </td>
                <td>
                  <span style={{ marginLeft: "20px", fontWeight: "500" }}>
                    1 of 1
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    );
  }
}
