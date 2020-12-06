import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, Row, Col, Input } from 'reactstrap';
import PaymentModal from "./paymentModal";
import { Elements } from 'react-stripe-elements'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { clearPaymentDetails } from '../subscription/store/action';

class BasicPlanModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPaymentModal: false,
      quantity: 1
    }
  }

  onPaymentToggle = () => {
    const { clearPaymentDetails } = this.props;
    clearPaymentDetails()
    this.setState(prevState => ({
      isPaymentModal: !prevState.isPaymentModal
    }));
  }

  onChangeQuantity = (e) => {
    if (Number(e.target.value)) {
      this.setState({
        [e.target.name]: e.target.value
      })
    }
  }

  onQuantityCount = (e, operation) => {
    const { quantity } = this.state;
    if (operation === 'add') {
      this.setState({
        quantity: this.state.quantity + 1
      })
    }
    else if (operation === 'minus' && quantity > 1) {
      this.setState({
        quantity: this.state.quantity - 1
      })
    }
  }
  render() {
    const { isOpen, basicPlanToggle, planDetail, subscriptionToggle } = this.props;
    const { isPaymentModal, quantity } = this.state;
    return (
      <div>
        <Modal isOpen={isOpen} toggle={basicPlanToggle} className="paymentModal">
          <ModalHeader toggle={basicPlanToggle}>Basic Plans</ModalHeader>
          <div className="planHeading">
            <h1 className="planPrice text-center text-blues pt-4 mb-0"><sup>$</sup>{(planDetail && planDetail.amount) || ''}<sub>/{(planDetail && planDetail.type && planDetail.type) || ''}</sub> </h1>
            <p>Change Plan</p>
          </div>
          <div className="planContent pt-3">
            <div className="qWrap">
              <h3>Quantity</h3>
              <div className="quantityWrapper">
                <Button className="countCircle" onClick={(e) => this.onQuantityCount(e, 'minus')}>-</Button>
                <Input className="quantityCount" name="quantity" value={quantity} onChange={(e) => this.onChangeQuantity(e)} />
                <Button className="countCircle" onClick={(e) => this.onQuantityCount(e, 'add')}>+</Button>
              </div>
            </div>
            <div className="form-group text-center mt-5">
              <Button color="gradient" className="buyBtn bs-planw" onClick={(e) => this.onPaymentToggle(e)}>Next</Button>
            </div>
          </div>
        </Modal>
        {isPaymentModal && <Elements><PaymentModal quantity={quantity} subscriptionToggle={subscriptionToggle} planDetail={planDetail} isOpen={isPaymentModal} basicPlanToggle={basicPlanToggle} paymentToggle={this.onPaymentToggle} /></Elements>}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    organizationReducer: state.organizationReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      clearPaymentDetails
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BasicPlanModal);