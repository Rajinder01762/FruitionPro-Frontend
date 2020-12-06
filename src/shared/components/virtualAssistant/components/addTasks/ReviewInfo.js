/* eslint-disable no-extend-native */
import React from "react";
import { Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
// import DropDown from "../shared/assistantDropdown";
import UserImg from "../../../../../asset/images/virtual-assistant/user.jpg";
// import StartEndTime from "./StartEndTime";
import styled, { keyframes } from "styled-components";
import DueDate from "../../../../../asset/images/virtual-assistant/dueDate.png";
import Projects from "../../../../../asset/images/virtual-assistant/projects.png";
import AddLabel from "../../../../../asset/images/virtual-assistant/addLabel.png";

const projects = [
  { id: 1, name: "project-1" },
  { id: 2, name: "project-2" },
  { id: 3, name: "project-3" },
  { id: 4, name: "project-4" },
];

const departments = [
  { id: 1, name: "department-1" },
  { id: 2, name: "department-2" },
  { id: 3, name: "department-3" },
  { id: 4, name: "department-4" },
];
class ReviewInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { project, department } = this.state;
    return (
      <>
        <h2>Review Task Details</h2>
        <Row>
          <Col sm={12}>
            <FormGroup className="review-textarea">
              <p className="mb-0">
                <textarea>
                  Reference site about Lorem Ipsum, giving information on its
                  origins, as well as a random Lipsum generator.
                </textarea>
              </p>
            </FormGroup>
          </Col>
        </Row>
        <div className="reviewDetailsWrapper">
          <div className="assistant-meeting mt-3">
            <h5 className="list-title">Participants</h5>
            <div className="participantsUsers">
              <img src={UserImg} alt="" />
              <img src={UserImg} alt="" />
              <div className="add-user">
                <i className="fas fa-pencil-alt" />
              </div>
            </div>
            {/* <div>
          <Button className="subMeetingsBtn red pl-3">
            Add Agenda
            <i className="fas fa-pencil-alt ml-2"></i>
          </Button>
          <Button className="subMeetingsBtn green pl-3">
            Add Document  <i className="fas fa-pencil-alt ml-2"></i>
          </Button>
  
          <Button className="subMeetingsBtn orange pl-3">
            Add Location
            <i className="fas fa-pencil-alt ml-2"></i>
          </Button>
        </div> */}
            <div className="meetings-details">
              <DetailsCard
                delay={0.25 * 0}
                className="detailsCard red"
                style={{ width: "200px" }}
              >
                <h4>Due Date</h4>
                <div className="details">
                  <p>25/06/20</p>
                </div>
                <div className="edit-icon">
                  <span>
                    <img src={DueDate} alt="DueDate" />
                  </span>
                </div>
              </DetailsCard>
              <DetailsCard
                delay={0.25 * 1}
                className="detailsCard green"
                style={{ width: "220px" }}
              >
                <h4>Projects</h4>
                <div className="details">
                  <p>FruitionPro</p>
                </div>

                <div className="edit-icon">
                  <span>
                    <img src={Projects} alt="Projects" />
                  </span>
                </div>
              </DetailsCard>
              <DetailsCard
                delay={0.25 * 2}
                className="detailsCard orange"
                style={{ width: "240px" }}
              >
                <h4>Label</h4>
                <div className="details">
                  <p>High Priority</p>
                </div>
                <div className="edit-icon">
                  <span>
                    <img src={AddLabel} alt="AddLabel" />
                  </span>
                </div>
              </DetailsCard>
            </div>
          </div>
        </div>
        <div className="text-center pt-2">
          <Button className="doneBtn">Done</Button>
        </div>

        {/* <Button onClick={this.onClickNext} className="right-arrow">
					<img src={ContinueArrow} alt="" />
				</Button> */}
      </>
    );
  }
}

export default ReviewInfo;

const ani = keyframes`
0% {
    opacity: 0;
    transform: translate(20px, 20px);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
`;
const DetailsCard = styled("div")`
  opacity: 0;
  animation: fadeInTopRight 0.25s forwards
    cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation-delay: ${({ delay }) => delay}s;
`;
