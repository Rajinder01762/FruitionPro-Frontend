import React, { Component } from "react";
import {
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table,
} from "reactstrap";
import KeyIcon from "../../../asset/images/icons/Key.png";
import { Link } from "react-router-dom";
import Select from "react-select";
import moment from "moment";
import Avatar from "../../../asset/images/icons/Avatar.png";
import MoreIcon from "../../icons/moreIcon";
import SubscriptionPlansModal from "../subscription/subscriptionPlansModal";
import { circleCharacter } from "../createMeeting/createMeetingComponent";
import { CSVReader } from "react-papaparse";
import DeleteAccountModal from "../modals/deleteAccountModal";
export default class ManageUserComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isLogout: false,
      modal: false,
      dropdownOpen: false,
      name: "",
      department: "",
      designation: "",
      email: "",
      license: "",
      error: {},
      openId: "",
      isUpdate: false,
      id: "",
      isSubscriptionModal: false,
      dataFromFile: [],
      importModal: false,
      dataFromFileError: [],
      csvDataValid: true,
      isDeleteAccountModal: false,
      userId: "",
    };
    this.toggle = this.toggle.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.handleOnDrop = this.handleOnDrop.bind(this);
    this.toggleImport = this.toggleImport.bind(this);
  }
  componentDidMount() {
    const {
      setUserOrganizationData,
      organization,
      userDetails,
      history,
    } = this.props;

    if (
      userDetails.license_key &&
      userDetails.license_key.expiry_date &&
      moment(userDetails.license_key.expiry_date)._d < new Date()
    ) {
      history.push("/view/profile");
    }
    const obj = {
      email: organization.organizationEmail,
    };
    setUserOrganizationData(obj).then((result) => {});
  }

  validateEmail = (email) => {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  sendRequest = (e) => {
    const {
      name,
      department,
      designation,
      email,
      license,
      isUpdate,
      id,
    } = this.state;
    const {
      organizationInviteUser,
      setUserOrganizationData,
      organization,
      updateUser,
      userDetails,
    } = this.props;

    const locationIdRemove = [];
    organization.organizationLocations &&
      organization.organizationLocations.length > 0 &&
      organization.organizationLocations.map((item) => {
        let obj = {
          label: item.label,
          value: item.value,
        };
        locationIdRemove.push(obj);
      });
    const projectIdRemove = [];
    organization.organizationProjects &&
      organization.organizationProjects.length > 0 &&
      organization.organizationProjects.map((item) => {
        let obj = {
          label: item.label,
          value: item.value,
        };
        projectIdRemove.push(obj);
      });
    let error = {
      name: false,
      department: false,
      designation: false,
      email: false,
      license: false,
    };

    if (!isUpdate) {
      if (name === "") {
        error.name = true;
      }
    }
    if (department === "") {
      error.department = true;
    }
    if (designation === "") {
      error.designation = true;
    }
    if (!isUpdate) {
      if (email === "") {
        error.email = true;
      }
    }
    if (!isUpdate) {
      if (email !== "") {
        if (!this.validateEmail(email)) {
          error.email = true;
        }
      }
    }
    if (license === "") {
      error.license = true;
    }
    // const licenseText = `${email}-license`
    // if (license !== licenseText) {
    //   error.license = true;
    //   this.setState({ error });
    //   return
    // }
    this.setState({ error });

    if (
      !error.email &&
      !error.name &&
      !error.license &&
      !error.department &&
      !error.designation
    ) {
      let inviteObj = {
        name,
        email,
        license,
        department,
        designation,
        senderEmail: organization.organizationEmail,
        id: organization.organizationId,
        senderName: organization.organizationName,
        logo:
          organization && organization.organizationLogo
            ? organization.organizationLogo
            : "",
        projects: projectIdRemove,
        // organization &&
        // organization.organizationProjects &&
        // organization.organizationProjects.length > 0
        //   ? organization.organizationProjects
        //   : "",
        locations: locationIdRemove,
        // organization &&
        // organization.organizationLocations &&
        // organization.organizationLocations.length > 0
        //   ? organization.organizationLocations
        //   : "",
        departments:
          organization &&
          organization.organizationDepartments &&
          organization.organizationDepartments.length > 0
            ? organization.organizationDepartments
            : "",
        admin_email: userDetails.email,
      };
      if (isUpdate) {
        let updateObj = {
          name,
          email,
          license,
          department,
          designation,
          id,
          admin_email: userDetails && userDetails.email,
          projects:
            organization &&
            organization.organizationProjects &&
            organization.organizationProjects.length > 0
              ? organization.organizationProjects
              : "",
          locations:
            organization &&
            organization.organizationLocations &&
            organization.organizationLocations.length > 0
              ? organization.organizationLocations
              : "",
        };
        updateUser(updateObj).then((result) => {
          if (result.payload.data.status === 200) {
            const obj = {
              email: organization.organizationEmail,
              id: organization.organizationId,
            };

            setUserOrganizationData(obj).then((result) => {});
            this.setState({
              modal: false,
              isUpdate: false,
              name: "",
              department: "",
              designation: "",
              email: "",
              license: "",
              error: {},
              id: "",
            });
          }
        });
      } else {
        organizationInviteUser(inviteObj).then((result) => {
          if (result.payload.status === 200) {
            const obj = {
              email: organization.organizationEmail,
              id: organization.organizationId,
            };

            if (result.payload.data.status === 200) {
              const { addInviteContact } = this.props;
              const { status, attendee } = result.payload.data;
              if (status === 200) {
                const object = {
                  attendee,
                };
                addInviteContact(object);
              }
              this.setState({
                modal: false,
                name: "",
                department: "",
                designation: "",
                email: "",
                license: "",
                error: {},
              });
            }

            setUserOrganizationData(obj).then(() => {});
          }
        });
      }
    }
  };

  handleInput = (e, input) => {
    delete e._id;

    if (input === "department" || input === "designation")
      this.setState({
        [input]: e.value,
      });
    else
      this.setState({
        [e.target.name]: e.target.value,
      });
  };

  toggleSubscriptionModal = () => {
    // e.preventDefault();
    this.setState({
      isSubscriptionModal: !this.state.isSubscriptionModal,
    });
  };

  toggle() {
    this.setState((prevState) => ({
      isUpdate: false,
      name: "",
      email: "",
      license: "",
      department: "",
      designation: "",
      error: {},
      modal: !prevState.modal,
    }));
  }
  dropdownToggle(id) {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
      openId: id,
    }));
  }

  onEdit = (e, data) => {
    e.preventDefault();
    this.setState({
      isUpdate: true,
      modal: true,
      name: data.name,
      department: data.department,
      designation: data.designation,
      email: data.email,
      license:
        data &&
        data.license_key &&
        data.license_key.key &&
        data.license_key.key,
      id: data._id,
    });
  };

  onDelete = (e, id, email) => {
    e.preventDefault();
    const {
      deleteUser,
      organization,
      setUserOrganizationData,
      userDetails,
      deleteInvitedUser,
    } = this.props;
    const deleteObj = {
      user_id: id,
      admin_email: userDetails.email,
    };
    deleteUser(deleteObj).then((result) => {
      if (result.payload.status === 200) {
        deleteInvitedUser(email);

        const obj = {
          email: organization.organizationEmail,
        };
        setUserOrganizationData(obj).then((result) => {});
      }
    });
  };

  onResendEmail = (e, data) => {
    const { resendEmail, organization } = this.props;
    const resendObj = {
      name: data.name,
      email: data.email,
      senderEmail: organization.organizationEmail,
      id: organization.organizationId,
      senderName: organization.organizationName,
      logo: organization.organizationLogo ? organization.organizationLogo : "",
    };

    resendEmail(resendObj).then((result) => {});
  };

  toggleImport() {
    this.setState({
      importModal: !this.state.importModal,
      dataFromFile: [],
    });
  }

  handleOnDrop = (data) => {
    let csvData = [];
    let dataFromFileError = [];
    let csvDataValid = true;
    let error;

    const { organization } = this.props;

    let validOrganizationDepartments = organization.organizationDepartments.map(
      (obj) => {
        return obj.label;
      }
    );
    let validOrganizationDesignations = organization.organizationDesignations.map(
      (obj) => {
        return obj.label;
      }
    );

    let name;
    let email;
    let license;
    let designation;
    let department;

    data.forEach((element) => {
      error = {
        name: false,
        email: false,
        department: false,
        designation: false,
        license: false,
      };

      name = element.data[0];
      email = element.data[1];
      department = element.data[2];
      designation = element.data[3];
      license = element.data[4];

      if (!name) {
        error.name = "*Field cannot be empty";
      }
      if (!email) {
        error.email = "*Field cannot be empty";
      } else {
        if (!this.validateEmail(email)) {
          error.email = "*Invalid email";
        }
      }
      if (!department) {
        error.department = "*Field cannot be empty";
      } else {
        if (!validOrganizationDepartments.includes(department)) {
          error.department = "*Department does not exist";
        }
      }
      if (!designation) {
        error.designation = "*Field cannot be empty";
      } else {
        if (!validOrganizationDesignations.includes(designation)) {
          error.designation = "*Designation does not exist";
        }
      }
      if (!license) {
        error.license = "*Field cannot be empty";
      }

      if (
        !(
          error.name === false &&
          error.department === false &&
          error.designation === false &&
          error.name === false &&
          error.license === false
        )
      ) {
        csvDataValid = false;
      }

      dataFromFileError.push(error);
      csvData.push(element.data);
    });

    this.setState({
      dataFromFile: csvData,
      dataFromFileError: dataFromFileError,
      csvDataValid: csvDataValid,
    });
  };

  handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  handleOnRemoveFile = (data) => {
    console.log("---------------------------");
    // console.log(data)
    console.log("---------------------------");
  };

  sendImportRequest = (e) => {
    const { isUpdate, id } = this.state;
    const {
      organizationInviteUser,
      setUserOrganizationData,
      organization,
      updateUser,
      userDetails,
    } = this.props;

    let name;
    let email;
    let license;
    let department;
    let designation;

    let inviteObjArr = this.state.dataFromFile.map((eaUser) => {
      name = eaUser[0];
      email = eaUser[1];
      department = eaUser[2];
      designation = eaUser[3];
      license = eaUser[4];
      return {
        name,
        email,
        license,
        department,
        designation,
        senderEmail: organization.organizationEmail,
        id: organization.organizationId,
        senderName: organization.organizationName,
        logo:
          organization && organization.organizationLogo
            ? organization.organizationLogo
            : "",
        projects:
          organization &&
          organization.organizationProjects &&
          organization.organizationProjects.length > 0
            ? organization.organizationProjects
            : "",
        locations:
          organization &&
          organization.organizationLocations &&
          organization.organizationLocations.length > 0
            ? organization.organizationLocations
            : "",
        departments:
          organization &&
          organization.organizationDepartments &&
          organization.organizationDepartments.length > 0
            ? organization.organizationDepartments
            : "",
        admin_email: userDetails.email,
        error: false,
      };
    });

    inviteObjArr.map((inviteObj) => {
      organizationInviteUser(inviteObj).then((result) => {
        if (result.payload.status === 200) {
          const obj = {
            email: organization.organizationEmail,
            id: organization.organizationId,
          };

          if (result.payload.data.status === 200) {
            const { addInviteContact } = this.props;
            const { status, attendee } = result.payload.data;
            if (status === 200) {
              const object = {
                attendee,
              };
              addInviteContact(object);
            }
          }

          setUserOrganizationData(obj).then(() => {});
        }
      });
    });

    console.log("------");
    console.log(inviteObjArr);
  };

  toggleDeleteAccount = () => {
    this.setState((prevState) => ({
      isDeleteAccountModal: !prevState.isDeleteAccountModal,
    }));
  };
  onRequestClick = (userId) => {
    this.setState({
      userId,
    });
    this.toggleDeleteAccount();
  };
  render() {
    const {
      name,
      email,
      license,
      error,
      openId,
      isUpdate,
      isSubscriptionModal,
      isDeleteAccountModal,
      userId,
    } = this.state;
    const {
      organization,
      users,
      setDeleteOrDeactivateAccount,
      userDetails,
      registerUser,
      setUserAccountStatus,
    } = this.props;
    // const userId =( registerUser && registerUser.userId )|| ''
    const Department =
      organization &&
      organization.organizationDepartments &&
      organization.organizationDepartments.length > 0
        ? organization.organizationDepartments
        : [];
    const Designation =
      organization &&
      organization.organizationDesignations &&
      organization.organizationDesignations.length > 0
        ? organization.organizationDesignations
        : [];

    return (
      <div className="dashboard-wrapper">
        <div className="dashboard-content">
          <div className="title-wrap">
            <div>
              <h2 className="title">Manage Users</h2>
            </div>
            <div
              className="multiple-usersBtn"
              style={{
                display: "flex",
                "justify-content": "space-around",
                "white-space": "nowrap",
              }}
            >
              <Button color="gradient" onClick={this.toggleImport}>
                Import Multiple Users
              </Button>
              <Button color="gradient" onClick={this.toggle}>
                Add New User
              </Button>
            </div>
          </div>
          <div className="list-content">
            <ul className="user-list">
              {users.length > 0 &&
                users.map((data) => {
                  if (
                    data &&
                    [
                      null,
                      "activated",
                      "deactivate_request",
                      "delete_request",
                    ].indexOf(data.status) > -1
                  ) {
                    const status =
                      (data && data.status === "deactivate_request"
                        ? "Deactivate"
                        : "Delete") || "";
                    return (
                      <li key={data._id}>
                        <div className="d-flex align-items-center flex-grow-1">
                          <div className="userImg">
                            <div className="taskUser-circle">
                              <span
                                className="inviteUserIcon"
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                }}
                              >
                                {circleCharacter(data)}
                              </span>
                            </div>
                          </div>
                          <div className="user-details">
                            <h4>{data.name || ""}</h4>
                            <p>
                              {data.email || ""}, {data.designation || ""},{" "}
                              {data.department || ""}
                            </p>
                          </div>
                        </div>
                        <div className="user-status">
                          <div className="status-btn">
                            <span>
                              {" "}
                              <a
                                href
                                style={{ cursor: "pointer" }}
                                onClick={(e) => this.onResendEmail(e, data)}
                              >
                                {!data.is_accepted && "Resend Email"}
                              </a>
                            </span>
                          </div>
                          <div className="status">
                            <span>
                              {data.is_accepted ? "Accepted" : "Pending"}
                            </span>
                          </div>
                        </div>
                        {(data.status || "").includes("request") && (
                          <div className="requested-delete">
                            <Button
                              color={
                                data && data.status === "delete_request"
                                  ? "danger"
                                  : "secondary"
                              }
                              onClick={(e) =>
                                this.onRequestClick((data && data._id) || "")
                              }
                            >
                              Requested to {status}
                            </Button>
                          </div>
                        )}
                        <div className="user-edit">
                          <Dropdown
                            isOpen={
                              this.state.dropdownOpen && data._id === openId
                            }
                            toggle={() => this.dropdownToggle(data._id)}
                          >
                            <DropdownToggle>
                              <MoreIcon />
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem
                                onClick={(e) => this.onEdit(e, data)}
                              >
                                Modify
                              </DropdownItem>
                              <DropdownItem divider />
                              <DropdownItem
                                onClick={(e) =>
                                  this.onDelete(e, data._id, data.email)
                                }
                              >
                                Delete
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </li>
                    );
                  }
                })}
            </ul>
          </div>
        </div>
        {isDeleteAccountModal && (
          <DeleteAccountModal
            isOpen={isDeleteAccountModal}
            onToggleModal={this.toggleDeleteAccount}
            isInvitedUser={true}
            isAdmin={true}
            setDeleteOrDeactivateAccount={setDeleteOrDeactivateAccount}
            userDetails={userDetails}
            userId={userId}
            setUserAccountStatus={setUserAccountStatus}
          />
        )}
        <Modal
          isOpen={this.state.importModal}
          toggle={this.toggleImport}
          className="user-details-wrapper account-form-screen"
        >
          <ModalHeader toggle={this.toggleImport}>
            Import Multiple Users
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                {this.state.dataFromFile.length === 0 && (
                  <div>
                    <CSVReader
                      onDrop={this.handleOnDrop}
                      onError={this.handleOnError}
                      noDrag
                      addRemoveButton
                      onRemoveFile={this.handleOnRemoveFile}
                    >
                      <span style={{ "font-weight": "bold" }}>
                        Click to upload
                      </span>
                      <br></br>
                      <span style={{ "font-size": "13px" }}>
                        CSV File should be in the following format:
                      </span>
                      <span
                        style={{ "font-size": "13px", "font-weight": "bold" }}
                      >
                        Name, Email, Department, Designation, License Key
                      </span>
                    </CSVReader>
                    <div>
                      <br></br>
                      <p className="bottom-text text-right">
                        Don’t have License key?
                        <Link onClick={(e) => this.toggleSubscriptionModal(e)}>
                          Buy Now
                        </Link>
                      </p>
                    </div>
                  </div>
                )}
              </Col>
            </Row>

            <Row>
              <Col sm="12">
                <Label for="">
                  {this.state.dataFromFile.length > 0 && "Imported Data"}
                </Label>
                <Table
                  responsive
                  size="sm"
                  style={{
                    "font-size": "11px",
                  }}
                >
                  {this.state.dataFromFile.length > 0 && (
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>License Key</th>
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {this.state.dataFromFile.map((data, i) => {
                      return (
                        <tr id={i}>
                          <td>
                            {data[0]}
                            <span
                              className="text-danger"
                              style={{ "font-size": "8px", display: "block" }}
                            >
                              {this.state.dataFromFileError[i].name}
                            </span>
                          </td>
                          <td>
                            {data[1]}
                            <span
                              className="text-danger"
                              style={{ "font-size": "8px", display: "block" }}
                            >
                              {this.state.dataFromFileError[i].email}
                            </span>
                          </td>
                          <td>
                            {data[2]}
                            <span
                              className="text-danger"
                              style={{ "font-size": "8px", display: "block" }}
                            >
                              {this.state.dataFromFileError[i].department}
                            </span>
                          </td>
                          <td>
                            {data[3]}
                            <span
                              className="text-danger"
                              style={{ "font-size": "8px", display: "block" }}
                            >
                              {this.state.dataFromFileError[i].designation}
                            </span>
                          </td>
                          <td>
                            {data[4]}
                            <span
                              className="text-danger"
                              style={{ "font-size": "8px", display: "block" }}
                            >
                              {this.state.dataFromFileError[i].license}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Col>
              <Col sm="12 request-btn">
                <center>
                  {this.state.dataFromFile.length > 0 && (
                    <Button
                      color="gradient"
                      onClick={(e) => this.sendImportRequest(e)}
                      disabled={!this.state.csvDataValid}
                    >
                      Send Request
                    </Button>
                  )}
                </center>
              </Col>
            </Row>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className="user-details-wrapper account-form-screen"
        >
          <ModalHeader toggle={this.toggle}>User Details</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label for="" className="required">
                    Name
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    value={name}
                    readOnly={isUpdate}
                    onChange={(e) => this.handleInput(e)}
                    placeholder="Enter employee name"
                  />
                  {error.name && (
                    <span className="text-danger">{"Name is empty"}</span>
                  )}
                </FormGroup>
              </Col>

              <Col sm="6">
                <FormGroup>
                  <Label for="" className="required">
                    Department
                  </Label>
                  <Select
                    value={Department.filter(
                      (option) => option.value === this.state.department
                    )}
                    options={Department}
                    className="popup-select"
                    onChange={(e) => this.handleInput(e, "department")}
                  />
                  {error.department && (
                    <span className="text-danger">
                      {"Please select department"}
                    </span>
                  )}
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="" className="required">
                    Designation
                  </Label>
                  <Select
                    value={Designation.filter(
                      (option) => option.value === this.state.designation
                    )}
                    options={Designation}
                    className="popup-select"
                    onChange={(e) => this.handleInput(e, "designation")}
                  />
                  {error.designation && (
                    <span className="text-danger">
                      {"Please select designation"}
                    </span>
                  )}
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label for="" className="required">
                    Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="Enter employee email"
                    readOnly={isUpdate}
                    name="email"
                    value={email}
                    onChange={(e) => this.handleInput(e)}
                  />
                  {error.email && (
                    <span className="text-danger">{"Incorrect Email"}</span>
                  )}
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label for="" className="required">
                    License Key
                  </Label>
                  <div className="key-wrap">
                    <Input
                      type="text"
                      name="license"
                      value={license}
                      onChange={(e) => this.handleInput(e)}
                      placeholder="Enter license key"
                      className="license-key"
                    />
                    {error.license && (
                      <span className="text-danger">{"Invalid license"}</span>
                    )}
                    <img src={KeyIcon} alt="keyIcon" className="key" />
                  </div>
                </FormGroup>
                <div>
                  <p className="bottom-text text-right">
                    Don’t have License key?
                    <Link onClick={(e) => this.toggleSubscriptionModal(e)}>
                      Buy Now
                    </Link>
                  </p>
                </div>
              </Col>
              <Col sm="12 request-btn">
                <center>
                  <Button color="gradient" onClick={(e) => this.sendRequest(e)}>
                    {isUpdate ? "Update" : "Send Request"}
                  </Button>
                </center>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        {isSubscriptionModal && (
          <SubscriptionPlansModal
            isOpen={isSubscriptionModal}
            isToggle={this.toggleSubscriptionModal}
          />
        )}
      </div>
    );
  }
}
