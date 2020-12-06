import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

export default () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret></DropdownToggle>
      <DropdownMenu>
        <DropdownItem>
          1<sup>st</sup>
        </DropdownItem>
        <DropdownItem>
          2<sup>nd</sup>
        </DropdownItem>
        <DropdownItem>
          3<sup>rd</sup>
        </DropdownItem>
        <DropdownItem>
          4<sup>th</sup>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
