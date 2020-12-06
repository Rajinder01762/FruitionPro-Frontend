/* eslint-disable no-extend-native */
import React from "react";
import { Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
// import DropDown from "../../shared/assistantDropdown";
import DropDown from "../shared/DropDown";
import UserImg from "../../../../../asset/images/virtual-assistant/user.jpg";
import StartEndTime from "./StartEndTime";
import styled, { keyframes } from "styled-components";
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
    this.state = {
      title: "",
      startDateTime: "",
      endDateTime: "",
      project: "",
      department: "",
    };
  }

  handleSelect = (name) => (selected) => {
    this.setState({ [name]: selected.name });
  };

  render() {
    const { project, department } = this.state;
    return (
      <>
        <h2>Review Meeting Details</h2>
        <Row>
          <Col sm={12}>
            <FormGroup>
              <Input type="text" id="title" placeholder=" " />
              <Label for="title" className="mb-0 label">
                Title
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <div className="reviewDetailsWrapper">
          <Row>
            <Col sm={6} className="pr-1">
              <div className="mb-4 mt-1 meetings-dropdown">
                <DropDown
                  options={projects}
                  selected={project}
                  onSelect={this.handleSelect("project")}
                  defaultSel={"Project"}
                />
              </div>
            </Col>
            <Col sm={6} className="pl-1">
              <div className="mb-4 mt-1 meetings-dropdown">
                <DropDown
                  options={departments}
                  selected={department}
                  onSelect={this.handleSelect("department")}
                  defaultSel={"Department"}
                />
              </div>
            </Col>
          </Row>
          <StartEndTime />

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
              <DetailsCard delay={0.25 * 0} className="detailsCard red agenda">
                <h4>Agenda</h4>
                <div className="details">
                  <p>
                    Reference site about Lorem Ipsum, giving information on its
                    origins.
                  </p>
                </div>

                <div className="edit-icon">
                  <i className="fas fa-pencil-alt" />
                </div>
              </DetailsCard>
              <DetailsCard
                delay={0.25 * 1}
                className="detailsCard green document"
              >
                <h4>Document</h4>
                <div className="details">
                  <p>
                    <span className="title">Screenshot 20hjgvjhfvgdjfgvj</span>
                    <span>.png</span>
                  </p>
                  <p>
                    <span className="title">Screenshot 20 </span>
                    <span>.png</span>
                  </p>
                </div>

                <div className="edit-icon">
                  <i className="fas fa-pencil-alt" />
                </div>
              </DetailsCard>
              <DetailsCard
                delay={0.25 * 2}
                className="detailsCard orange location"
              >
                <h4>Location</h4>
                <div className="details">
                  <p>Meeting Room 1</p>
                </div>
                <div className="edit-icon">
                  <i className="fas fa-pencil-alt" />
                </div>
              </DetailsCard>
            </div>
          </div>
        </div>
        <div onClick={this.props.onClickNext} className="text-center pt-2">
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
