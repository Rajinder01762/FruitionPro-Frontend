import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ContactsComponent from "./ContactsComponent";
import { importSocialContacts } from '../wrapper/store/action';
import { deleteContact } from '../dashboard/store/action';
import { fetchContacts } from '../dashboard/store/action';
const mapStateToProps = state => {
  return {
    userDetails : state.userDetails,
    meetingReducer: state.meetingReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ importSocialContacts, deleteContact, fetchContacts }, dispatch);
};

const ContactsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactsComponent);

export default ContactsContainer;
