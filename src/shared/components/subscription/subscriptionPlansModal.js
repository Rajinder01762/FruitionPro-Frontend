import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import BasicPlanModal from "./basicPlanModal";
import PaymentModal from "./paymentModal";
import { Elements } from "react-stripe-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getFreeTrailPlan } from "./store/action";
import modal from "../../util/index";
import { clearPaymentDetails } from "./store/action";

class SubscriptionPlansModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBasicPlanModal: false,
      selectedPlan: "Monthly",
      planDetail: null,
      isPaymentModal: false,
      quantity: 1,
      isFreeModalOpen: false,
    };
  }
  onPaymentToggle = () => {
    this.setState((prevState) => ({
      isPaymentModal: !prevState.isPaymentModal,
    }));
  };
  freePlanModalToggle = () => {
    this.setState((prevState) => ({
      isFreeModalOpen: !prevState.isFreeModalOpen,
    }));
  };
  onBasicPlanstoggle = (e, planId, plan, amount, planType) => {
    const { type } = this.props.organizationReducer;
    const { clearPaymentDetails } = this.props;
    clearPaymentDetails();
    let selectedPlan = {
      planId,
      plan,
      amount,
      type: planType,
    };
    if (type === "organization") {
      this.setState({
        isBasicPlanModal: !this.state.isBasicPlanModal,
        planDetail: selectedPlan,
      });
    } else {
      this.setState({
        isPaymentModal: !this.state.isPaymentModal,
        planDetail: selectedPlan,
      });
    }
  };
  onSelectPlan = (e) => {
    if (e.target.checked) {
      this.setState({
        selectedPlan: "Yearly",
      });
    } else {
      this.setState({
        selectedPlan: "Monthly",
      });
    }
  };

  getFreeTrailPlan = () => {
    console.log("dfgdfgdfgdfsgdsfgdsfg", this.props);
    const { getFreeTrailPlan, userDetails } = this.props;
    const obj = {
      email: userDetails.email,
    };
    getFreeTrailPlan(obj).then((result) => {
      const { status, message } = result.payload.data;
      if (status === 200) {
        this.setState({
          isFreeModalOpen: true,
        });
      }
    });
  };

  render() {
    const { isOpen, isToggle } = this.props;
    const { type, organizationLicense } = this.props.organizationReducer;
    const { license } = this.props.individualUserData;
    const {
      isBasicPlanModal,
      selectedPlan,
      planDetail,
      isPaymentModal,
      quantity,
      isFreeModalOpen,
    } = this.state;
    const monthlyPlan = [
      {
        planId: 1,
        plan: "PREMIUM PLAN",
        amount: "2.99",
        type: "month",
      },
      {
        planId: 2,
        plan: "PROFESSIONAL PLAN",
        amount: "2.55",
        type: "month",
      },
      {
        planId: 3,
        plan: "ENTERPRISE PLAN",
        amount: "6.99",
        type: "month",
      },
    ];
    const yearlyPlan = [
      {
        planId: 4,
        plan: "BASIC",
        amount: "50",
        type: "year",
      },
      {
        planId: 5,
        plan: "STANDARD",
        amount: "70",
        type: "year",
      },
      {
        planId: 6,
        plan: "PROFESSIONAL",
        amount: "90",
        type: "year",
      },
    ];

    return (
      <div>
        {/* <Modal
          isOpen={isOpen}
          toggle={isToggle}
          className="subscription-plansModal"
        >
          <ModalHeader toggle={isToggle}>Subscription Plans</ModalHeader>
          <ModalBody className="p-0">
            <div>
              {selectedPlan === "Monthly" ? (
                <div>
                  <div className="plansHeader">
                    <div className="timePeriod text-white">
                      <h2>30 days free trial</h2>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor{" "}
                      </p>
                    </div>
                    <div className="timePeriodSelect text-white font-weight-bold">
                      <h4 className="opc-8">Monthly</h4>
                      <label className="switch">
                        <input
                          type="checkbox"
                          onChange={e => this.onSelectPlan(e)}
                        />
                        <span className="slider round"></span>
                      </label>
                      <h4>Yearly</h4>
                    </div>
                  </div>
                  <div className="plansWrapper">
                    <div className="plansBox">
                      <div className="priceCat">
                        <h5>Free trial</h5>
                      </div>
                      <h2 className="planPrice">
                        <sup></sup>
                        {"30"}
                        <sub>days</sub>{" "}
                      </h2>
                      <Button
                        color=""
                        disabled={organizationLicense || license}
                        className="buyBtn buybtn-dis"
                        onClick={this.getFreeTrailPlan}
                      >
                        Free
                      </Button>
                      <p>Lorem Ipsum</p>
                      <p>Lorem Ipsum</p>
                      <p>Lorem Ipsum</p>
                      <p>Lorem Ipsum</p>
                    </div>
                    {monthlyPlan &&
                      monthlyPlan.length > 0 &&
                      monthlyPlan.map((plan, i) => {
                        return (
                          <div
                            className="plansBox"
                            key={(plan && plan.planId && plan.planId) || i}
                          >
                            <div className="priceCat">
                              <h5>{(plan && plan.plan && plan.plan) || ""}</h5>
                            </div>
                            <h2 className="planPrice">
                              <sup>$</sup>
                              {(plan && plan.amount && plan.amount) || ""}
                              <sub>/month</sub>{" "}
                            </h2>
                            <Button
                              color=""
                              className="buyBtn buybtn-dis"
                              onClick={e => this.onBasicPlanstoggle(e, plan)}
                            >
                              buy
                            </Button>
                            <p>Lorem Ipsum</p>
                            <p>Lorem Ipsum</p>
                            <p>Lorem Ipsum</p>
                            <p>Lorem Ipsum</p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="plansHeader">
                    <div className="timePeriod text-white">
                      <h2>30 days free trial</h2>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor{" "}
                      </p>
                    </div>
                    <div className="timePeriodSelect text-white font-weight-bold">
                      <h4 className="opc-8">Monthly</h4>
                      <label className="switch">
                        <input
                          type="checkbox"
                          onChange={e => this.onSelectPlan(e)}
                        />
                        <span className="slider round"></span>
                      </label>
                      <h4>Yearly</h4>
                    </div>
                  </div>
                  {/* <div className="plansWrapper">
                    {yearlyPlan &&
                      yearlyPlan.length > 0 &&
                      yearlyPlan.map((plan, i) => {
                        return (
                          <div
                            className="plansBox"
                            key={(plan && plan.planId && plan.planId) || i}
                          >
                            <div className="priceCat">
                              <h5>{(plan && plan.plan && plan.plan) || ""}</h5>
                            </div>
                            <h2 className="planPrice">
                              <sup>$</sup>
                              {(plan && plan.amount && plan.amount) || ""}
                              <sub>/year</sub>{" "}
                            </h2>
                            <Button
                              color=""
                              className="buyBtn buybtn-dis"
                              onClick={e => this.onBasicPlanstoggle(e, plan)}
                            >
                              buy
                            </Button>
                            <p>Lorem Ipsum</p>
                            <p>Lorem Ipsum</p>
                            <p>Lorem Ipsum</p>
                            <p>Lorem Ipsum</p>
                          </div>
                        );
                      })}
                  </div>
               
                </div>
              )}
            </div>
          </ModalBody>
        </Modal> 
        <Modal
          isOpen={isFreeModalOpen}
          toggle={this.freePlanModalToggle}
          className="paymentModal"
        >
          <ModalHeader toggle={this.freePlanModalToggle}>
            Free trial
          </ModalHeader>
          <ModalBody>
            <div className="freeTrial">
              <h3 className="heading">Free 30 days trial plan</h3>
              <p>Congratulations! license key is sent to your email account.</p>
            </div>

            <div className="form-group text-center mt-5">
              <Button
                className="trialBtn bs-planw"
                onClick={() => {
                  this.freePlanModalToggle();
                  isToggle();
                }}
              >
                Done
              </Button>
            </div>
          </ModalBody>
        </Modal>{" "}*/}

        <Modal
          isOpen={isOpen}
          toggle={isToggle}
          className="subscription-plansModal"
        >
          <ModalHeader toggle={isToggle}>Subscription Plans</ModalHeader>
          <ModalBody className="p-0">
            <div className="plansHeader">
              <div className="timePeriod text-white">
                <h2>30 days free trial</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor{" "}
                </p>
              </div>
              <div className="timePeriodSelect text-white font-weight-bold">
                <h4 className="opc-8">Monthly</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) => this.onSelectPlan(e)}
                  />
                  <span className="slider round"></span>
                </label>
                <h4>Yearly</h4>
              </div>
            </div>
            {selectedPlan === "Monthly" ? (
              <div className="plansWrapper">
                <div className="plansBox">
                  <div className="text-center">
                    <div className="priceCat">
                      <h5>PREMIUM PLAN</h5>
                    </div>
                    <h2 className="planPrice">
                      <sup></sup>2.99<sub>USD / User</sub>
                    </h2>
                    <button
                      type="button"
                      onClick={(e) =>
                        this.onBasicPlanstoggle(
                          e,
                          1,
                          "PREMIUM PLAN",
                          "2.99",
                          "month"
                        )
                      }
                      className="buyBtn buybtn-dis btn btn-"
                    >
                      buy
                    </button>
                  </div>
                  <div className="plan-list">
                    <ul>
                      <li>Create Meetings</li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p className="title">Project</p>
                    <ul>
                      <li>Sync with Local</li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p className="title">Calendar</p>
                    <ul>
                      <li>Assign Task to External</li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p className="title">user</p>
                    <ul>
                      <li>Create 50 Users</li>
                      <li>Create 100 Tasks</li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p>Month</p>
                    <ul>
                      <li>Reports & Analytics</li>
                      <li>On-Cloud / SaaS</li>
                    </ul>
                  </div>
                </div>
                <div className="plansBox">
                  <div className="text-center">
                    <div className="priceCat">
                      <h5>PROFESSIONAL PLAN</h5>
                    </div>
                    <h2 className="planPrice">
                      8.80<sub>USD / User</sub>
                      <p>Minimum 50 Users</p>
                    </h2>

                    <button
                      type="button"
                      onClick={(e) =>
                        this.onBasicPlanstoggle(
                          e,
                          2,
                          "PROFESSIONAL PLAN",
                          "8.80",
                          "month"
                        )
                      }
                      className="buyBtn buybtn-dis btn btn-"
                    >
                      buy
                    </button>
                  </div>
                  <div className="plan-list">
                    <ul>
                      <li>Create Meetings </li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p>Project </p>
                    <ul>
                      <li>Sync with Local </li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p>Calendar</p>
                    <ul>
                      <li>Assign Task to</li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p>External user</p>
                    <ul>
                      <li>Create 100 Users</li>
                      <li>Create 300 Tasks </li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p>Month</p>
                    <ul>
                      <li>Reports & Analytics</li>
                      <li>On-Cloud / SaaS</li>
                    </ul>
                  </div>
                </div>
                <div className="plansBox">
                  <div className="text-center">
                    <div className="priceCat">
                      <h5>ENTERPRISE PLAN</h5>
                    </div>
                    <h2 className="planPrice">
                      {/* <sup>$</sup>6.99<sub>/month</sub>{" "} */}
                      <a href="#">GET A QUOTE</a>
                    </h2>
                    <button
                      type="button"
                      onClick={(e) =>
                        this.onBasicPlanstoggle(
                          e,
                          3,
                          "ENTERPRISE PLAN",
                          "4.99",
                          "month"
                        )
                      }
                      className="buyBtn buybtn-dis btn btn-"
                    >
                      buy
                    </button>
                  </div>
                  <div className="plan-list">
                    <ul>
                      <li>Create Meetings / Project</li>
                      <li>Sync with Local Calendar</li>
                      <li>Assign Task to External </li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p>user</p>
                    <ul>
                      <li>Create Unlimited Users</li>
                      <li>Create Unlimited Tasks </li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p>Month</p>
                    <ul>
                      <li>Reports & Analytics</li>
                      <li>
                        <a href="#">On-Premise / Self</a>
                      </li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p>
                      <a href="#">Hosted</a>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="plansWrapper">
                <div className="plansBox">
                  <div className="text-center">
                    <div className="priceCat">
                      <h5>PREMIUM PLAN</h5>
                    </div>
                    <h2 className="planPrice">
                      <sup></sup>29.4<sub>USD / User</sub>
                    </h2>
                    <button
                      type="button"
                      onClick={(e) =>
                        this.onBasicPlanstoggle(
                          e,
                          4,
                          "PREMIUM PLAN",
                          "29.4",
                          "year"
                        )
                      }
                      className="buyBtn buybtn-dis btn btn- disabled"
                    >
                      Buy
                    </button>
                  </div>
                  <div className="plan-list">
                    <ul>
                      <li>Create Meetings</li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p className="title">Project</p>
                    <ul>
                      <li>Sync with Local</li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p className="title">Calendar</p>
                    <ul>
                      <li>Assign Task to External</li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p className="title">user</p>
                    <ul>
                      <li>Create 50 Users</li>
                      <li>Create 100 Tasks</li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p>Year</p>
                    <ul>
                      <li>Reports & Analytics</li>
                      <li>On-Cloud / SaaS</li>
                    </ul>
                  </div>
                </div>
                <div className="plansBox">
                  <div className="text-center">
                    <div className="priceCat">
                      <h5>PROFESSIONAL PLAN</h5>
                    </div>
                    <h2 className="planPrice">
                      90<sub>USD / User</sub>
                      <p>Minimum 50 Users</p>
                    </h2>

                    <button
                      type="button"
                      onClick={(e) =>
                        this.onBasicPlanstoggle(
                          e,
                          5,
                          "PROFESSIONAL PLAN",
                          "90",
                          "year"
                        )
                      }
                      className="buyBtn buybtn-dis btn btn-"
                    >
                      buy
                    </button>
                  </div>
                  <div className="plan-list">
                    <ul>
                      <li>Create Meetings </li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p>Project </p>
                    <ul>
                      <li>Sync with Local </li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p>Calendar</p>
                    <ul>
                      <li>Assign Task to</li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p>External user</p>
                    <ul>
                      <li>Create 100 Users</li>
                      <li>Create 300 Tasks </li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p>Year</p>
                    <ul>
                      <li>Reports & Analytics</li>
                      <li>On-Cloud / SaaS</li>
                    </ul>
                  </div>
                </div>
                <div className="plansBox">
                  <div className="text-center">
                    <div className="priceCat">
                      <h5>ENTERPRISE PLAN</h5>
                    </div>
                    <h2 className="planPrice">
                      {/* <sup>$</sup>6.99<sub>/month</sub>{" "} */}
                      <a href="#">GET A QUOTE</a>
                    </h2>
                    <button
                      type="button"
                      onClick={(e) =>
                        this.onBasicPlanstoggle(
                          e,
                          6,
                          "ENTERPRISE PLAN",
                          "54.89",
                          "year"
                        )
                      }
                      className="buyBtn buybtn-dis btn btn-"
                    >
                      buy
                    </button>
                  </div>
                  <div className="plan-list">
                    <ul>
                      <li>Create Meetings / Project</li>
                      <li>Sync with Local Calendar</li>
                      <li>Assign Task to External </li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p>user</p>
                    <ul>
                      <li>Create Unlimited Users</li>
                      <li>Create Unlimited Tasks </li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p>Year</p>
                    <ul>
                      <li>Reports & Analytics</li>
                      <li>
                        <a href="#">On-Premise / Self</a>
                      </li>
                    </ul>
                  </div>
                  <div className="plan-list">
                    <p>
                      <a href="#">Hosted</a>
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div
              className="license-text buybtn-dis"
              disabled={organizationLicense || license}
            >
              <span onClick={this.getFreeTrailPlan}>
                Get free license trial for 30 days.
              </span>
            </div>
          </ModalBody>
        </Modal>
        {type === "organization" ? (
          <div>
            {isBasicPlanModal && (
              <BasicPlanModal
                subscriptionToggle={isToggle}
                isOpen={isBasicPlanModal}
                planDetail={planDetail}
                basicPlanToggle={this.onBasicPlanstoggle}
              />
            )}
          </div>
        ) : (
          <div>
            {isPaymentModal && (
              <Elements>
                <PaymentModal
                  quantity={quantity}
                  subscriptionToggle={isToggle}
                  planDetail={planDetail}
                  isOpen={isPaymentModal}
                  paymentToggle={this.onPaymentToggle}
                />
              </Elements>
            )}
          </div>
        )}
        <Modal
          isOpen={isFreeModalOpen}
          toggle={this.freePlanModalToggle}
          className="paymentModal"
        >
          <ModalHeader toggle={this.freePlanModalToggle}>
            Free trial
          </ModalHeader>
          <ModalBody>
            <div className="freeTrial">
              <h3 className="heading">Free 30 days trial plan</h3>
              <p>Congratulations! license key is sent to your email account.</p>
            </div>

            <div className="form-group text-center mt-5">
              <Button
                className="trialBtn bs-planw"
                onClick={() => {
                  this.freePlanModalToggle();
                  isToggle();
                }}
              >
                Done
              </Button>
            </div>
          </ModalBody>
        </Modal>
        {/* {isBasicPlanModal && <BasicPlanModal isOpen={isBasicPlanModal} planDetail={planDetail} basicPlanToggle={this.onBasicPlanstoggle} />}
        {isPaymentModal && <Elements><PaymentModal quantity={quantity} planDetail={planDetail} isOpen={isPaymentModal} paymentToggle={this.onPaymentToggle} /></Elements>} */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    organizationReducer: state.organizationReducer,
    individualUserData: state.individualUserReducer,
    userDetails: state.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getFreeTrailPlan,
      clearPaymentDetails,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionPlansModal);
