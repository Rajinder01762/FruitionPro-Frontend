import React, { Component } from "react";

export default class Documents extends Component {
  render() {
    const { documents } = this.props;
    const titleStyle = {
      textTransform: "capitalize",
      fontSize: "16px",
      fontFamily: "raleway",
      fontWeight: "700",
      color: "rgb(43, 43, 43)"
    };
    const contentStyle = {
      fontSize: "14px",
      color: "rgb(43, 43, 43)",
      fontFamily: "raleway",
      fontWeight: "600"
    };
    const tableStyle = {
      width: "100%",
      fontFamily: "Raleway",
      borderCollapse: "collapse",
      borderSpacing: "0",
      border: "none"
    };
    return (
      <>
        <table style={tableStyle}>
          <tr>
            <td style={{ ...titleStyle, color: "rgb(41, 197, 236)" }}>
              Document:
            </td>
          </tr>
        </table>
        <table style={{ ...tableStyle, marginLeft: "100px" }}>
          {documents.map((data, index) => {
            return (
              <tr>
                <td style={{ ...contentStyle, width: "20px" }}>{index + 1}.</td>{" "}
                <td style={contentStyle}>
                  <a
                    href={data.url}
                    download
                    style={{
                      ...contentStyle,
                      textDecoration: "none",
                      wordBreak: "break-all"
                    }}
                  >
                    {data.name || ""}
                  </a>
                </td>
              </tr>
            );
          })}
        </table>
        <hr style={{ margin: "20px 0" }}></hr>
      </>
    );
  }
}
