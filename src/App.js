import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
// import { Container } from "reactstrap";
//import { store } from './shared/store/store/index'
// import Logo from "./asset/images/dashboard-icons/logo.png";
import LoginContainer from "./shared/components/login/LoginContainer";
import RegisterContainer from "./shared/components/register/RegisterContainer";
import ForgotContainer from "./shared/components/forgot/ForgotContainer";
import ChangePasswordContainer from "./shared/components/changePassword/ChangePasswordContainer";
import SuccessContainer from "./shared/components/success/SuccessContainer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import Loader from "react-loader-spinner";
import WrapperContainer from "./shared/components/wrapper/WrapperContainer";
import VerifyEmailContainer from "./shared/components/verify-email/VerifyEmailContainer";
import AccountTypeContainer from "./shared/components/accountType/AccountTypeContainer";
import OrganizationDetailContainer from "./shared/components/organizationDetail/OrganizationDetailContainer";
import ResendMailContainer from "./shared/components/resendMail/resendMailContainer";
import GridCalendarContainer from "./shared/components/gridCalendar/GridCalendarContainer";

// import { StripeProvider, Elements } from 'react-stripe-elements'
// import { frontendUrl } from "../src/api/index";

import VirtualAssistant from "./shared/components/virtualAssistant";

toast.configure();

const LoaderComponent = (props) => {
  const { isLoading } = props;
  if (isLoading) {
    return (
      <div className="loader">
        <Loader type="TailSpin" color="#00BFFF" height={100} width={100} />
        <div className="load-text">Please wait ...</div>
      </div>
    );
  } else {
    return null;
  }
};

const Myloader = connect((state) => ({
  isLoading: state.sessionReducer.isLoading,
}))(LoaderComponent);

const PrivateRoute = ({
  component: Component,
  redirectTo,
  isLoginComponent,
  ...rest
}) => {
  let isLogin = JSON.parse(localStorage.getItem("isLogin"));
  if (isLoginComponent) {
    isLogin = !isLogin;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isLogin ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: redirectTo, state: { from: props.location } }}
          />
        )
      }
    />
  );
};

//const RouteWithData = connect((state) => ({ isLoginSuccess: state.userDetails.isLoginSuccess }), null)(PrivateRoute)
export class App extends React.Component {
  render() {
    // const isLogin = JSON.parse(localStorage.getItem("isLogin")) ? true : false;
    return (
      <div>
        <Router>
          <Myloader />
          <Switch>
            <PrivateRoute
              isLoginComponent={true}
              redirectTo="/view"
              path="/"
              exact
              component={LoginContainer}
            />
            <PrivateRoute
              isLoginComponent={false}
              redirectTo="/"
              path="/view"
              component={WrapperContainer}
            />
            <Route
              exact
              path="/change-password"
              component={ChangePasswordContainer}
            />
            <Route path="/register" exact component={RegisterContainer} />
            <Route
              path="/verification-email"
              exact
              component={ResendMailContainer}
            />
            <Route path="/forgot" exact component={ForgotContainer} />
            <Route path="/success" exact component={SuccessContainer} />
            <Route
              path="/verify-email"
              exact
              component={VerifyEmailContainer}
            />
            <Route
              path="/account-type"
              exact
              component={AccountTypeContainer}
            />
            <Route
              path="/organization-detail"
              exact
              component={OrganizationDetailContainer}
            />
            <Route path="/calendar" exact component={GridCalendarContainer} />
            <Redirect to="/view" component={LoginContainer} />
          </Switch>
        </Router>
        <VirtualAssistant test={"test"} />
      </div>
    );
  }
}
export default App;
