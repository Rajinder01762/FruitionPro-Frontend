import React from "react";
import { Input, FormGroup, Label, Col, Row } from "reactstrap";

const InputField = ({ handleChange, value, label, type }) => {
  return (
    <Row>
      <Col sm={12}>
        <FormGroup>
          <FormGroup>
            <Input
              onChange={handleChange}
              type={type}
              id={label}
              value={value}
              placeholder=" "
            />
            <Label for="agenda" className="mb-0 label">
              {label}
            </Label>
          </FormGroup>
        </FormGroup>
      </Col>
    </Row>
  );
};

export default InputField;
