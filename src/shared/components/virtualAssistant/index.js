import React from "react";
import { connect } from "react-redux";
import Listner from "./components/Listner";
import { Collapse } from "reactstrap";
import Options from "./components/Options";
// import ChatBot from "../../icons/chatBot";
// import CrossIcon from "../../icons/cross";
import CloseIcon from "../../icons/close";
import HeadsetIcon from "../../icons/headset";
import CreateMeeting from "./components/createMeeting";
// import ContinueArrow from "../../../asset/images/virtual-assistant/continueArrow.png";
// import withVA from "../../../hoc/VAsistant";
import withVA from "./hoc/VAsistant";

import { compose, bindActionCreators } from "redux";
import { test, setVA } from "./actions";
import MeetingMenu from "./components/MeetingMenu";
import AddTask from "./components/addTasks";
class VBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      activeStep: 1,
      fullSpeech: [],
      isListner: true,
    };
  }
  componentDidMount() {
    this.props.setVA(this.props.VA);
  }
  analyseSpeech = () => {
    const {
      fullSpeech: [lastCommand],
    } = this.state;
    const navigateTo = ["create", "meeting"].every((el) =>
      lastCommand.includes(el)
    )
      ? "create_meeting"
      : ["create", "task"].every((el) => lastCommand.includes(el))
      ? "create_task"
      : "";
    this.navigateTo(navigateTo);
  };
  getStep(which) {
    return {
      create_meeting: 3,
      create_task: 2,
    }[which];
  }
  navigateTo = (where) => {
    where && this.setState({ activeStep: this.getStep(where) });
  };
  componentDidUpdate(prevProps) {
    const { recognizedText } = this.props;
    if (prevProps.recognizedText !== recognizedText) {
      this.setState(
        (s) => ({
          fullSpeech: [recognizedText, ...s.fullSpeech],
        }),
        this.analyseSpeech
      );
    }
  }
  promisedSetState = (state) => {
    return new Promise((resolve) => {
      this.setState(state, () => {
        resolve();
      });
    });
  };
  toggleVI = async (e) => {
    if (!e.isTrusted) return;
    const that = this;
    await this.promisedSetState((s) => ({ isOpen: !s.isOpen }));
    const {
      props: { startVA, stopVA },
      state: { isOpen },
    } = this;
    isOpen
      ? startVA()
      : (function () {
          stopVA();
          that.setState({ activeStep: 1, isListner: true });
        })();
  };
  setActiveStep = (activeStep) => {
    this.setState({ activeStep });
  };
  setListner = (to) => {
    this.setState({ isListner: to });
  };
  render() {
    const {
      isOpen,
      isListner,
      activeStep,
      createMeeting,
      fullSpeech,
    } = this.state;
    const { setActiveStep, toggleVI } = this;
    const { individualUserData,organizationData,userDetails } = this.props;
    return (
      <>
        <Collapse isOpen={isOpen} className="virtual-assistant-main">
          <div className="virtual-assistant">
            {isListner && <Listner isTop={activeStep > 1} />}
            <div>
              {activeStep === 1 && <Options setActiveStep={setActiveStep} />}
              {activeStep === 2 && (
                <MeetingMenu setActiveStep={setActiveStep} />
              )}
              {activeStep === 3 && (
                <CreateMeeting
                  setListner={this.setListner}
                  fullSpeech={fullSpeech}
                  {...createMeeting}
                />
              )}

              {activeStep === 4 && <AddTask />}
              <div className="text-right">
                {/* <Button className="chatBotBtn">
                  <ChatBot />
                  {/* <CrossIcon /> */}
                {/* </Button> */}
                {/* <Button className="right-arrow">
                  <img src={ContinueArrow} alt="" />
                </Button> */}
              </div>
            </div>
          </div>
        </Collapse>
        {userDetails && userDetails.email && (individualUserData && individualUserData.license || organizationData && organizationData.organizationLicense) && <button
          onClick={toggleVI}
          className="virtual-assistant-toggle"
          style={isOpen ? {} : { fontSize: 26 }}
        >
          {isOpen ? <CloseIcon /> : <HeadsetIcon className="mb-1" />}
        </button>}
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  testProp: state.viReducer.testState,
  individualUserData : state.individualUserReducer,
  organizationData : state.organizationReducer,
  userDetails : state.userDetails
});
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    ...bindActionCreators({ test, setVA }, dispatch),
  };
};
export default compose(
  withVA,
  connect(mapStateToProps, mapDispatchToProps)
)(VBox);
