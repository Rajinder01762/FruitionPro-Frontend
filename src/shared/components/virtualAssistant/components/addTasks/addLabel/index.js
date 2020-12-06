import React from "react";
import { FormGroup, Input, Label, Button } from "reactstrap";
import Check from "../../../../../icons/check";

export default () => {
  return (
    <div className="add-label-wrapper">
      <FormGroup>
        <Input
          type="text"
          id="Label_Name"
          placeholder=" "
          className="label-name"
        />
        <Label for="Label_Name" className="mb-0 label">
          Label Name
        </Label>
      </FormGroup>
      <div className="colors-wrapper">
        <h5>Select a color</h5>
        <div className="colors-list">
          <div
            className="color-box"
            style={{ backgroundColor: "#11e593" }}
          ></div>
          <div
            className="color-box"
            style={{ backgroundColor: "#c26cd7" }}
          ></div>
          <div
            className="color-box"
            style={{ backgroundColor: "#45b54f" }}
          ></div>
          <div
            className="color-box"
            style={{ backgroundColor: "#ff89cd" }}
          ></div>
          <div
            className="color-box"
            style={{ backgroundColor: "#ff932f" }}
          ></div>
          <div
            className="color-box"
            style={{ backgroundColor: "#2c3d57" }}
          ></div>
          <div
            className="color-box"
            style={{ backgroundColor: "#f2cf33" }}
          ></div>
          <div
            className="color-box"
            style={{ backgroundColor: "#00bbd9" }}
          ></div>
          <div className="color-box" style={{ backgroundColor: "#f24e42" }}>
            <Check />
          </div>
          <div className="color-box empty-box"></div>
        </div>
      </div>
      <div className="text-center">
        <Button className="doneBtn">Create</Button>
      </div>
    </div>
  );
};
