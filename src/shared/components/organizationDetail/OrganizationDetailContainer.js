import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import OrganizationDetailComponent from "./OrganizationDetailComponent";
import { selectOrganization, } from './store/action'
import { setLoginCredentials, setSession } from '../login/store/action';
import { setAccountType, setUserAccount } from "../accountType/store/action";
const mapStateToProps = state => {
  return {
    registerUser: state.registerUser,
    isTypeSet: state.individualUserReducer.isTypeSet,
    organization: state.organizationReducer,
    userDetails: state.userDetails
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { selectOrganization, setLoginCredentials, setSession, setAccountType, setUserAccount },
    dispatch
  );
};

const OrganizationDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationDetailComponent);

export default OrganizationDetailContainer;
