import React, { Component } from "react";

import AddParticipants from "./AddParticipants";

import VModal from "../shared/VModal";
import AddDocument from "./AddDocument";
import Recurrence from "./recurrence";

class OtherDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pModalIsOpen: false,
      addDocumentsModal: false,
      showAgendaField: false,
      showLocationFiel: false,
      search: "",
      isRecurrence: false,
    };
  }

  // componentWillUnmount() {
  // 	this.props.lift(this.state);
  // }

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
    this.props.handlePartcipantsChange(p);
  };

  toggleDocuments = () => {
    this.setState((s) => {
      return {
        addDocumentsModal: !s.addDocumentsModal,
      };
    });
  };
  toggleRecurrence = () => {
    this.setState((s) => {
      return {
        isRecurrence: !s.isRecurrence,
      };
    });
  };
  toggleTextField = (type) => () => {
    if (type === "agenda") {
      this.setState((s) => {
        return {
          showAgendaField: !s.showAgendaField,
        };
      });
    } else {
      this.setState((s) => {
        return {
          showLocationFiel: !s.showLocationFiel,
        };
      });
    }
  };
  // handleInputChange = (name) => ({ target: { value } }) => {
  // 	this.setState({ [name]: value });
  // };

  render() {
    const {
      pModalIsOpen,
      addDocumentsModal,
      showAgendaField,
      showLocationFiel,
      isRecurrence,
    } = this.state;

    const { selectedParticipants, handleChange, documents } = this.props;

    return (
      <div className="assistant-meeting">
        {this.props.children(
          this.toggleParticipantModal,
          showAgendaField,
          showLocationFiel,
          this.toggleTextField,
          this.toggleDocuments,
          this.toggleRecurrence
        )}
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
            <AddDocument
              handleFileChange={handleChange("documents")}
              documents={documents}
            />
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

export default OtherDetails;
