import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, Row, Col } from "reactstrap";
import {
  injectStripe,
  CardCVCElement,
  CardExpiryElement,
  CardNumberElement,
} from "react-stripe-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  setCardNumberCompleted,
  setCardNumberError,
  setCardExpiryCompleted,
  setCardExpiryError,
  setCardCvvCompleted,
  setCardCvvError,
  setCardType,
  setStripeInfo,
  stripePaymentStatus,
  clearPaymentDetails,
} from "./store/action";
import Loader from "react-loader-spinner";
import { Redirect } from "react-router-dom";
import PaymentSuccess from "../paymentSuccess/PaymentSuccess";

class PaymentModalComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoading: false,
      isPayment: false,
      successModal: false,
    };
  }

  handleCardNumberChange = (change) => {
    this.props.setCardNumberCompleted(change.complete);
    if (change.error && change.error !== "undefined")
      this.props.setCardNumberError(change.error.message);
    else this.props.setCardNumberError(null);
    if (change.brand && change.brand !== "unknown") {
      this.props.setCardType(change.brand);
    } else this.props.setCardType(null);
  };
  handleCardExpiryChange = (change) => {
    this.props.setCardExpiryCompleted(change.complete);
    if (change.error && change.error !== "undefined")
      this.props.setCardExpiryError(change.error.message);
    else this.props.setCardExpiryError(null);
  };
  handleCvcChange = (change) => {
    this.props.setCardCvvCompleted(change.complete);
    if (change.error && change.error !== "undefined")
      this.props.setCardCvvError(change.error.message);
    else this.props.setCardCvvError(null);
  };

  setPaymentDetails = (e) => {
    e.preventDefault();
    const {
      paymentDetails,
      userDetails,
      planDetail,
      quantity,
      subscriptionToggle,
      registerUser,
    } = this.props;
    const { type } = this.props.organizationReducer;
    let domainName = `http://${window.location.hostname}`;
    if (domainName === "http://localhost")
      domainName = "http://localhost:3000/profile";
    this.setState({
      isLoading: true,
    });
    const amount = parseInt(parseFloat(planDetail.amount) * 100 * quantity);
    this.props.stripe
      .createSource({
        type: "card",
        currency: "usd",
        amount,
        // customer: {
        //   id: registerUser.userId || ''
        // },
        owner: {
          name: userDetails.name || "",
          email: userDetails.email || "",
        },
        redirect: {
          return_url: domainName,
        },
      })
      .then((stripePayload) => {
        if (stripePayload.error) {
          this.setState(() => ({ error: true, isLoading: false }));
          return false;
        }
        const cardSource = stripePayload.source;
        if (
          stripePayload.source.card.three_d_secure === "required" ||
          stripePayload.source.card.three_d_secure === "recommended" ||
          stripePayload.source.card.three_d_secure === "optional"
        ) {
          this.props.stripe
            .createSource({
              type: "three_d_secure",
              amount: cardSource.amount,
              currency: cardSource.currency,
              three_d_secure: {
                card: cardSource.id,
              },
              redirect: {
                return_url: domainName,
              },
            })
            .then((threeDSecurePayload) => {
              this.props.setStripeInfo({
                source: threeDSecurePayload.source,
                card: stripePayload.source.card,
                stripeToken: threeDSecurePayload.source.id,
                srcClientSecret: threeDSecurePayload.source.client_secret,
                cardEndingNr: stripePayload.source.card.last4,
                cardType: paymentDetails.cardType,
                stripePayload: stripePayload.source.id,
                data: this.props.data,
              });

              const obj = {
                amount: threeDSecurePayload.source.amount,
                description: "",
                currency: threeDSecurePayload.source.currency,
                source: threeDSecurePayload.source.id,
                type: type === "organization" ? "group" : "single",
                plan: planDetail.type || "",
                quantity,
              };
              this.props.stripePaymentStatus(obj).then((result) => {
                this.setState({
                  isLoading: false,
                  successModal: true,
                });
                if (
                  result.payload.data.message === "succeeded" &&
                  result.payload.data.status === 200
                ) {
                  // this.props.paymentToggle();
                  // this.props.subscriptionToggle();
                  // if (this.props.basicPlanToggle) {
                  //   this.props.basicPlanToggle();
                  // }
                }
              });
            });
        } else {
          this.props.setStripeInfo({
            source: stripePayload.source,
            card: stripePayload.source.card,
            stripeToken: stripePayload.source.id,
            srcClientSecret: stripePayload.source.client_secret,
            cardEndingNr: stripePayload.source.card.last4,
            cardType: paymentDetails.cardType,
            stripePayload: stripePayload.source.id,
            data: this.props.data,
          });
          const obj = {
            amount: stripePayload.source.amount,
            description: "",
            currency: stripePayload.source.currency,
            source: stripePayload.source.id,
            type: type === "organization" ? "group" : "single",
            plan: planDetail.type || "",
            quantity,
          };
          this.props.stripePaymentStatus(obj).then((result) => {
            this.setState({
              isLoading: false,
              successModal: true,
            });
            if (
              result.payload.data.message === "succeeded" &&
              result.payload.data.status === 200
            ) {
              // this.props.paymentToggle();
              // this.props.subscriptionToggle();
              // if (this.props.basicPlanToggle) {
              //   this.props.basicPlanToggle();
              // }
            }
          });
        }
      });
  };

  successToggle = (e) => {
    const {
      paymentToggle,
      basicPlanToggle,
      subscriptionToggle,
      clearPaymentDetails,
    } = this.props;
    this.setState({
      successModal: !this.state.successModal,
    });
    if (this.state.successModal) {
      paymentToggle();
      if (basicPlanToggle) {
        basicPlanToggle();
      }
      subscriptionToggle();
      clearPaymentDetails();
    }
  };
  render() {
    const { isOpen, paymentToggle, planDetail, quantity } = this.props;
    const {
      cardNumberError,
      cardExpiryError,
      cardCvcError,
    } = this.props.paymentDetails;
    const { isPayment, successModal } = this.state;
    let totalAmount = 0;
    if (planDetail && quantity && planDetail.amount) {
      totalAmount = planDetail.amount * quantity;
      totalAmount = totalAmount.toFixed(2);
    }

    if (successModal) {
      return (
        <PaymentSuccess
          isOpen={successModal}
          successToggle={this.successToggle}
        />
      );
    }

    return (
      <div>
        {/* {isPayment && <Redirect to="/view/payment-success" />} */}
        <Modal
          isOpen={isOpen}
          toggle={paymentToggle}
          className="basic-plansModal"
        >
          <ModalHeader toggle={paymentToggle}>Payment</ModalHeader>
          <ModalBody>
            {this.state.isLoading && (
              <div className="loader payLoading">
                <Loader
                  type="TailSpin"
                  color="#0a799e"
                  height={100}
                  width={100}
                />
                <div className="load-text">Processing your transaction</div>
              </div>
            )}
            <h1 className="planPrice text-center text-blues mt-2">
              <sup>$</sup>
              {totalAmount ? totalAmount : ""}
            </h1>
            <form>
              <div className="checkout" style={{ margin: "15px 10px 5px" }}>
                <div className="card-form">
                  <Row>
                    <Col md={12}>
                      <div className="cardRowMain mb-3" id="main-card">
                        <label className="stripeCardLabel mb-1">
                          {" "}
                          Card Number
                        </label>
                        <div className="StripeElement_container">
                          <CardNumberElement
                            id="cardnumber"
                            onChange={this.handleCardNumberChange}
                            className="card-number"
                          />
                          {cardNumberError ? (
                            <span className="text-danger">
                              {cardNumberError}
                            </span>
                          ) : (
                            <span></span>
                          )}
                        </div>
                      </div>
                    </Col>
                    <Col md={12}>
                      <div className="cardRowMain" id="main-card">
                        <Row>
                          <Col md={8}>
                            <label className="stripeCardLabel mb-1">
                              Expiry Date
                            </label>
                            <div className="StripeElement_container">
                              <CardExpiryElement
                                id="expiry_date"
                                onChange={this.handleCardExpiryChange}
                                className="expiryDate"
                              />
                              {cardExpiryError ? (
                                <span className="text-danger">
                                  {cardExpiryError}
                                </span>
                              ) : (
                                <span></span>
                              )}
                            </div>
                          </Col>
                          <Col md={4}>
                            <label className="stripeCardLabel mb-1">CVC</label>
                            <div className="StripeElement_container">
                              <CardCVCElement
                                id="cvc"
                                onChange={this.handleCvcChange}
                                className="expiryDate"
                              />
                              {cardCvcError ? (
                                <span className="text-danger">
                                  {cardCvcError}
                                </span>
                              ) : (
                                <span></span>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="form-group text-center nxtBtn">
                <Button
                  color="gradient"
                  type="submit"
                  onClick={(e) => this.setPaymentDetails(e)}
                  className="buyBtn bs-planw"
                >
                  Pay
                </Button>
              </div>
            </form>
          </ModalBody>
        </Modal>

        {/* {isPayment && <PaymentSuccess isOpen={isPayment} successToggle={this.successToggle} />} */}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    paymentDetails: state.paymentDetails,
    userDetails: state.userDetails,
    organizationReducer: state.organizationReducer,
    isLoading: state.sessionReducer.isLoading,
    registerUser: state.registerUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setCardNumberCompleted,
      setCardNumberError,
      setCardExpiryCompleted,
      setCardExpiryError,
      setCardCvvCompleted,
      setCardCvvError,
      setCardType,
      setStripeInfo,
      stripePaymentStatus,
      clearPaymentDetails,
    },
    dispatch
  );
};
export default injectStripe(
  connect(mapStateToProps, mapDispatchToProps)(PaymentModalComponent)
);
