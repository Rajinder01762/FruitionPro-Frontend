import React from "react";
import Logo from "../../../../asset/images/dashboard-icons/logo.png";
import { Container } from "reactstrap";

export default ({ children }) => (
  <div className="main-wrapper">
    <div>
      <Container>
        <div className="pt-3">
          <img src={Logo} alt="" />
        </div>
      </Container>
    </div>
    <div className="forms">{children}</div>
    <div className="copyright">
      <p>
        2020 @ Copyright and IP owned by Unimas Consulting Solutions Pte Ltd,
        Singapore
        <span className="ml-2">
          <a href="mailto:fruitionpro@unimasconsultig.com">Contact Us</a>
        </span>
      </p>
    </div>
  </div>
);
