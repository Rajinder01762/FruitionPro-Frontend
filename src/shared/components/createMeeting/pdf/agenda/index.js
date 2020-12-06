import React, { Component } from "react";
import moment from "moment";
const titleStyle = {
  fontSize: "16px",
  fontFamily: "raleway",
  fontWeight: "700",
  color: "rgb(41, 197, 236)",
};
const contentStyle = {
  fontSize: "14px",
  color: "rgb(85, 83, 83)",
  fontFamily: "raleway",
  fontWeight: "500",
  borderColor: "rgb(150, 220, 240)",
};
const docStyle = {
  fontSize: "14px",
  color: "#000",
  fontFamily: "raleway",
  fontWeight: "500",
  borderColor: "rgb(150, 220, 240)",
  fontWeight: "600",
  wordBreak: "break-word",
};
const tableStyle = {
  width: "100%",
  fontFamily: "Raleway",
  borderCollapse: "collapse",
  borderSpacing: "0",
  border: "none",
};
const tableWidthStyle = {
  width: "100%",
  margin: "0 auto",
  textAlign: "center",
  marginBottom: "25px",
  borderColor: "rgb(150, 220, 240)",
  marginTop: "25px",
  borderCollapse: "collapse",
  wordBreak: "break-word",
  tableLayout: "fixed",
};
export default class Agenda extends Component {
  checkEmptyDecision = (data) => {
    if (data.length === 1 && !data[0].trim()) {
      return false;
    } else return true;
  };

