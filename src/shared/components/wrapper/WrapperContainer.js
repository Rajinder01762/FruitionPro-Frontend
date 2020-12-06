import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import WrapperComponent from "./WrapperComponent";
import { fetchContacts } from "../dashboard/store/action";
import {resetMeetingData} from "../createMeeting/store/action"

const mapStateToProps = state => {
  return {
    userDetails: state.userDetails,
    isTypeSet: state.individualUserReducer.isTypeSet
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ fetchContacts, resetMeetingData }, dispatch);
};

const WrapperContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(WrapperComponent);

export default WrapperContainer;
