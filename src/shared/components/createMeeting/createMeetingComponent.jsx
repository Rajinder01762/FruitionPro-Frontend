import React, { Component } from "react";
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

// import Avatar from "../../../asset/images/icons/Avatar.png";
import CalenderIcon from "../../../asset/images/dashboard-icons/small-calendar.svg";
import ClockIcon from "../../../asset/images/dashboard-icons/clock.svg";
import PlaceholderIcon from "../../../asset/images/dashboard-icons/placeholder.svg";
// import AddButtonIcon from "../../../asset/images/dashboard-icons/add-button.svg";
import AddButtonIcon from "../../icons/addIcon";
import PDFIcon from "../../../asset/images/icons/pdf-icon.svg";
import DocIcon from "../../../asset/images/icons/doc-icon.svg";
import DocxIcon from "../../../asset/images/icons/docx-icon.svg";
import Edit from "../../icons/moreIcon";
import PlusIcon from "../../../asset/images/icons/PlusIcon.png";
//import Select from 'react-select';
import Select from "react-select/creatable";
import InviteUserItems from "./options/inviteUserItems";
import moment from "moment";
import { onFileUpload } from "../../util/fileUpload";
import AddAgendaModal from "./agendaModal";
import { Redirect } from "react-router-dom";
import _ from "lodash";
import Loader from "react-loader-spinner";
import MsgModal from "../../util/index";
import MeetingEdit from "../modals";
import MeetingsPdf from "../createMeeting/pdf";
import DropdownShareOptions from "./dropdownShareOptions";
import { handleDocDownload, handlePdfDownload } from "../../util/pdf";
import { getFormattedDates } from "../../util/reccurrence-converter";
import { renderToString } from "react-dom/server";
import TickIcon from "../../../asset/images/icons/right-icon.svg";
import RedCross from "../../../asset/images/icons/cross-icon.svg";
import LockIcon from "../../../asset/images/dashboard-icons/lock.svg";
import CloseModal from "./meetingCloseModal";
import EditIcon from "../../../asset/images/icons/Edit.png";
import ToasterModal from "../../util/index";
import EditReccurenceMeeting from "../modals/EditReccurenceMeeting";
import { calculateDifference } from "../../components/common/getChanges";

export const circleCharacter = (data) => {
  if (!data) return;
  if (!data.name && !data.email) return;
  let nameArr;
  if (data && data.name) {
    nameArr = data.name.trim().split(" ");
    if (data.logo) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
          className="circleBox"
        >
          <img
            src={data.logo}
            alt=""
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "100%",
              position: "absolute",
            }}
            onerror="this.style.display='none'"
          />
          {nameArr.length >= 2 ? (
            <div>
              {(
                nameArr[0].charAt(0) + nameArr[nameArr.length - 1].charAt(0)
              ).toUpperCase()}
            </div>
          ) : (
              <div>
                {(nameArr[0].charAt(0) + nameArr[0].charAt(1)).toUpperCase()}
              </div>
            )}
        </div>
      );
    }
    if (nameArr.length >= 2) {
      return (
        nameArr[0].charAt(0) + nameArr[nameArr.length - 1].charAt(0)
      ).toUpperCase();
    } else {
      return (nameArr[0].charAt(0) + nameArr[0].charAt(1)).toUpperCase();
    }
  } else {
    return (data && data.email.charAt(0) + data.email.charAt(1)).toUpperCase();
  }
};

