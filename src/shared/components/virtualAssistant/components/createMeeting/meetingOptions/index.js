import React, { useEffect, useState, Component } from "react";

import { Input, FormGroup, Label, Col, Row, Button } from "reactstrap";
import AddParticipants from "../addParticipants";
import UserImg from "../../../../../../asset/images/virtual-assistant/user.jpg";
import VModal from "../../shared/vModal";
import AddDocument from "../AddDocument";
import Recurrence from "../recurrence";

class MeetingOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pModalIsOpen: false,
      addDocumentsModal: false,
      textFieldAgenda: false,
      textFieldLocation: false,
      selectedParticipants: [],
      isRecurrence: false,
      search: "",
      agenda: "",
      location: "",
    };
  }
  toggleRecurrence = () => {
    const { isRecurrence } = this.state;
    this.setState({ isRecurrence: !isRecurrence });
  };
  toggleParticipantModal = () => {
    this.setState((s) => {
      return {
        pModalIsOpen: !s.pModalIsOpen,
      };
    });
  };
  onSearchChange = (e) => {
    e.preventDefault();
    this.setState({
      search: e.target.value,
    });
  };

  selectParticipants = (p) => () => {
    const { selectedParticipants } = this.state;
    this.setState((s) => {
      const found = selectedParticipants.find((el) => el.id === p.id);
      return {
        selectedParticipants: found
          ? s.selectedParticipants.filter((el) => el.id !== p.id)
          : [...s.selectedParticipants, p],
      };
    });
  };

  toggleDocuments = () => {
    this.setState((s) => {
      return {
        addDocumentsModal: !s.addDocumentsModal,
      };
    });
  };
  toggleTextFieldModal = (type) => {
    if (type === "agenda") {
      this.setState((s) => {
        return {
          textFieldAgenda: !s.textFieldAgenda,
        };
      });
    } else {
      this.setState((s) => {
        return {
          textFieldLocation: !s.textFieldLocation,
        };
      });
    }
  };
  handleInputChange = (name) => ({ target: { value } }) => {
    this.setState({ [name]: value });
  };

  render() {
    const {
      pModalIsOpen,
      addDocumentsModal,
      selectedParticipants,
      textFieldAgenda,
      agenda,
      textFieldLocation,
      location,
      isRecurrence,
    } = this.state;

    return (
      <div className="assistant-meeting">
        <h2>Create Meeting</h2>
        <div className="assistant-meeting">
          <h5 className="list-title">Participants</h5>
          <div className="participantsUsers">
            <img src={UserImg} alt="" />
            <img src={UserImg} alt="" />
            <div className="add-user">
              <i className="fas fa-pencil-alt" />
            </div>
          </div>
        </div>
        <div className="d-flex flex-wrap">
          {textFieldAgenda && (
            <Row>
              <Col sm={12}>
                <FormGroup>
                  <Input
                    onChange={this.handleInputChange("agenda")}
                    type="text"
                    id="agenda"
                    value={agenda}
                    placeholder=" "
                  />
                  <Label for="agenda" className="mb-0 label">
                    Agenda
                  </Label>
                </FormGroup>
              </Col>
            </Row>
          )}
          {textFieldLocation && (
            <Row>
              <Col sm={12}>
                <FormGroup>
                  <Input
                    onChange={this.handleInputChange("location")}
                    type="text"
                    id="location"
                    value={location}
                    placeholder=" "
                  />
                  <Label for="location" className="mb-0">
                    Location
                  </Label>
                </FormGroup>
              </Col>
            </Row>
          )}
          <Button
            className="subMeetingsBtn blue w-100 partBtn"
            onClick={this.toggleParticipantModal}
          >
            <i className="fas fa-plus" />
            Add Participants
          </Button>
          <Button
            className="subMeetingsOptions red"
            style={{ width: "122px" }}
            onClick={(e) => this.toggleTextFieldModal("agenda")}
          >
            Add Agenda
            <i className="fas fa-pencil-alt ml-2"></i>
          </Button>
          <Button
            className="subMeetingsOptions green"
            style={{ width: "165px" }}
            onClick={this.toggleDocuments}
          >
            Add Document  <i className="fas fa-pencil-alt ml-2"></i>
          </Button>
          <Button
            className="subMeetingsOptions orange"
            style={{ width: "144px" }}
            onClick={(e) => this.toggleTextFieldModal("location")}
          >
            Add Location
            <i className="fas fa-pencil-alt ml-2"></i>
          </Button>
          <Button
            onClick={this.toggleRecurrence}
            className="subMeetingsOptions blue recurrence"
            style={{ width: "144px" }}
          >
            Recurrence
            <p>On</p>
          </Button>
        </div>
        {pModalIsOpen && (
          <VModal title="Add Participants" toggle={this.toggleParticipantModal}>
            <AddParticipants
              participants={this.props.participants}
              selectParticipants={this.selectParticipants}
              selectedParticipants={selectedParticipants}
              search={this.state.search}
              onSearchChange={this.onSearchChange}
            />
          </VModal>
        )}
        {addDocumentsModal && (
          <VModal title="Add Documents" toggle={this.toggleDocuments}>
            <AddDocument />
          </VModal>
        )}
        {isRecurrence && (
          <VModal className="recurrence-modal" toggle={this.toggleRecurrence}>
            <Recurrence />
          </VModal>
        )}
      </div>
    );
  }
}

export default MeetingOptions;
