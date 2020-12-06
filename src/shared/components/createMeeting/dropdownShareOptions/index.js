import React, { Component } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import Select from "react-select/creatable";
import Edit from "../../../icons/moreIcon";
import { toast } from "react-toastify";
import { handleIcsDownload } from "./icalender";
import _ from "lodash";
// import CloseModal from "../meetingCloseModal";

export default class DropdownShareOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      modal: false,
      DocModal: false,
      format: "pdf",
      contacts: [],
      emails: []
    };
  }
  componentDidMount() {
    const { contacts, addedParticipants } = this.props;
    if (contacts && contacts.length > 0) {
      let contactData = contacts;
      if (addedParticipants && addedParticipants.length > 0) {
        contactData = _.unionWith(
          contacts,
          addedParticipants,
          (a, b) => a.email === b.email
        );
      }
      const options = [];
      contactData.forEach(data => {
        options.push({ label: data.email, value: data.email });
      });
      this.setState({ contacts: options });
    }
    if (addedParticipants && addedParticipants.length > 0) {
      const preSelected = [];
      addedParticipants.forEach(data => {
        preSelected.push({ label: data.email, value: data.email });
      });
      this.setState({ emails: preSelected });
    }
  }

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };

  shareToggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
      dropdownOpen: false,
      DocModal: false,
      format: "pdf"
      //  contacts: !prevState.modal ? prevState.contacts : [],
      // emails: !prevState.modal ? prevState.emails : []
    }));
  };

  documentToggle = () => {
    this.setState(prevState => ({
      DocModal: !prevState.DocModal
    }));
  };

  handleShareClick = () => {
    const { emails } = this.state;
    const { handleSharePdf } = this.props;
    let userEmails = [];
    if (emails.length > 0) {
      this.shareToggle();
      emails.forEach(element => {
        userEmails.push(element.value);
      });

      handleSharePdf(userEmails, () => {
        toast.success("Success", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          hideProgressBar: true
        });
      });
    } else {
      toast.error("Select email first", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
        hideProgressBar: true
      });
    }
  };

  handleAddToCalender = () => {
    const { meetingData, userDetails } = this.props;
    handleIcsDownload(meetingData, userDetails);
  };

  render() {
    const { format, emails, contacts, modal } = this.state;
    const { handleSummaryDownload, meetingData, setModal } = this.props;
    const { createMeetingData } = meetingData;

    return (
      <>
        <Dropdown
          isOpen={this.state.dropdownOpen}
          toggle={this.toggle}
          className="pdf-shares"
        >
          <DropdownToggle>
            <Edit />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>More</DropdownItem>
            <Button onClick={this.shareToggle}>
              <i className="fas fa-share-square"></i>Share Summary
            </Button>
            <DropdownItem divider></DropdownItem>
            <Button onClick={this.documentToggle}>
              <i className="fas fa-download"></i>Download Summary
            </Button>
            <DropdownItem divider></DropdownItem>
            <Button onClick={this.handleAddToCalender}>
              <i className="far fa-calendar-plus"></i>Add to Calendar
            </Button>
            {meetingData.status === "started" &&
              !createMeetingData.isMeetingClosed && (
                <>
                  <DropdownItem divider></DropdownItem>
                  <Button
                    onClick={() => {
                      const type = "isCloseModal";
                      setModal(type);
                      this.setState({
                        dropdownOpen: false
                      });
                    }}
                  >
                    <i className="fas fa-lock"></i>Close Meeting
                  </Button>
                </>
              )}
          </DropdownMenu>
        </Dropdown>
        <Modal
          isOpen={modal}
          toggle={this.shareToggle}
          className="create-meeting-modal share-summary"
          style={{ maxWidth: "600px" }}
        >
          <ModalHeader toggle={this.shareToggle}>
            Share Summary<span onClick={this.shareToggle}>Done</span>
          </ModalHeader>
          <ModalBody>
            <h2>Select format you want to share?</h2>
            <div className="download-options">
              <FormGroup tag="fieldset">
                <FormGroup check>
                  <Label check>
                    <Input
                      onChange={() => this.setState({ format: "pdf" })}
                      checked={format === "pdf"}
                      type="radio"
                      name="format"
                    />
                    PDF
                  </Label>
                </FormGroup>
                {/* <FormGroup check>
                  <Label check>
                    <Input
                      onChange={() => this.setState({ format: "doc" })}
                      checked={format === "doc"}
                      type="radio"
                      name="format"
                    />
                    Document
                  </Label>
                </FormGroup> */}
              </FormGroup>
            </div>

            <Select
              isMulti
              // menuIsOpen
              hideSelectedOptions={false}
              value={emails}
              onChange={data => {
                this.setState({ emails: data });
              }}
              name="colors"
              options={contacts}
              className="basic-multi-select"
              classNamePrefix="share"
              onCreateOption={value => {
                const { contacts, emails } = this.state;
                const oldOptions =
                  contacts && contacts.length > 0 ? [...contacts] : [];
                const index =
                  oldOptions && oldOptions.length > 0
                    ? oldOptions.findIndex(item => item.value === value)
                    : -1;
                const selectedOld =
                  emails && emails.length > 0 ? [...emails] : [];
                const selectedIndex =
                  selectedOld && selectedOld.length > 0
                    ? selectedOld.findIndex(item => item.value === value)
                    : -1;
                if (index <= -1) {
                  oldOptions.push({ label: value, value });
                  this.setState({ contacts: oldOptions });
                  if (selectedIndex <= -1) {
                    selectedOld.push({ label: value, value });
                    this.setState({ emails: selectedOld });
                  }
                }
              }}
              createOptionPosition="first"
              isValidNewOption={(i, v, op) => {
                let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(i).toLowerCase());
              }}
            />

            <div className="download-btn">
              <Button onClick={this.handleShareClick}>Share</Button>
            </div>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={this.state.DocModal}
          toggle={this.documentToggle}
          className="create-meeting-modal share-summary"
          style={{ maxWidth: "600px" }}
        >
          <ModalHeader toggle={this.documentToggle}>
            Download Summary
          </ModalHeader>
          <ModalBody>
            <h2>Select option Which you want to download?</h2>
            <div className="download-options">
              <FormGroup tag="fieldset">
                <FormGroup check>
                  <Label check>
                    <Input
                      onChange={() => this.setState({ format: "pdf" })}
                      checked={format === "pdf"}
                      type="radio"
                      name="format"
                    />
                    PDF
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      onChange={() => this.setState({ format: "doc" })}
                      checked={format === "doc"}
                      type="radio"
                      name="format"
                    />
                    Document
                  </Label>
                </FormGroup>
              </FormGroup>
              {format === 'doc' && <text style={{ fontSize: 12, color: 'red' }}>**Warning: In case your word editor’s version is incompatible, you might not be able to open this file. Please use google docs to edit this file.</text>}
            </div>
            <div className="download-btn">
              <Button
                onClick={() => {
                  handleSummaryDownload(format);
                  this.documentToggle();
                }}
              >
                Download
              </Button>
            </div>
          </ModalBody>
        </Modal>
      </>
    );
  }
}