  render() {
    const { agendaItems, createMeetingData } = this.props;
    const { adminEmail } = createMeetingData;

    return (
      <>
        {agendaItems &&
          agendaItems.length > 0 &&
          agendaItems.map((agenda, index) => {
            return (
              <>
                <table style={{ ...tableStyle, marginBottom: "15px" }}>
                  <tr style={{ marginBottom: "10px" }}>
                    <td style={{ ...titleStyle, fontWeight: "700" }}>
                      {index + 1 + ". " + agenda.title}
                    </td>
                    <td style={{ fontWeight: "600", textAlign: "right" }}>
                      {agenda.duration && (
                        <>
                          {" "}
                          <span style={{ marginRight: "5px" }}>Duration:</span>
                          {agenda.duration.label}
                        </>
                      )}
                    </td>
                  </tr>
                </table>
                <table style={{ ...tableStyle, marginBottom: "15px" }}>
                  {/* {agenda.notes && (
                    <tr>
                      <td
                        style={{
                          ...contentStyle,
                          color: "#000",
                          wordBreak: "break-all"
                        }}
                      >
                        {agenda.notes}
                      </td>
                    </tr>
                  )} */}
                  {agenda.notes &&
                    agenda.notes.split("\n").map((line) => {
                      return (
                        <tr>
                          <td
                            style={{
                              ...contentStyle,
                              color: "#000",
                              wordBreak: "break-all",
                            }}
                          >
                            {line}
                          </td>
                        </tr>
                      );
                    })}

                  <tr>
                    <td>
                      {agenda.tasks && agenda.tasks.length > 0 && (
                        <table style={tableWidthStyle} border="1">
                          <tr>
                            <th
                              style={{
                                ...contentStyle,
                                borderLeft: "hidden",
                                fontWeight: "600",
                                color: "#000",
                                width: "50px",
                              }}
                            >
                              S.No.
                            </th>
                            <th
                              style={{
                                ...contentStyle,
                                fontWeight: "600",
                                color: "#000",
                              }}
                            >
                              Action Description
                            </th>
                            <th
                              style={{
                                ...contentStyle,
                                fontWeight: "600",
                                color: "#000",
                              }}
                            >
                              Assigner
                            </th>
                            <th
                              style={{
                                ...contentStyle,
                                fontWeight: "600",
                                color: "#000",
                              }}
                            >
                              Assignee
                            </th>
                            <th
                              style={{
                                ...contentStyle,
                                borderRight: "hidden",
                                fontWeight: "600",
                                color: "#000",
                              }}
                            >
                              Due Date
                            </th>
                          </tr>
                          {agenda.tasks.map((task, key) => {
                            return (
                              <tr
                                style={{
                                  backgroundColor: key % 2 !== 0 && "#bfecf9",
                                }}
                              >
                                <td
                                  style={{
                                    ...contentStyle,
                                    borderLeft: "hidden",
                                  }}
                                >
                                  {key + 1}
                                </td>
                                <td style={{ ...contentStyle }}>{task.task}</td>
                                <td style={{ ...contentStyle }}>
                                  {adminEmail}
                                </td>
                                <td style={{ ...contentStyle }}>
                                  {task.assign_to.map((emp) =>
                                    emp.email ? emp.email : emp + " "
                                  )}
                                </td>
                                <td
                                  style={{
                                    ...contentStyle,
                                    borderRight: "hidden",
                                  }}
                                >
                                  {moment(task.due_date).format("Do MMM YYYY")}
                                </td>
                              </tr>
                            );
                          })}
                        </table>
                      )}
                    </td>
                  </tr>
                </table>
                {agenda.documents && agenda.documents.length > 0 && (
                  <>
                    {" "}
                    <table style={tableStyle}>
                      <tr>
                        <td style={{ ...titleStyle }}>Document:</td>
                      </tr>
                    </table>
                    <table style={{ ...tableStyle, marginLeft: "100px" }}>
                      {agenda.documents.map((document, docKey) => {
                        return (
                          <tr>
                            <td style={{ ...docStyle, width: "20px" }}>
                              {docKey + 1 + "."}
                            </td>{" "}
                            <td style={contentStyle}>
                              <a
                                href={document.url}
                                download
                                style={{ ...docStyle, textDecoration: "none" }}
                              >
                                {document.name}
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </table>{" "}
                  </>
                )}

                {agenda.decisions &&
                  agenda.decisions.length > 0 &&
                  this.checkEmptyDecision(agenda.decisions) && (
                    <>
                      {" "}
                      <table style={tableStyle}>
                        <tr>
                          <td style={{ ...titleStyle }}>Decision:</td>
                        </tr>
                      </table>
                      <table style={{ marginLeft: "100px" }}>
                        {agenda.decisions.map((decision, decKey) => {
                          return (
                            decision && (
                              <tr>
                                <td
                                  style={{
                                    ...docStyle,
                                    width: "20px",
                                  }}
                                >
                                  {decKey + 1 + "."}
                                </td>{" "}
                                <td
                                  style={{
                                    ...contentStyle,
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {decision}
                                </td>
                              </tr>
                            )
                          );
                        })}
                      </table>{" "}
                    </>
                  )}

                {/* <table style={{ ...tableStyle, marginTop: '25px' }}>
              <tr>
                <td style={{ ...titleStyle, width: "100px" }}>Decision:</td>
                <td style={{ ...contentStyle, color: 'rgb(43, 43, 43)' }}>
                  fxgfh
          </td>
              </tr> */}

                <hr style={{ margin: "20px 0" }}></hr>
              </>
            );
          })}

        {/* <table style={{ ...tableStyle, marginBottom: '15px' }}>
        <tr style={{ marginBottom: '10px' }}>
          <td
            style={{ ...titleStyle, fontWeight: "700" }}
          >
            1. Agenda One
          </td>
          <td style={{ fontWeight: '600', textAlign: 'right' }}>
            <span style={{ marginRight: '5px' }}>Duration:</span>01 minutes
          </td>
        </tr>
      </table>
      <table style={{ ...tableStyle, marginBottom: '15px' }}>
        <tr>
          <td style={{ ...contentStyle, color: '#000' }} >
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </td>
        </tr>
        <tr>
          <td>
            <table style={tableWidthStyle} border="1">
              <tr>
                <th style={{ ...contentStyle, borderLeft: 'hidden', fontWeight: '600', color: '#000' }}>S.No.</th>
                <th style={{ ...contentStyle, fontWeight: '600', color: '#000' }}>Task Description</th>
                <th style={{ ...contentStyle, fontWeight: '600', color: '#000' }}>Assign</th>
                <th style={{ ...contentStyle, fontWeight: '600', color: '#000' }}>Assignee</th>
                <th style={{ ...contentStyle, borderRight: 'hidden', fontWeight: '600', color: '#000' }}>Due Date</th>
              </tr>
              <tr>
                <td style={{ ...contentStyle, borderLeft: 'hidden' }}>1</td>
                <td style={{ ...contentStyle }}>Name2</td>
                <td style={{ ...contentStyle }}></td>
                <td style={{ ...contentStyle }}></td>
                <td style={{ ...contentStyle, borderRight: 'hidden' }}></td>
              </tr>
              <tr style={{ backgroundColor: '#bfecf9' }}>
                <td style={{ ...contentStyle, borderLeft: 'hidden' }}>2</td>
                <td style={{ ...contentStyle }}>Name2</td>
                <td style={{ ...contentStyle }}></td>
                <td style={{ ...contentStyle }}></td>
                <td style={{ ...contentStyle, borderRight: 'hidden' }}></td>
              </tr>
            </table>
          </td>
        </tr>
      </table >
      <table style={tableStyle}>
        <tr>
          <td style={{ ...titleStyle }}>
            Document:
            </td>
        </tr>
      </table>
      <table style={{ ...tableStyle, marginLeft: '100px' }}>
        <tr>
          <td style={{ ...docStyle, width: "20px" }}>1.</td> <td style={contentStyle}>
            <a href="" download style={{ ...docStyle, textDecoration: "none" }}>sdfd
            </a>
          </td>
        </tr>
      </table>
      <table style={{ ...tableStyle, marginTop: '25px' }}>
        <tr>
          <td style={{ ...titleStyle, width: "100px" }}>Decision:</td>
          <td style={{ ...contentStyle, color: 'rgb(43, 43, 43)' }}>
            fxgfh
          </td>
        </tr>
      </table>

      <hr style={{ margin: "20px 0" }}></hr>

      <table style={{ ...tableStyle, marginBottom: '15px' }}>
        <tr style={{ marginBottom: '10px' }}>
          <td
            style={{ ...titleStyle, fontWeight: "700" }}
          >
            1. Agenda One
          </td>
          <td style={{ fontWeight: '600', textAlign: 'right' }}>
            <span style={{ marginRight: '5px' }}>Duration:</span>01 minutes
          </td>
        </tr>
      </table>
      <table style={{ ...tableStyle, marginBottom: '15px' }}>
        <tr>
          <td style={{ ...contentStyle, color: '#000' }} >
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </td>
        </tr>
        <tr>
          <td>
            <table style={tableWidthStyle} border="1">
              <tr>
                <th style={{ ...contentStyle, borderLeft: 'hidden', fontWeight: '600', color: '#000' }}>S.No.</th>
                <th style={{ ...contentStyle, fontWeight: '600', color: '#000' }}>Task Description</th>
                <th style={{ ...contentStyle, fontWeight: '600', color: '#000' }}>Assign</th>
                <th style={{ ...contentStyle, fontWeight: '600', color: '#000' }}>Assignee</th>
                <th style={{ ...contentStyle, borderRight: 'hidden', fontWeight: '600', color: '#000' }}>Due Date</th>
              </tr>
              <tr>
                <td style={{ ...contentStyle, borderLeft: 'hidden' }}>1</td>
                <td style={{ ...contentStyle }}>Name2</td>
                <td style={{ ...contentStyle }}></td>
                <td style={{ ...contentStyle }}></td>
                <td style={{ ...contentStyle, borderRight: 'hidden' }}></td>
              </tr>
              <tr style={{ backgroundColor: '#bfecf9' }}>
                <td style={{ ...contentStyle, borderLeft: 'hidden' }}>2</td>
                <td style={{ ...contentStyle }}>Name2</td>
                <td style={{ ...contentStyle }}></td>
                <td style={{ ...contentStyle }}></td>
                <td style={{ ...contentStyle, borderRight: 'hidden' }}></td>
              </tr>
            </table>
          </td>
        </tr>
      </table >
      <table style={tableStyle}>
        <tr>
          <td style={{ ...titleStyle }}>
            Document:
            </td>
        </tr>
      </table>
      <table style={{ ...tableStyle, marginLeft: '100px' }}>
        <tr>
          <td style={{ ...docStyle, width: "20px" }}>1.</td> <td style={contentStyle}>
            <a href="" download style={{ ...docStyle, textDecoration: "none" }}>sdfd
            </a>
          </td>
        </tr>
      </table>
      <table style={{ ...tableStyle, marginTop: '25px' }}>
        <tr>
          <td style={{ ...titleStyle, width: "100px" }}>Decision:</td>
          <td style={{ ...contentStyle, color: 'rgb(43, 43, 43)' }}>
            fxgfh
          </td>
        </tr>
      </table>

      <hr style={{ margin: "20px 0" }}></hr> */}
      </>
    );
  }
}

//         {
//       agendaItems.map((data, index) => {
//         return (
//               <>

//           <table style={{ ...tableStyle, marginBottom: '15px' }} >
//             <tr>
//               <td style={{ fontWeight: "600", paddingBottom: "8px" }}>
//                 <span style={{ marginRight: "10px" }}>{index + 1}.</span>
//                 {data.title || ""}
//               </td>
//             </tr>
//             <tr>{this.renderTask(data)}</tr>
//           </ table>

//               </>
//             )
//     })
//   }
//         <hr style={{ margin: "20px 0" }}></hr>
//       </>)
//   }

// renderTask = details => {
//   const { notes, duration, documents, tasks, decisions } = details;
//   return (
//     <table style={tableStyle}>
//       {duration && duration.label && (
//         <tr style={{ verticalAlign: "top" }}>
//           <td style={{ ...contentStyle, width: '140px' }}>Duration</td>
//           <td style={contentStyle}>
//             {duration.label || ""}
//           </td>
//         </tr>
//       )}
//       {notes && (
//         <tr style={{ verticalAlign: "top" }}>
//           <td style={{ ...contentStyle, width: '140px' }}>Notes</td>
//           <td style={contentStyle}>
//             {notes || ""}
//           </td>
//         </tr>
//       )}
//       {documents && documents.length > 0 && (
//         <tr style={{ verticalAlign: "top" }}>
//           <td style={{ ...contentStyle, width: '140px' }}>Document</td>
//           <td style={contentStyle}>
//             {this.renderDocuments(documents)}
//           </td>
//         </tr>
//       )}
//       {tasks && tasks.length > 0 && (<>
//         <tr>
//           <td style={{ fontWeight: "600", paddingBottom: "8px", paddingTop: "20px" }}>Tasks</td>
//         </tr>
//           {this.renderTaskDetails(tasks)}
//         </>
//   )
// }
// {
//   decisions && decisions.length > 0 && decisions[0] !== "" && (
//     <tr style={{ verticalAlign: "top" }}>
//       <td style={contentStyle}>Decisions</td>
//       <td style={contentStyle}>
//         {this.renderDecisions(decisions)}
//       </td>
//     </tr>
//   )
// }
//       </table >
//     );
//   };

// renderDecisions = data => {
//   return data.map((item, index) => {
//     return item
//   })
// };

// renderDocuments = data => {
//   return data.map(item => {
//     return (<a download href={item.url} style={{ ...contentStyle, textDecoration: "none", wordBreak: 'break-word' }}>
//       {item.name}
//     </a>
//     );
//   })
// };

// renderTaskDetails = data => {
//   return data.map((item, index) => {
//     return (
//       <React.Fragment>
//         <tr>
//           <td style={{ ...contentStyle, width: "140px", paddingTop: "10px" }}>Name: </td>
//           <td style={{ ...contentStyle, paddingTop: "10px" }}>{item.task || ""}</td>
//         </tr>
//         {item.due_date && (
//           <tr>
//             <td style={{ ...contentStyle, width: "140px" }}>Due Date: </td>
//             <td style={contentStyle}>
//               {moment(item.due_date).format("dddd, MMMM DD,YYYY")}
//             </td>
//           </tr>
//         )
//         }
//         {
//           item.assign_to && item.assign_to.length > 0 && (
//             <tr>
//               <td style={{ ...contentStyle, width: "140px" }}>Assignee: </td>
//               <td style={contentStyle}>{item.assign_to.join(", ")}</td>
//             </tr>
//           )}
//       </React.Fragment>
//     )
//   })
// }
// }
