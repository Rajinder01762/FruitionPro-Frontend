import React from "react";
import { Form } from "reactstrap";
export default ({ title, children, className = "" }) => (
  <Form className={`main-form ${className}`}>
    {title && <h2 className="title text-center">{title}</h2>}
    {children}
  </Form>
);
