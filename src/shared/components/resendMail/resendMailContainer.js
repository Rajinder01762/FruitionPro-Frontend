import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import resendMailComponent from "./resendMailComponent";
import { resendVerificationMail  } from './store/action';

const mapStateToProps = state => {
  return {
    sentMail: state.forgotReducer.sentMail
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    resendVerificationMail
  }, dispatch);
};

const resendMailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(resendMailComponent);

export default resendMailContainer;