export default class CreateMeeting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      isOpenAgendaModal: false,
      inviteModal: false,
      meetingNotes: props.meetingNotes || "",
      isCreated: false,
      isUpdated: false,
      openedValue: "",
      selectedParticipants: [],
      contacts: [],
      isUploading: false,
      agendaData: null,
      isUpdateAgenda: false,
      // isAttented: {},
      meetingModalClose: null,
      isCloseModal: false,
      isOpenMeetingModal: false,
      meetingParticipants: [],
      agendaUpdated: false,
      reccurenceEditModal: false,
      share: "",
      isShareOpen: "",
      oldParticipants: [],
    };
    this.meetingEditRef = React.createRef();
    this.toggle = this.toggle.bind(this);
    this.modaltoggle = this.modaltoggle.bind(this);
    this.InviteModalToggle = this.InviteModalToggle.bind(this);
    this.agendaRef = React.createRef();
    this.agendaDidUpdate = this.agendaDidUpdate.bind(this);
  }
  componentWillMount() {
    window.scrollTo(0, 0);
    const { meetingsDetails, addedParticipants } = this.props;

    const contactData = _.unionWith(
      meetingsDetails.contacts,
      addedParticipants,
      (a, b) => a.email === b.email
    );
    this.setState({
      contacts: contactData,
      meetingParticipants: addedParticipants,
      oldParticipants: addedParticipants,
    });
  }

  componentDidMount() {
    const {
      meetingId,
      fetchParticularMeetingData,
      setMeetingSummaryData,
      userDetails,
    } = this.props;
    if (meetingId) {
      const obj = {
        id: meetingId,
      };
      fetchParticularMeetingData(obj).then((result) => {
        const { meeting, status, message } = result.payload.data;
        if (status === 200) {
          setMeetingSummaryData(meeting, userDetails.email || "");
          // updateEditPermission(userDetails, meeting.attendees);
          if (meeting) {
            this.setState({
              meetingNotes: meeting.notes,
            });
          }
        } else {
          ToasterModal(status, message);
        }
      });
    }
  }

  toggle(value) {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
      openedValue: value,
    }));
  }
  modaltoggle(callback, agendaDidUpdate = false) {
    this.setState((prevState) => ({
      isOpenAgendaModal: !prevState.isOpenAgendaModal,
      agendaData: null,
    }));

    if (callback) {
      callback();
    }

    agendaDidUpdate && this.setState({ agendaUpdated: true });
  }

  InviteModalToggle = () => {
    const { addedParticipants } = this.props;
    this.setState((prevState) => ({
      inviteModal: !prevState.inviteModal,
      error: "",
      selectedParticipants:
        !prevState.inviteModal && addedParticipants && addedParticipants.length
          ? addedParticipants
          : [],
    }));
  };

  handleAddDocuments = (e) => {
    if (e && e.target && e.target.files) {
      const fileName = (e.target.files.length > 0 && e.target.files[0].name) || '';
      let type = "";
      if (e.target.files[0].type === "application/pdf") {
        type = "pdf";
      } else if (
        e.target.files[0].type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        type = "docx";
      } else if (e.target.files[0].type === "application/msword") {
        type = "doc";
      }
      const { setDocuments, meetingDocuments } = this.props;
      let fileIndex = -1;
      if (meetingDocuments && meetingDocuments.length > 0) {
        fileIndex = meetingDocuments.findIndex((doc) => doc.name === fileName);
      }
      if (fileIndex < 0) {
        this.setState({ isUploading: true });
        onFileUpload(e.target.files[0]).then((res) => {
          if (res) {
            this.setState({ isUploading: false });
            setDocuments({ url: res, name: fileName, type });
          }
        });
      } else {
        MsgModal(400, "Document Already added");
      }
    }
  };

  handleParticipants = () => {
    const { setParticipants } = this.props;
    const { selectedParticipants } = this.state;

    let participants = [];
    if (selectedParticipants) {
      selectedParticipants.forEach((item) => {
        item.is_present = false;
        item.can_attend = "";
        participants.push(item);
      });
    }
    setParticipants(participants);
    this.InviteModalToggle();
    //}
  };
  updateEditPermission = (item, canEdit) => {
    const { selectedParticipants } = this.state;
    const selected = [...selectedParticipants];
    const updateItem = selected.find((added) => added.email === item.email);
    if (updateItem) {
      updateItem.canEdit = canEdit;
    }
    this.setState({ selectedParticipants: selected });
  };

  getFormattedParticipantsData = () => {
    const { selectedParticipants, contacts } = this.state;
    console.log("selectedParticipants11", selectedParticipants);
    console.log("contactscontacts22", contacts);
    let contactsNew = contacts.slice();
    if (selectedParticipants && selectedParticipants.length > 0) {
      // var hasMatch = contacts.some((contact) =>
      //   selectedParticipants.some((m) => contact.user_id._id === m.user_id)
      // );
      // const abc = contactsNew.filter((x, i) =>
      //   selectedParticipants.find((m, index) => {
      //     console.log("selectedParticipants in", index);
      //     console.log("contactsNew", i);
      //     if (x.email) {
      //       if (
      //         m.email === x.email
      //         // &&
      //         // (contactsNew[i].canEdit ) &&
      //         // !selectedParticipants[index].canEdit
      //       ) {
      //         return (contactsNew[i] = selectedParticipants[index]);
      //         // return {
      //         //   contactsNew[]
      //         // }
      //       }
      //     }
      //   })
      // );
      // console.log("abcabc", abc, contactsNew);
      // arr.some(a => contacts.some(contact => contact.user_id._id === selectedParticipants.user_id));
    }

    if (contactsNew && contactsNew.length > 0) {
      let paricipants = [];
      contactsNew.forEach((item) => {
        const isAddedIndex = selectedParticipants.findIndex(
          (added) => added.email === item.email
        );
        console.log(
          "selectedParticipants",
          selectedParticipants,
          contacts,
          isAddedIndex
        );

        const dataItem = {
          value: item.email,
          data: item,
          label: (
            <InviteUserItems
              updateEditPermission={this.updateEditPermission}
              canEdit={
                isAddedIndex > -1
                  ? selectedParticipants[isAddedIndex].canEdit !== undefined
                    ? selectedParticipants[isAddedIndex].canEdit
                    : selectedParticipants[isAddedIndex].can_edit
                  : false
              }
              showMenu={isAddedIndex > -1}
              data={item}
              label={item.email || item.name}
            />
          ),
        };
        paricipants.push(dataItem);
      });
      return paricipants;
    }
    return [];
  };

  seletedView = () => {
    const { selectedParticipants } = this.state;
    if (selectedParticipants && selectedParticipants.length > 0) {
      let paricipants = [];
      selectedParticipants.forEach((item) => {
        const dataItem = {
          value: item.email,
          data: item,
          label: item.email,
        };
        paricipants.push(dataItem);
      });
      return paricipants;
    }
    return [];
  };

  seletedAttendedParticipants = () => {
    const { selectedParticipants } = this.state;
    if (selectedParticipants && selectedParticipants.length > 0) {
      let participants = [];
      let arr = [];
      selectedParticipants.forEach((item) => {
        if (item.can_attend === "yes") {
          const dataItem = {
            value: item.email,
            data: item,
            label: item.email,
          };

          participants.push(dataItem);
        }
      });

      return participants;
    }
    return [];
  };

  handleCreateMeeting = (share) => {
    const {
      addMeeting,
      createMeetingData,
      agendaItems,
      meetingDocuments,
      addedParticipants,
      userDetails,
      organizationData,
      resetMeetingData,
      private_notes,
      logo,
      togglePrivateNote,
    } = this.props;

    console.log("agendaItemsagendaItemsagendaItemsagendaItems", agendaItems);
    const { meetingNotes } = this.state;
    togglePrivateNote(false);
    let meetingDates = [];
    let createFirstMeeting = true;
    if (createMeetingData.recurrenceData) {
      meetingDates = getFormattedDates(createMeetingData);
      const meetingStartDate = new Date(createMeetingData.startDateTime);
      meetingDates.forEach((dd) => {
        const firstDate = new Date(dd.start_date);
        firstDate.setHours(
          meetingStartDate.getHours(),
          meetingStartDate.getMinutes(),
          meetingStartDate.getSeconds(),
          meetingStartDate.getMilliseconds()
        );
        if (firstDate.getTime() === meetingStartDate.getTime()) {
          createFirstMeeting = false;
        }
      });
    }

    meetingDates.sort(function (left, right) {
      return moment.utc(left.start_date).diff(moment.utc(right.start_date));
    });
    createMeetingData.recurrenceData = meetingDates;

    addMeeting({
      ...createMeetingData,
      agendas: agendaItems,
      documents: meetingDocuments,
      share,
      participants: addedParticipants,
      owner: userDetails.name || "",
      company: organizationData.organizationName,
      notes: meetingNotes,
      private_notes,
      logo,
      createFirstMeeting,
    }).then((result) => {
      const { status, message } = result.payload.data;
      if (status === 200) {
        this.setState({
          isCreated: true,
        });
        MsgModal(status, message);
        resetMeetingData();
      }
    });
  };

  handleUpdate = (share, type, isShareOpen) => {
    const { meetingData, meetingDetail } = this.props;

    if (
      meetingData &&
      meetingDetail &&
      meetingDetail.canEdit &&
      meetingData.parentMeetingId
    ) {
      this.setState({
        reccurenceEditModal: true,
        share,
        isShareOpen,
      });
    } else {
      const {
        createMeetingData,
        agendaItems,
        meetingDocuments,
        addedParticipants,
        userDetails,
        organizationData,
        updateMeeting,
        meetingId,
        private_notes,
        logo,
        togglePrivateNote,
        dataToPrint,
        setMeetingsType,
        fetchParticularMeetingData,
        setMeetingSummaryData,
      } = this.props;
      const {
        meetingNotes,
        selectedParticipants,
        reccurenceEditModal,
      } = this.state;
      const contactData = _.unionWith(
        selectedParticipants,
        addedParticipants,
        (a, b) => a.email === b.email
      );
      togglePrivateNote(false);
      let obj = {
        ...createMeetingData,
        // agendas: agendaItems,
        documents: meetingDocuments,
        participants: contactData,
        private_notes,
        email: userDetails.email || "",
        notes: meetingNotes,
        _id: meetingId,
        owner: userDetails.name || "",
        company: organizationData.organizationName || "",
        share,
        logo,
        isEditAll: dataToPrint && dataToPrint.editAllMeetings,
      };

      if (type !== "SaveUpdate") {
        const agendas = [];
        agendaItems &&
          agendaItems.length > 0 &&
          agendaItems.map((item) => {
            if (
              item.tasks &&
              item.tasks.length === 1 &&
              item.tasks[0].task === ""
            ) {
              let obj = item;
              delete obj.tasks;
              agendas.push(obj);
            } else {
              let agenda = item;

              let tasksData = item.tasks;
              let tasksArr = [];
              tasksData &&
                tasksData.length > 0 &&
                tasksData.map((task) => {
                  let object = { ...task };
                  object.assign_to = [];

                  task.assign_to &&
                    task.assign_to.length > 0 &&
                    task.assign_to.map((item) => {
                      if (item.email) {
                        object.assign_to.push(item.email);
                      } else {
                        object.assign_to.push(item);
                      }
                    });
                  tasksArr.push(object);
                });
              agenda.tasks = tasksArr;
              agendas.push(agenda);
            }
          });
        obj.agendas = agendas;
      }

      updateMeeting(obj).then((result) => {
        const { status } = result.payload.data;
        if (status === 200) {
          setMeetingsType("upcoming");
          fetchParticularMeetingData({
            id: meetingId,
          }).then((result) => {
            const { meeting, status, message } = result.payload.data;
            if (status === 200) {
              setMeetingSummaryData(meeting, userDetails.email || "");
              // updateEditPermission(userDetails, meeting.attendees);
              if (meeting) {
                this.setState({
                  meetingNotes: meeting.notes,
                });
              }
            } else {
              ToasterModal(status, message);
            }
          });
          if (isShareOpen) {
            this.setState({
              isUpdated: false,
            });
          } else {
            this.setState({
              isUpdated: false,
            });
          }
        }
      });
    }
  };

  getUpdatedAgendas = (data) => {
    let updatedAgendas = [];
    const agendaBits = [
      "title",
      "documents",
      "duration",
      "notes",
      "agendaId",
      "tasks",
      "decisions",
    ];

    const { agendaItems, difference } = data;
    if (difference && difference.length > 0) {
      for (let agenda of difference) {
        const { path, item } = agenda;
        if (path.length > 0) {
          let type = path[0];
          if (type && type === "agendaItems") {
            if (item) {
              if (item.kind === "N") {
                switch (path.length) {
                  case 1:
                    updatedAgendas.push(item.rhs);
                    break;
                  case 3:
                    if (path[2] === "tasks") {
                      const index = updatedAgendas.findIndex(
                        (i) => i._id === agendaItems[path[1]]._id
                      );
                      if (index > -1) {
                        if (
                          updatedAgendas[index].tasks &&
                          updatedAgendas[index].tasks.length > 0
                        ) {
                          updatedAgendas[index].tasks.push(item.rhs);
                        } else {
                          updatedAgendas[index].tasks = [item.rhs];
                        }
                      } else {
                        updatedAgendas.push({
                          tasks: [item.rhs],
                          _id: agendaItems[path[1]]._id,
                        });
                      }
                    }
                }
              } else if (item.kind === "D" && path.length === 3) {
                if (path[2] === "tasks" && item.lhs && item.lhs._id) {
                  let obj = { _id: item.lhs._id, is_remove: true };
                  const index = updatedAgendas.findIndex(
                    (i) => i._id === agendaItems[path[1]]._id
                  );
                  if (index > -1) {
                    if (
                      updatedAgendas[index].tasks &&
                      updatedAgendas[index].tasks.length > 0
                    ) {
                      updatedAgendas[index].tasks.push(obj);
                    } else {
                      updatedAgendas[index].tasks = [obj];
                    }
                  } else {
                    updatedAgendas.push({
                      tasks: [obj],
                      _id: agendaItems[path[1]]._id,
                    });
                  }
                }
              }
            } else {
              const agendaProp = path[2] || "";
              const index = agendaBits.indexOf(agendaProp);
              const key = path[1];
              if (index > -1 && key > -1) {
                switch (agenda.kind) {
                  case "E":
                    updatedAgendas.push(agendaItems[key]);
                    break;
                }
              }
            }
          }
        }
      }
    }
    updatedAgendas = _.uniqBy(updatedAgendas, "agendaId");

    return updatedAgendas;
  };

  getUpdatedAttendees = (data) => {
    let updatedAttendees = [];
    const { contactData, difference } = data;
    if (difference && difference.length > 0) {
      for (let attendee of difference) {
        const { path } = attendee;
        if (path && path.length > 0 && path[0] === "paricipants") {
          if (attendee.item && path.length === 1) {
            const { item } = attendee;
            switch (item.kind) {
              case "N":
                updatedAttendees.push({ ...item.rhs, is_deleted: false });
                break;
              case "D":
                if (item.lhs._id) {
                  updatedAttendees.push({ ...item.lhs, is_deleted: true });
                }
                break;
            }
          } else if (path.length === 3) {
            let bit = path[2] || "";
            if (bit === "canEdit") {
              updatedAttendees.push({
                ...contactData[path[1]],
                is_deleted: false,
              });
            }
          }
        }
      }
    }
    updatedAttendees = _.uniqBy(updatedAttendees, "email");
    return updatedAttendees;
  };

  setUpdateMeetingData = (value) => {
    const {
      createMeetingData,
      agendaItems,
      meetingDocuments,
      addedParticipants,
      userDetails,
      organizationData,
      updateMeeting,
      meetingId,
      private_notes,
      logo,
      togglePrivateNote,
      dataToPrint,
      setMeetingsType,
      meetingDetail,
      fetchParticularMeetingData,
      setMeetingSummaryData,
    } = this.props;
    const {
      meetingNotes,
      selectedParticipants,
      reccurenceEditModal,
      share,
      isShareOpen,
      oldParticipants,
    } = this.state;
    const contactData = _.unionWith(
      selectedParticipants,
      addedParticipants,
      (a, b) => a.email === b.email
    );
    togglePrivateNote(false);
    const { updatedBits, difference } = calculateDifference(
      {
        ...meetingDetail,
        meetingNotes,
      },
      oldParticipants
    );

    // let agendaItem= this.getUpdatedAgendas({
    //   agendaItems,
    //   difference,
    // })
    let obj = {
      ..._.pick(
        {
          ...createMeetingData,
          private_notes,
          documents: meetingDocuments,
          notes: meetingNotes,
        },
        updatedBits
      ),
      participants: contactData,
      email: userDetails.email || "",
      _id: meetingId,
      owner: userDetails.name || "",
      company: organizationData.organizationName || "",
      share,
      logo,
      isEditAll: value === "all" ? true : false,
    };
    const agendas = [];
    agendaItems &&
      agendaItems.length > 0 &&
      agendaItems.map((item) => {
        if (
          item.tasks &&
          item.tasks.length === 1 &&
          item.tasks[0].task === ""
        ) {
          let obj = item;
          delete obj.tasks;
          agendas.push(obj);
        } else {
          let agenda = item;

          let tasksData = item.tasks;
          let tasksArr = [];
          tasksData &&
            tasksData.length > 0 &&
            tasksData.map((task) => {
              let object = { ...task };
              object.assign_to = [];

              task.assign_to &&
                task.assign_to.length > 0 &&
                task.assign_to.map((item) => {
                  if (item.email) {
                    object.assign_to.push(item.email);
                  } else {
                    object.assign_to.push(item);
                  }
                });
              tasksArr.push(object);
            });
          agenda.tasks = tasksArr;
          agendas.push(agenda);
        }
      });
    obj.agendas = agendas;
    updateMeeting(obj).then((result) => {
      const { status } = result.payload.data;
      if (status === 200) {
        setMeetingsType("upcoming");
        fetchParticularMeetingData({
          id: meetingId,
        }).then((result) => {
          const { meeting, status, message } = result.payload.data;
          if (status === 200) {
            setMeetingSummaryData(meeting, userDetails.email || "");
            // updateEditPermission(userDetails, meeting.attendees);
            if (meeting) {
              this.setState({
                meetingNotes: meeting.notes,
              });
            }
          } else {
            ToasterModal(status, message);
          }
        });
        if (isShareOpen) {
          this.setState({
            isUpdated: false,
          });
        } else {
          this.setState({
            isUpdated: false,
          });
        }
      }
    });
  };

  toggleEditMeeting = () => {
    const { canEdit } = this.props;
    if (this.meetingEditRef.openModal && canEdit) {
      this.meetingEditRef.openModal();
    }
  };

  handleSummaryDownload = (type) => {
    const { createMeetingData, dataToPrint } = this.props;
    const name = createMeetingData.title || Date.now().toString();
    const file_name = name.replace(/[^A-Z0-9]+/gi, "_");
    const html = renderToString(
      <html>
        <head>
          <link
            href="https://fonts.googleapis.com/css?family=Raleway:400,500,700,800&display=swap"
            rel="stylesheet"
          />
        </head>
        <body>
          <MeetingsPdf type={type} dataToPrint={dataToPrint} />
        </body>
      </html>
    );
    if (type === "pdf") {
      handlePdfDownload(html, name);
    } else {
      handleDocDownload(html, file_name);
    }
  };

  handleSharePdf = (emails, callback) => {
    const {
      createMeetingData,
      dataToPrint,
      sharePdf,
      userDetails,
    } = this.props;
    // const name = createMeetingData.title || Date.now().toString()
    // const file_name = name.replace(/[^A-Z0-9]+/gi, "_");
    const html = renderToString(
      <html>
        <body>
          <head>
            <link
              href="https://fonts.googleapis.com/css?family=Raleway:400,500,700,800&display=swap"
              rel="stylesheet"
            />
          </head>
          <MeetingsPdf dataToPrint={dataToPrint} />
        </body>
      </html>
    );
    const payload = {
      // meeting: createMeetingData.title,
      meeting_id: createMeetingData.meetingId,
      emails,
      attachment: `${html}`,
      sender_email: userDetails.email,
      // file_name
    };
    sharePdf(payload).then((res) => {
      if (res) {
        callback();
      }
    });
  };

  toggleMeetingModal = (type) => {
    const { selectedParticipants } = this.state;
    const { addedParticipants } = this.props;

    this.setState((prevState) => ({
      [type]: !prevState[type],
      selectedParticipants: !prevState[type]
        ? addedParticipants
        : selectedParticipants,
    }));
  };

  handleMeetingOpenClose = (type, modalType) => {
    const { meetingId, setMeetingStatus } = this.props;
    if (type === "close") {
      const obj = {
        meetingStatus: type,
        id: meetingId,
      };
      setMeetingStatus(obj);
    }
    this.toggleMeetingModal(modalType);
    if (type === "close") {
      this.handleUpdate(false, "", "isShareOpen");
      if (this.refs.isShareMeeting) {
        this.refs.isShareMeeting.shareToggle();
      }
    } else this.handleUpdate(false, "SaveUpdate");
  };

  isFiveMintuesToStart = () => {
    const { meetings, meetingId } = this.props;
    let meetingData =
      meetings &&
      meetings.length > 0 &&
      meetings.find((meeting) => {
        return meeting._id === meetingId;
      });
    let startMeetingDate = moment
      .utc(meetingData && meetingData.start_date_time)
      .toDate();
    const a = moment(startMeetingDate);
    const b = moment();
    const c = moment.duration(a.diff(b)).asMinutes();
    if (c <= 5) {
      return true;
    }
    return false;
  };

  isMeetingTimeOver = (dateTime) => {
    const a = moment(dateTime);
    const b = moment();
    const c = moment.duration(b.diff(a)).asMinutes();
    if (c > 0) return true;
    else return false;
  };

  handleHeaderClick = () => {
    const { meetingStatus } = this.props;
    const { meetingModalClose } = this.state;
    if (meetingStatus === "close") {
      this.setState({ meetingModalClose: !meetingModalClose });
    } else {
      this.toggleEditMeeting();
    }
  };

  updateMeetingStartEndStatus = (status) => {
    const { updateStartEndStatus, meetingId } = this.props;
    updateStartEndStatus({ id: meetingId, status });
  };

  meetingAttendance = () => {
    const {
      meetingAttendance,
      userDetails,
      createMeeting_id,
      createMeetingData,
      setAttendance,
    } = this.props;
    const obj = {
      attendee_email: userDetails.email,
      meeting_id: createMeeting_id,
      admin_email: createMeetingData.email,
    };
    meetingAttendance(obj).then((result) => {
      if (result) {
        MsgModal(result.payload.data.status, result.payload.data.message);
      }
      const { status } = result.payload.data;
      if (status === 200) {
        setAttendance(userDetails.email);
      }
      // createMeetingData.attendees.forEach(element => {
      //   if (element._id.email === userDetails.email) { element.is_present = true; return }
      // })
    });
  };

  toggleMeetingSaveModal = (type) => {
    const { addedParticipants } = this.props;
    let arr = [];
    if (addedParticipants && addedParticipants.length > 0) {
      for (let i in addedParticipants) {
        let obj = addedParticipants[i];
        if (
          addedParticipants[i].can_attend === "yes" ||
          addedParticipants[i].is_present
        ) {
          obj.can_attend = "yes";
          obj.is_present = true;
        }
        arr.push(obj);
      }
    }

    this.setState((prevState) => ({
      [type]: !prevState[type],
      selectedParticipants: !prevState[type] ? arr : [],
    }));
  };

  isAttendedMeeting = () => {
    const { userDetails, addedParticipants } = this.props;
    // eslint-disable-next-line no-unused-vars
    if (addedParticipants && addedParticipants.length > 0) {
      for (const element of addedParticipants) {
        if (element.email === userDetails.email && element.is_present) {
          return true;
        }
      }
    }
    // if (createMeetingData && createMeetingData.attendees && createMeetingData.attendees.length > 0) {
    //   for (const element of createMeetingData.attendees) {
    //     if ((element._id.email === userDetails.email) && element.is_present) {
    //       return true
    //     }
    //   }
    // }
    return false;
  };

  attendanceOptions = () => {
    const { meetingParticipants } = this.state;
    if (meetingParticipants && meetingParticipants.length > 0) {
      console.log("meetingParticipants", meetingParticipants);
      let paricipants = [];
      meetingParticipants.forEach((item) => {
        const dataItem = {
          value: item.email,
          data: item,
          label: item.email,
        };
        paricipants.push(dataItem);
      });
      return paricipants;
    }
    return [];
  };

  agendaDidUpdate = () => {
    const isOldMeeting =
      this.props && this.props.createMeeting_id ? true : false;
    if (this.state.agendaUpdated && isOldMeeting) {
      this.handleUpdate();
      this.setState({ agendaUpdated: false });
    }
  };

  reccurenceEditModalToggle = (e) => {
    this.setState((prevState) => ({
      reccurenceEditModal: !prevState.reccurenceEditModal,
    }));
  };
  render() {
    const {
      meetingModalClose,
      isOpenAgendaModal,
      meetingNotes,
      isCreated,
      openedValue,
      isUploading,
      agendaData,
      isUpdated,
      isUpdateAgenda,
      contacts,
      isCloseModal,
      isSavedModal,
      isOpenMeetingModal,
      reccurenceEditModal,
    } = this.state;
    const {
      status,
      meetingId,
      meetingStatus,
      createMeetingData,
      setAgendaItems,
      agendaItems,
      meetingDocuments,
      addedParticipants,
      deleteDocument,
      canEdit,
      isCreate,
      updateAgendaItem,
      meetingsDetails,
      dataToPrint,
      userDetails,
      setMeetingStatus,
      isAdmin,
      setEditAllMeetings,
      meetingData,
      allMeetings,
      meetingDetail,
    } = this.props;
    console.log("canEditcanEditcanEditcanEdit", agendaItems);
    let meetingID = meetingDetail && meetingDetail.meetingId;
    let stillUtcStart = moment.utc(createMeetingData.startDateTime).toDate();
    // let stillUtcEnd = moment.utc(createMeetingData.endDateTime).toDate();
    let startDate = moment(stillUtcStart).local().format("YYYY-MM-DD HH:mm:ss");
    const isReadyToStart = this.isFiveMintuesToStart();
    const isReadyToStop = this.isMeetingTimeOver(createMeetingData.endDateTime);
    // let endDate = moment(stillUtcEnd).local().format('YYYY-MM-DD HH:mm:ss');
    const isAttended = this.isAttendedMeeting();
    this.agendaDidUpdate();
    console.log("agendaItemsagendaItems", agendaItems);

    return (
      <>
        <EditReccurenceMeeting
          isOpen={reccurenceEditModal}
          toggle={this.reccurenceEditModalToggle}
          setUpdateMeetingData={this.setUpdateMeetingData}
          meetingData={meetingData}
          allMeetings={allMeetings}
          meetingId={meetingID}
          setEditAllMeetings={setEditAllMeetings}
        />
        <div className="dashboard-wrapper add-agenda-screen">
          <div className="dashboard-content">
            {/* <CloseModal onDone={null} title={"Opps"} message={"This meeting is closed and only allows you to handle your own tasks. Reopen the meeting if you want to add, edit or delete the meeting content."} isOpen={meetingModalClose} toggle={() => this.toggleMeetingModal("meetingModalClose")} meetingStatus={dataToPrint.meetingStatus} /> */}
            <CloseModal
              onDone={() =>
                this.handleMeetingOpenClose("close", "isCloseModal")
              }
              title="Are you sure want to close meeting?"
              isOpen={isCloseModal}
              toggle={() => this.toggleMeetingModal("isCloseModal")}
              meetingStatus={dataToPrint.meetingStatus}
            ></CloseModal>
            <CloseModal
              onDone={() =>
                this.handleMeetingOpenClose("saveAndEnd", "isSavedModal")
              }
              title="Select participants who attended meeting"
              isOpen={isSavedModal}
              toggle={() => this.toggleMeetingModal("isSavedModal")}
              meetingStatus={dataToPrint.meetingStatus}
            >
              {/* <h6>Select participants who attended meeting</h6> */}
              <Select
                isMulti
                // menuIsOpen
                hideSelectedOptions={true}
                value={this.seletedAttendedParticipants()}
                onChange={(data) => {
                  let participants = [];

                  //this.seletedAttendedParticipants()
                  if (data) {
                    data.forEach((item) => {
                      console.log("itemitemitem", item);
                      item.data.can_attend = "yes";
                      item.data.is_present = true;
                      participants.push(item.data);
                    });
                  }
                  this.setState({ selectedParticipants: participants });
                }}
                name="attendance"
                options={this.attendanceOptions()}
                className="basic-multi-select"
                classNamePrefix="invite"
                onCreateOption={(value) => {
                  const { contacts, selectedParticipants } = this.state;
                  const oldOptions = [...contacts];
                  const index = oldOptions.findIndex(
                    (item) => item.email === value
                  );
                  const selectedOld = [...selectedParticipants];
                  const selectedIndex = selectedOld.findIndex(
                    (item) => item.email === value
                  );
                  if (index <= -1) {
                    oldOptions.push({ email: value, can_attend: "yes" });
                    this.setState({ contacts: oldOptions });
                    if (selectedIndex <= -1) {
                      selectedOld.push({ email: value, can_attend: "yes" });
                      this.setState({ selectedParticipants: selectedOld });
                    }
                  }
                }}
                createOptionPosition="first"
                isValidNewOption={(i, v, op) => {
                  const { contacts } = this.state;
                  let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                  const index = contacts.findIndex(
                    (element) => element.email === i
                  );
                  let isNotExist = true;
                  if (index > -1) {
                    isNotExist = false;
                  }
                  return re.test(String(i).toLowerCase()) && isNotExist;
                }}
              />
            </CloseModal>
            <CloseModal
              onDone={() =>
                this.handleMeetingOpenClose("open", "isOpenMeetingModal")
              }
              rightAction={() => this.toggleMeetingModal("isOpenMeetingModal")}
              title="Reopen Meeting"
              message="Are you sure want to reopen this meeting"
              isOpen={isOpenMeetingModal}
              toggle={() => this.toggleMeetingModal("isOpenMeetingModal")}
              meetingStatus={dataToPrint.meetingStatus}
            />
            {(isCreated || isUpdated) && <Redirect to={"/view"} />}
            {!canEdit && (
              <div className="agenda-header">
                <h1 className="title">Meeting summary</h1>
              </div>
            )}
            <div className="agenda-header">
              <div className="agenda-wrap">
                <h1 className="title  shares-title">
                  {createMeetingData.title || ""}
                  <span className="ml-2">
                    {meetingStatus === "close" && (
                      <img src={LockIcon} alt="noImg" />
                    )}
                  </span>
                </h1>
                <div className="agenda-dropdown">
                  <span className="share-dropdown">
                    <DropdownShareOptions
                      ref="isShareMeeting"
                      setModal={(modalType) =>
                        this.toggleMeetingModal(modalType)
                      }
                      isReadyToStop={isReadyToStop}
                      meetingId={meetingId}
                      setMeetingStatus={setMeetingStatus}
                      meetingData={dataToPrint}
                      userDetails={userDetails}
                      addedParticipants={addedParticipants}
                      contacts={meetingsDetails.contacts}
                      handleSharePdf={this.handleSharePdf}
                      handleSummaryDownload={this.handleSummaryDownload}
                    />
                  </span>
                </div>
              </div>
            </div>
            <div className="dashboard-listWrap">
              <ul className="list-inline header-list">
                <li>
                  <img alt="" className="list-icon" src={CalenderIcon} />
                  <span>
                    {moment(startDate).format("dddd, MMMM DD, YYYY")}
                  </span>{" "}
                </li>
                <li>
                  <img alt="" className="list-icon" src={ClockIcon} />
                  <span>{moment(startDate).format("h: mm A")}</span>
                </li>
                <li>
                  <img
                    alt=""
                    className="list-icon navigation"
                    src={createMeetingData.location ? PlaceholderIcon : null}
                  />
                  <span>{createMeetingData.location || ""}</span>
                </li>
                {meetingStatus !== "close" &&
                  isReadyToStart &&
                  dataToPrint.status !== "completed" && (
                    <li className="startMeetBtn">
                      {isAdmin ? (
                        <button
                          className={`${(dataToPrint.status === "started" ||
                              isReadyToStop) &&
                            "disable"
                            }`}
                          disabled={
                            dataToPrint.status === "started" || isReadyToStop
                          }
                          onClick={() =>
                            this.updateMeetingStartEndStatus("started")
                          }
                        >
                          start Meeting
                        </button>
                      ) : (
                          dataToPrint.status === "started" && (
                            <button
                              className={`${isAttended && "disable"}`}
                              disabled={isAttended}
                              onClick={() => this.meetingAttendance()}
                            >
                              I'm attending
                            </button>
                          )
                        )}
                    </li>
                  )}

                {/* {meetingStatus !== 'close' && dataToPrint.status === 'started' && <li className="startMeetBtn"><button onClick={() => this.updateMeetingStartEndStatus("completed")}>End Meeting</button></li>}
            {meetingStatus !== 'close' && dataToPrint.status === 'completed' && <li className="startMeetBtn"><button >Completed</button></li>} */}
              </ul>
              <div className="mb-4">
                {(canEdit || isCreate) &&
                  meetingStatus !== "close" &&
                  status !== "started" && (
                    <button
                      onClick={this.handleHeaderClick}
                      className="edit-meetingBtn"
                    >
                      Edit Meeting
                      <span className="ml-2">
                        <img src={EditIcon} alt="" />
                      </span>
                    </button>
                  )}
              </div>
            </div>
            <MeetingEdit
              isEditMode={true}
              getRef={(ref) => (this.meetingEditRef = ref)}
            />
            {((agendaItems && agendaItems.length > 0) || canEdit) && (
              <div className="field-section">
                <h3 className="mb-4">Add Agenda</h3>
                <ul className="list-inline agenda-upload d-flex flex-wrap">
                  {agendaItems &&
                    agendaItems.length > 0 &&
                    agendaItems.map((item) => {
                      return (
                        <li
                          onClick={() => {
                            this.setState((prevState) => ({
                              isOpenAgendaModal: !prevState.isOpenAgendaModal,
                              agendaData: item,
                              isUpdateAgenda: true,
                            }));
                          }}
                        >
                          <Label>
                            <p className="mb-0 text-center">
                              {item.title ||
                                (item.agenda_id && item.agenda_id.title) ||
                                ""}
                            </p>
                          </Label>
                        </li>
                      );
                    })}
                  {canEdit && (
                    <li>
                      <Label>
                        <AddButtonIcon />
                        <Button
                          className="agenda-addBtn"
                          onClick={() => {
                            if (meetingStatus === "close") {
                              this.setState({
                                meetingModalClose: !meetingModalClose,
                              });
                            } else {
                              this.modaltoggle(null);
                            }
                          }}
                        ></Button>
                      </Label>
                    </li>
                  )}
                </ul>
              </div>
            )}
            <div className="field-section">
              <h3 className="mb-4">Add Participants</h3>
              <div className="image-upload">
                <ul className="list-inline image-upload">
                  {addedParticipants &&
                    addedParticipants.length > 0 &&
                    addedParticipants.map((item) => {
                      return (
                        <li>
                          <Label title={item.email || ""} className="image">
                            <div className="assigneeUser">
                              <span
                                className="partImg"
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  borderRadius: "100%",
                                }}
                              >
                                {/* {(item.email.charAt(0).toUpperCase())} */}
                                {circleCharacter(item)}
                              </span>
                              <span className="online-user">
                                {/* <button style={{ background: 'none', border: 'none' }}> */}
                                {item.is_present === true && (
                                  <img src={TickIcon} alt="" />
                                )}
                                {item.is_present === false &&
                                  item.can_attend === "yes" && (
                                    <span className="greenCircle"></span>
                                  )}
                                {item.is_present === false &&
                                  item.can_attend === "maybe" && (
                                    <span className="orangeCircle"></span>
                                  )}
                                {item.is_present === false &&
                                  (item.can_attend === "no" ||
                                    item.can_attend === "") && (
                                    <img src={RedCross} alt="" />
                                  )}
                                {/* <img src={item.is_present === true ? TickIcon : RedCross} alt="" /> */}
                                {/* </button> */}
                              </span>
                            </div>
                          </Label>
                        </li>
                      );
                    })}

                  {canEdit && (
                    <li>
                      <Label>
                        <AddButtonIcon />
                        <button
                          onClick={() => {
                            if (meetingStatus === "close") {
                              this.setState({
                                meetingModalClose: !meetingModalClose,
                              });
                            } else {
                              this.InviteModalToggle();
                            }
                          }}
                        ></button>
                      </Label>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* {canEdit && ( */}
            <div className="field-section">
              <h3>
                Add Document
                  <span className="upload-pdf">
                  {canEdit && (
                    <Label>
                      {meetingStatus === "close" ? (
                        <span
                          onClick={() => {
                            this.setState({
                              meetingModalClose: !meetingModalClose,
                            });
                          }}
                        >
                          <img src={PlusIcon} alt="noImg" />
                        </span>
                      ) : (
                          <span>
                            <input
                              onChange={(e) => {
                                this.handleAddDocuments(e);
                              }}
                              accept="application/pdf,application/msword,
                              application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              type="file"
                            />
                            <img src={PlusIcon} alt="noImg" />
                          </span>
                        )}
                    </Label>
                  )}
                </span>
              </h3>
              <ul className="list-inline document-upload">
                {meetingDocuments &&
                  meetingDocuments.length > 0 &&
                  meetingDocuments.map((document) => {
                    return (
                      <li>
                        <Label>
                          <div className="doc-content">
                            <a download href={document.url} target="_blank">
                              {/* <img
                                  src={PDFIcon}
                                  alt="noImg"
                                  className="img-fluid"
                                /> */}
                              <img
                                src={
                                  document.type === "pdf"
                                    ? PDFIcon
                                    : document.type === "docx"
                                      ? DocxIcon
                                      : DocIcon
                                }
                                alt="noImg"
                                className="img-fluid"
                              />
                              {/* <img
                                  src={DocxIcon}
                                  alt="noImg"
                                  className="img-fluid"
                                />{" "} */}

                              <p title={document.name || ""}>
                                {document.name || ""}
                              </p>
                            </a>
                          </div>
                          {canEdit && meetingStatus !== "close" && (
                            <Dropdown
                              isOpen={
                                this.state.dropdownOpen &&
                                document.url === openedValue
                              }
                              toggle={(e) => this.toggle(document.url)}
                              className="edit-icon"
                            >
                              <DropdownToggle>
                                <Edit />
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem
                                  onClick={(e) => {
                                    if (meetingStatus === "close") {
                                      this.setState({
                                        meetingModalClose: !meetingModalClose,
                                      });
                                    } else {
                                      deleteDocument(document);
                                    }
                                  }}
                                >
                                  Delete
                                  </DropdownItem>
                                {/* <DropdownItem divider />
                    <DropdownItem >Link to agenda item</DropdownItem> */}
                              </DropdownMenu>
                            </Dropdown>
                          )}
                        </Label>
                      </li>
                    );
                  })}
                {isUploading && (
                  <li>
                    <div className="doc-content">
                      <span style={{ textAlign: "center" }}>
                        <Loader
                          type="TailSpin"
                          color="#00BFFF"
                          height={60}
                          width={60}
                        />
                          Uploading...
                        </span>
                    </div>
                  </li>
                )}
              </ul>
            </div>
            {/* )} */}
            <div className="field-section">
              <h3>Comments</h3>
              <textarea
                value={meetingNotes}
                onChange={(e) => {
                  if (meetingStatus === "close") {
                    this.setState({ meetingModalClose: !meetingModalClose });
                  } else {
                    this.setState({ meetingNotes: e.target.value });
                  }
                }}
                disabled={meetingStatus === "close"}
              ></textarea>

              {!isCreate && canEdit && meetingStatus !== "close" && (
                <div className="agenda-submitBtn">
                  {
                    <button
                      onClick={() => {
                        if (meetingStatus === "close") {
                          this.setState({
                            meetingModalClose: !meetingModalClose,
                          });
                        } else {
                          this.handleUpdate(false);
                        }
                      }}
                      type="button"
                      className="btn btn-gradient"
                    >
                      Save
                    </button>
                  }
                  {meetingStatus !== "close" && (
                    <button
                      onClick={() => {
                        if (status === "started") {
                          this.toggleMeetingSaveModal("isSavedModal");
                        } else {
                          if (meetingStatus === "close") {
                            this.setState({
                              meetingModalClose: !meetingModalClose,
                            });
                          } else {
                            this.handleUpdate(true, "");
                          }
                        }
                      }}
                      type="button"
                      className="btn btn-gradient"
                    >
                      {status === "started" ? "Save & End" : "Save & Share"}
                    </button>
                  )}
                </div>
              )}

              {isCreate && meetingStatus !== "close" && (
                <div className="agenda-submitBtn">
                  <button
                    onClick={() => {
                      if (meetingStatus === "close") {
                        this.setState({
                          meetingModalClose: !meetingModalClose,
                        });
                      } else {
                        this.handleCreateMeeting(false);
                      }
                    }}
                    type="button"
                    className="btn btn-gradient"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      if (meetingStatus === "close") {
                        this.setState({
                          meetingModalClose: !meetingModalClose,
                        });
                      } else {
                        this.handleCreateMeeting(true);
                      }
                    }}
                    type="button"
                    className="btn btn-gradient"
                  >
                    Save & Share
                  </button>
                </div>
              )}
              {!isCreate && !canEdit && meetingStatus !== "close" && (
                <div className="text-center">
                  <button
                    onClick={() => this.handleUpdate(false)}
                    type="button"
                    className="btn btn-gradient mt-3"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            {isOpenAgendaModal && (
              <AddAgendaModal
                userDetails={userDetails}
                meetingStatus={meetingStatus}
                status={status}
                isReadyToStart={isReadyToStart}
                ref={this.agendaRef}
                contacts={meetingsDetails.contacts}
                participants={addedParticipants}
                isCreate={isCreate}
                canEdit={canEdit}
                isUpdateAgenda={isUpdateAgenda}
                updateAgendaItem={updateAgendaItem}
                modaltoggle={this.modaltoggle}
                isOpen={true}
                setAgendaItems={setAgendaItems}
                agendaData={agendaData}
              />
            )}
            <Modal
              isOpen={this.state.inviteModal}
              toggle={this.InviteModalToggle}
              className="create-meeting-modal invite-modal"
            >
              <ModalHeader toggle={this.InviteModalToggle}>
                Invite<span onClick={this.handleParticipants}>Done</span>
              </ModalHeader>
              <ModalBody>
                <div className="invite-screen mb-5">
                  <h2>
                    Give other people to access to this meeting in minute.
                  </h2>
                  <p>
                    For every participant that signs up for minute through your
                    invite, you will receive 30 days of Premium service for
                    free!
                  </p>
                  <Select
                    isMulti
                    menuIsOpen
                    hideSelectedOptions={false}
                    value={this.seletedView()}
                    onChange={(data) => {
                      let participants = [];
                      if (data) {
                        data.forEach((item) => {
                          console.log("itemitemitem11", item);
                          participants.push(item.data);
                        });
                      }
                      this.setState({ selectedParticipants: participants });
                    }}
                    name="colors"
                    options={this.getFormattedParticipantsData()}
                    className="basic-multi-select"
                    classNamePrefix="invite"
                    formatCreateLabel={(value) => {
                      return <InviteUserItems label={value || ""} />;
                    }}
                    onCreateOption={(value) => {
                      const { contacts, selectedParticipants } = this.state;
                      const oldOptions = [...contacts];
                      const index = oldOptions.findIndex(
                        (item) => item.email === value
                      );
                      const selectedOld = [...selectedParticipants];
                      const selectedIndex = selectedOld.findIndex(
                        (item) => item.email === value
                      );
                      if (index <= -1) {
                        oldOptions.push({ email: value });
                        this.setState({ contacts: oldOptions });
                        if (selectedIndex <= -1) {
                          selectedOld.push({ email: value });
                          this.setState({ selectedParticipants: selectedOld });
                        }
                      }
                    }}
                    createOptionPosition="first"
                    isValidNewOption={(i, v, op) => {
                      const { contacts } = this.state;
                      let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                      const index = contacts.findIndex(
                        (element) => element.email === i
                      );
                      let isNotExist = true;
                      if (index > -1) {
                        isNotExist = false;
                      }
                      return re.test(String(i).toLowerCase()) && isNotExist;
                    }}
                  />
                </div>
              </ModalBody>
            </Modal>
            {/* <MeetingsPdf dataToPrint={dataToPrint} /> */}
          </div>
        </div>
      </>
    );
  }
}
