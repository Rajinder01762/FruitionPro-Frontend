import React, { Component } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Avatar from "../../../../asset/images/icons/Avatar.png";
import Edit from "../../../../asset/images/icons/Edit.png";
import Checked from "../../../../asset/images/icons/checked.png";
import EyeIcon from "../../../../asset/images/icons/eyeIcon.png";
import { circleCharacter } from "../createMeetingComponent";

class InviteUserItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }
  render() {
    const { label, showMenu, canEdit, updateEditPermission, data } = this.props;

    return (
      <div className="invite-value">
        <div className="name">
          <div className="inviteUserCircle">
            <span
              className="inviteUserIcon"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {" "}
              {circleCharacter(data)}
            </span>
          </div>
          <div>{label || ""}</div>
        </div>
        {showMenu && (
          <div className="active">
            <div className="user-edit">
              <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle>
                  <img
                    alt="edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.toggle();
                    }}
                    style={{ color: "red" }}
                    src={canEdit ? Edit : EyeIcon}
                    className="icons"
                  />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={(e) => {
                      e.stopPropagation();
                      updateEditPermission(data, !canEdit);
                    }}
                  >
                    {canEdit ? "View only" : "Can edit"}
                  </DropdownItem>
                  {/* <DropdownItem divider />
                <DropdownItem >Can View</DropdownItem> */}
                </DropdownMenu>
              </Dropdown>
              <img alt="check" src={Checked} className="checked-img icons" />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default InviteUserItems;
