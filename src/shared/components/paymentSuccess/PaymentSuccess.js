import React, { Component } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import TickIcon from "../../../asset/images/mom-icons/tick.png";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class PaymentSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { paymentDetails, isOpen, successToggle } = this.props;
    return (
      <>
        <Modal
          isOpen={isOpen}
          toggle={successToggle}
          className="success-payment"
        >
          <ModalBody>
            <div className="text-center">
              <img src={TickIcon} alt="" width="150px" />
              <h2>
                {paymentDetails.paymentStatus
                  ? `${paymentDetails.paymentStatus}!`
                  : "Failed!"}
              </h2>
              {paymentDetails.paymentStatus === "succeeded" ? (
                <p className="successText">
                  License key is send to your email account.Please check your
                  email.
                </p>
              ) : (
                <p></p>
              )}
              <Button color="gradient" onClick={successToggle}>
                Done
              </Button>
            </div>
          </ModalBody>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    paymentDetails: state.paymentDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(PaymentSuccess);
