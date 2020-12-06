import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import SuccessComponent from "./SuccessComponent";
import { setSentMail } from '../forgot/store/action';

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setSentMail}, dispatch);
};

const SuccessContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SuccessComponent);

export default SuccessContainer;
