import React, { Component, Fragment } from "react";
import ReactSelect from 'react-select'
import AddIcon from "../../../asset/images/icons/addIcon.png";
import TickIcon from "../../../asset/images/icons/Tick.png";

export default class Select extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openSelect: false
    }
  }
  selectHandler = (val) => {
    this.setState({ openSelect: val })
  }
  render() {
    const { withIcon = false, options = [], id } = this.props;
    const { openSelect } = this.state;
    return (
      <Fragment>
        <ReactSelect options={options} className="popup-select" menuIsOpen={openSelect} />
        {/* <ReactSelect disabled className="popup-select" />
        {
          withIcon && (openSelect ?
            <img src={TickIcon} onClick={this.selectHandler} />
            : <img src={AddIcon} onClick={() => this.selectHandler(true)} />)
        } */}
      </Fragment>)
  }
}