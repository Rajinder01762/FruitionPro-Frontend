import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ForgotComponent from "./ForgotComponent";
import { forgotPassApi } from './store/action';

const mapStateToProps = state => {
  return {
    sentMail: state.forgotReducer.sentMail
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    forgotPassApi
  }, dispatch);
};

const ForgotContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotComponent);

export default ForgotContainer;
