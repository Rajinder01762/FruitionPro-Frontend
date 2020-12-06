import React, { Component } from "react";
import {
  Button,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Table,
} from "reactstrap";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import KeyIcon from "../../../asset/images/icons/Key.png";
import UploadIcon from "../../../asset/images/icons/Upload.png";
import { onFileUpload } from "../../util/fileUpload";
import AddIcon from "../../../asset/images/icons/PlusIcon.png";
import TickIcon from "../../../asset/images/icons/Tick.png";
import CloseIcon from "../../../asset/images/icons/close.svg";
import moment from "moment";
import Loader from "react-loader-spinner";
import ResetPasswordModal from "../modals/resetPasswordModal";
import SubscriptionPlansModal from "../subscription/subscriptionPlansModal";
import LicenseExpireModal from "./licenseExpireModal";
import queryString from "query-string";
import { withRouter } from "react-router-dom";
import { CSVReader } from "react-papaparse";
import DeleteAccountModal from "../modals/deleteAccountModal";
const dateDifference = (startDate, endDate) => {
  let result = {
    days: "",
    hours: "",
    minutes: "",
  };

  const ticks = (endDate - startDate) / 1000;
  let delta = Math.abs(ticks);
  // calculate (and subtract) whole days
  result.days = Math.floor(delta / 86400);
  delta -= result.days * 86400;
  // calculate (and subtract) whole hours
  result.hours = Math.floor(delta / 3600) % 24;
  delta -= result.hours * 3600;
  // calculate (and subtract) whole minutes
  result.minutes = Math.floor(delta / 60) % 60;
  delta -= result.minutes * 60;
  if (ticks < 0) {
    result.days = result.days === 0 ? result.days : -result.days;
    result.hours = result.hours === 0 ? result.hours : -result.hours;
    result.minutes = result.minutes === 0 ? result.minutes : -result.minutes;
  }
  return result;
};
class ProfileComponent extends Component {
  constructor(props) {
    super(props);
    const {
      organizationName,
      organizationLicenceTimeLeft,
      organizationLicense,
      organizationEmail,
      organizationDepartments,
      organizationDesignations,
      organizationLocations,
      organizationProjects,
      organizationLogo,
      organizationExpireDate,
      userDepartment,
      userDesignation,
      adminLogo,
    } = this.props.organizationReducer;
    const { email, name, calender, license_key } = this.props.userDetails;

    const {
      license,
      department,
      designation,
      logo,
      licenseExpireDate,
      licenseTimeLeft,
    } = this.props.individualUserReducer;
    this.state = {
      deleteModal: false,
      isUploading: false,
      isAdminUploading: false,
      file: logo || organizationLogo ? organizationLogo : "",
      adminFile: adminLogo || logo,
      name: organizationName ? organizationName : name,
      license: organizationLicense ? organizationLicense : license,
      email: organizationEmail ? organizationEmail : email,
      department: department ? department : "",
      designation: designation ? designation : "",
      // accExpireDate: organizationEmail ? '' : accExpireDate,

      LicenseExpireDate: organizationExpireDate
        ? organizationExpireDate
        : license_key && license_key.expiry_date
        ? license_key && license_key.expiry_date
        : "",
      LicenseTimeLeft: organizationLicenceTimeLeft
        ? dateDifference(new Date(), new Date(organizationExpireDate))
        : dateDifference(
            new Date(),
            new Date(license_key && license_key.expiry_date)
          )
        ? dateDifference(
            new Date(),
            new Date(license_key && license_key.expiry_date)
          )
        : "",
      error: {},
      isDepartmentField: false,
      isDesignationField: false,
      isLocationField: false,
      isProjectField: false,
      departmentOptions: organizationDepartments ? organizationDepartments : [],
      designationOptions: organizationDesignations
        ? organizationDesignations
        : [],
      locationOptions: organizationLocations ? organizationLocations : [],
      projectOptions: organizationProjects ? organizationProjects : [],
      departmentOption: {
        value: "",
        label: "",
      },
      designationOption: {
        value: "",
        label: "",
      },
      projectOption: {
        value: "",
        label: "",
      },
      locationOption: {
        value: "",
        label: "",
      },
      modal: false,
      userName: name ? name : "",
      userEmail: email ? email : "",
      userDepartment: {
        label: userDepartment ? userDepartment : "",
        value: userDepartment ? userDepartment : "",
      },
      userDesignation: {
        label: userDesignation ? userDesignation : "",
        value: userDesignation ? userDesignation : "",
      },
      calenderOption: {
        label: calender ? calender : "",
        value: calender ? calender : "",
      },
      isSubscriptionModal: false,
      isExpireModalOpen: true,
      importModal: false,
      dataFromFile: [],
      importOption: "",
      dataFromFileError: [],
      csvDataValid: true,
    };
    this.toggle = this.toggle.bind(this);
    this.toggleImportModal = this.toggleImportModal.bind(this);
    this.handleImportOptionInput = this.handleImportOptionInput.bind(this);
    this.handleOnDrop = this.handleOnDrop.bind(this);
    this.sendImportRequest = this.sendImportRequest.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }
  toggleDeleteModal = () => {
    this.setState({
      deleteModal: !this.state.deleteModal,
    });
  };
  validateEmail = (email) => {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  licenseTime = (data) => {
    let time = "";
    if (data) {
      if (data.days > 0) {
        if (data.days === 1) time = time.concat(data.days + " day");
        else time = time.concat(data.days + " days");
      }
      if (data.hours > 0) {
        if (data.hours === 1) time = time.concat(" " + data.hours + " hour");
        else time = time.concat(" " + data.hours + " hours");
      }
      if (data.minutes > 0) {
        if (data.minutes === 1)
          time = time.concat(" " + data.minutes + " minute");
        else time = time.concat(" " + data.minutes + " minutes");
      }
    }
    if (time) {
      time = time.concat(" left");
    }
    return time;
  };

  onHandelChange = (e, input) => {
    if (input === "department" || input === "designation") {
      this.setState({
        [input]: e.value,
      });
    } else
      this.setState({
        [e.target.name]: e.target.value,
      });
  };
  sendRequest = (e, type) => {
    e.preventDefault();
    const {
      name,
      department,
      designation,
      email,
      license,
      accExpireDate,
      file,
      adminFile,
      departmentOption,
      designationOption,
      calenderOption,
    } = this.state;
    // set error
    let error = {
      name: false,
      department: false,
      designation: false,
      email: false,
      license: false,
      accExpireDate: false,
      departmentOption: false,
      designationOption: false,
    };

    if (name === "") {
      error.name = true;
    }

    if (type === "organization") {
      if (departmentOption === "" || departmentOption === null) {
        error.departmentOption = true;
      }
      if (designationOption === "" || designationOption === null) {
        error.designationOption = true;
      }
    }
    if (email === "") {
      error.email = true;
    }
    if (email !== "") {
      if (!this.validateEmail(email)) {
        error.email = true;
      }
    }
    if (license === "") {
      error.license = true;
    }

    this.setState({ error });
    if (
      !error.email &&
      !error.name &&
      !error.license &&
      !error.department &&
      !error.designation &&
      !error.accExpireDate
    ) {
      if (type === "user") {
        const {
          updateUserProfile,
          individualUserReducer,
          organizationReducer,
        } = this.props;
        const { userId } = this.props.registerUser;
        let licenseType = null;
        if (individualUserReducer.type) {
          licenseType = individualUserReducer.type;
        }
        if (organizationReducer.type) {
          licenseType = organizationReducer.type;
        }
        if (!individualUserReducer.type && !organizationReducer.type) {
          licenseType = "invitedUser";
        }
        const { userName } = this.state;
        let inviteObj = {
          name: userName,
          email,
          license,
          licenseType,
          department,
          designation,
          accExpireDate,
          id: userId,
          logo: file,
          preferred_calender: calenderOption.value,
        };
        updateUserProfile(inviteObj).then((result) => {
          const { status, data } = result.payload.data;
          if (status === 200) {
            this.setState({
              error: {},
              LicenseTimeLeft: dateDifference(
                new Date(),
                new Date(data.license_key.expiry_date)
              ),
              LicenseExpireDate:
                data && data.license_key && data.license_key.expiry_date,
            });
          }
        });
      } else if (type === "organization") {
        const {
          updateOrganizationProfile,
          organizationReducer,
          registerUser,
        } = this.props;
        const {
          departmentOptions,
          designationOptions,
          projectOptions,
          locationOptions,
          userDepartment,
          userDesignation,
          userEmail,
          userName,
        } = this.state;
        const obj = {
          id: organizationReducer.organizationId,
          name,
          email: organizationReducer.organizationEmail,
          license,
          departmentOptions,
          designationOptions,
          projectOptions,
          locationOptions,
          userEmail,
          userName,
          userDepartment,
          userDesignation,
          preferred_calender: calenderOption.value,
          logo: file,
          userId: registerUser.userId,
          adminLogo: adminFile,
        };
        updateOrganizationProfile(obj).then((result) => {
          const { status, data } = result.payload.data;
          if (status === 200) {
            this.setState({
              LicenseTimeLeft: dateDifference(
                new Date(),
                new Date(
                  data && data.license_key && data.license_key.expiry_date
                )
              ),
              LicenseExpireDate:
                data && data.license_key && data.license_key.expiry_date,
            });
          }
        });
      }
    }
  };
  handleFileUpload = (e, value) => {
    if (value === "adminFile") {
      this.setState({
        isAdminUploading: true,
      });
    } else {
      this.setState({
        isUploading: true,
      });
    }

    onFileUpload(e.target.files[0]).then((res) => {
      if (res) {
        if (value === "adminFile") {
          this.setState({
            isAdminUploading: false,
            adminFile: res,
          });
        } else {
          this.setState({
            isUploading: false,
            file: res,
          });
        }
        // this.setState({ file: res, isUploading: false });
      }
    });
  };

  componentDidMount() {
    const {
      getUserOrOrganization,
      organizationReducer,
      registerUser,
      userDetails,
      location,
      history,
    } = this.props;
    const userId = registerUser && registerUser.userId;

    if (
      userDetails &&
      userDetails.license_key &&
      userDetails.license_key.expiry_date &&
      moment(userDetails.license_key.expiry_date)._d < new Date()
    ) {
      history.push("/view/profile");
    }
    if (location && location.search) {
      const values = queryString.parse(location.search);
      const paramUserId = values && values.uid;
      if (paramUserId === userId) {
        this.toggleSubscriptionModal();
      }
    }
    let obj;
    if (organizationReducer.type === "organization") {
      obj = {
        id: organizationReducer.organizationId,
        type: "organization",
      };
    } else {
      obj = {
        id: registerUser && registerUser.userId,
        type: "user",
      };
    }

    getUserOrOrganization(obj).then((result) => {
      if (result.payload.status === 200) {
        const { details } = result.payload.data;

        const organization = details && details.organization_id;
        this.setState({
          name: organization
            ? organization.name
            : details && details.name
            ? details.name
            : "",
          license:
            organization &&
            organization.license_key &&
            organization.license_key.key
              ? organization.license_key.key
              : details && details.license_key && details.license_key.key
              ? details.license_key.key
              : "",
          email: details && details.email ? details.email : "",
          department: details && details.department ? details.department : "",

          designation:
            details && details.designation ? details.designation : "",
          LicenseTimeLeft:
            organization &&
            organization.license_key &&
            organization.license_key.expiry_date
              ? dateDifference(
                  new Date(),
                  new Date(organization.license_key.expiry_date)
                )
              : details &&
                details.license_key &&
                details.license_key.expiry_date
              ? dateDifference(
                  new Date(),
                  new Date(details.license_key.expiry_date)
                )
              : "",
          LicenseExpireDate:
            organization &&
            organization.license_key &&
            organization.license_key.expiry_date
              ? organization.license_key.expiry_date
              : details &&
                details.license_key &&
                details.license_key.expiry_date
              ? details.license_key.expiry_date
              : "",
        });
        if (details && details.userType === "user") {
          this.setState({
            file: details.logo,
          });
        }
      }
    });
  }

  selectHandler = () => {
    this.setState({ designation2: true });
  };
  onChangeHandle = (e, type) => {
    console.log("typetypetypetype", type);
    this.setState({
      [`${type}Option`]: { label: e.target.value, value: e.target.value },
    });
  };
  handleClick = (e, type) => {
    e.preventDefault();
    const departmentOption = {
      value: "",
      label: "",
    };
    const designationOption = {
      value: "",
      label: "",
    };
    const projectOption = {
      value: "",
      label: "",
    };
    const locationOption = {
      value: "",
      label: "",
    };

    if (type === "department") {
      this.setState({
        isDepartmentField: !this.state.isDepartmentField,
        departmentOption,
      });
    }
    if (type === "designation") {
      this.setState({
        isDesignationField: !this.state.isDesignationField,
        designationOption,
      });
    }
    if (type === "project") {
      this.setState({
        isProjectField: !this.state.isProjectField,
        projectOption,
      });
    }
    if (type === "location") {
      this.setState({
        isLocationField: !this.state.isLocationField,
        locationOption,
      });
    }
  };

  addOptionInSelect = (e, type) => {
    const newOption = this.state[`${type}Option`];
    if (newOption.value) {
      let previousOptions =
        this.state[`${type}Options`] && this.state[`${type}Options`];
      let nextOptions =
        previousOptions && previousOptions.length > 0
          ? previousOptions.slice()
          : [];
      const index = nextOptions.findIndex(
        (data) => data.value === newOption.value
      );
      if (index < 0) {
        nextOptions.push(newOption);
        this.setState({ [`${type}Options`]: nextOptions });
      }
    }
    this.handleClick(e, type);
  };

  onDeleteOption = (option, type) => {
    const {
      departmentOptions,
      designationOptions,
      locationOptions,
      projectOptions,
    } = this.state;
    if (type === "department") {
      let index = departmentOptions.findIndex(
        (element) => element.value === option.value
      );
      departmentOptions.splice(index, 1);
      this.setState({
        departmentOption: {
          value: "",
          label: "",
        },
      });
    }
    if (type === "designation") {
      let index = designationOptions.findIndex(
        (element) => element.value === option.value
      );
      designationOptions.splice(index, 1);
      this.setState({
        designationOption: {
          value: "",
          label: "",
        },
      });
    }
    if (type === "project") {
      let index = projectOptions.findIndex(
        (element) => element.value === option.value
      );
      projectOptions.splice(index, 1);
      this.setState({
        projectOption: {
          value: "",
          label: "",
        },
      });
    }
    if (type === "location") {
      let index = locationOptions.findIndex(
        (element) => element.value === option.value
      );
      locationOptions.splice(index, 1);
      this.setState({
        locationOption: {
          value: "",
          label: "",
        },
      });
    }
  };
  getFormatedOptions = (data, type) => {
    if (data && data.length > 0) {
      let options = [];
      data.forEach((element) => {
        options.push({
          label: (
            <p>
              {element.label}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  this.onDeleteOption(element, type);
                }}
              >
                <img src={CloseIcon} />
              </span>
            </p>
          ),
          value: element.value,
        });
      });
      return options;
    }
    return [];
  };

  toggleSubscriptionModal = () => {
    // e.preventDefault();
    this.setState({
      isSubscriptionModal: !this.state.isSubscriptionModal,
    });
  };
  toggleExpireModal = () => {
    this.setState({
      isExpireModalOpen: !this.state.isExpireModalOpen,
    });
  };

  toggleImportModal = () => {
    this.setState({
      importModal: !this.state.importModal,
      dataFromFile: [],
      importOption: "",
      dataFromFileError: [],
      csvDataValid: true,
    });
  };

  handleImportOptionInput = (e) => {
    this.setState({ importOption: e.value });
  };

  handleOnDrop = (data) => {
    let csvData = [];
    let dataFromFileError = [];
    let error;
    let field;
    let importOption = this.state.importOption;
    let csvDataValid = true;

    const {
      organizationDepartments,
      organizationDesignations,
      organizationLocations,
      organizationProjects,
    } = this.props.organizationReducer;

    let validOrganizationDepartments = organizationDepartments.map((obj) => {
      return obj.label;
    });
    let validOrganizationDesignations = organizationDesignations.map((obj) => {
      return obj.label;
    });
    let validOrganizationLocations = organizationLocations.map((obj) => {
      return obj.label;
    });
    let validOrganizationProjects = organizationProjects.map((obj) => {
      return obj.label;
    });

    data.forEach((element) => {
      error = false;
      field = element.data[0];

      if (!field) {
        error = "*Field cannot be empty";
      } else {
        if (
          importOption === "department" &&
          validOrganizationDepartments.includes(field)
        ) {
          error = "*Department already exist";
        } else if (
          importOption === "designation" &&
          validOrganizationDesignations.includes(field)
        ) {
          error = "*Designation already exist";
        } else if (
          importOption === "project" &&
          validOrganizationProjects.includes(field)
        ) {
          error = "*Project already exist";
        } else if (
          importOption === "location" &&
          validOrganizationLocations.includes(field)
        ) {
          error = "*Location already exists";
        }
      }

      if (!error) {
        csvDataValid = false;
      }

      csvData.push(element.data);
      dataFromFileError.push(error);
    });

    this.setState({
      dataFromFile: csvData,
      dataFromFileError: dataFromFileError,
      csvDataValid: csvDataValid,
    });
  };

  sendImportRequest = (e) => {
    let importedData = this.state.dataFromFile.map((data) => {
      return { label: data[0], value: data[0] };
    });

    if (this.state.importOption === "department") {
      importedData = this.state.departmentOptions.concat(importedData);
      this.setState({ departmentOptions: importedData }, function () {
        this.sendRequest(e, "organization");
      });
    } else if (this.state.importOption === "designation") {
      importedData = this.state.designationOptions.concat(importedData);
      this.setState({ designationOptions: importedData }, function () {
        this.sendRequest(e, "organization");
      });
    } else if (this.state.importOption === "project") {
      importedData = this.state.projectOptions.concat(importedData);
      this.setState({ projectOptions: importedData }, function () {
        this.sendRequest(e, "organization");
      });
    } else if (this.state.importOption === "location") {
      importedData = this.state.locationOptions.concat(importedData);
      this.setState({ locationOptions: importedData }, function () {
        this.sendRequest(e, "organization");
      });
    }

    this.toggleImportModal();
  };

  render() {
    const {
      file,
      adminFile,
      LicenseExpireDate,
      LicenseTimeLeft,
      name,
      email,
      license,
      error,
      isDepartmentField,
      isUploading,
      isAdminUploading,
      calenderOption,
      departmentOption,
      designationOption,
      isDesignationField,
      designationOptions,
      departmentOptions,
      projectOptions,
      locationOptions,
      locationOption,
      projectOption,
      isLocationField,
      isProjectField,
      userName,
      userEmail,
      userDepartmentOptions,
      userDepartment,
      userDesignation,
      isSubscriptionModal,
      isExpireModalOpen,
      designation,
      department,
      deleteModal,
    } = this.state;
    const { type } = this.props.organizationReducer;
    const { setUserAccountStatus } = this.props;
    console.log("userDepartmentuserDepartment", departmentOptions);
    // const { licenseExpireDate, licenseTimeLeft } = this.props.individualUserReducer;
    const {
      individualUserReducer,
      individualType,
      changePassword,
      userDetails,
      setAccountStatus,
      setDeleteOrDeactivateAccount,
    } = this.props;
    const { organzationName } = individualUserReducer;
    const { userId } = this.props.registerUser;
    const calenderOptions = [
      { label: "Google", value: "Google" },
      { label: "Outlook", value: "Outlook" },
    ];
    if (
      userDetails &&
      userDetails.license_key &&
      userDetails.isLicenseExpired &&
      isExpireModalOpen
    ) {
      return (
        <LicenseExpireModal
          isOpen={isExpireModalOpen}
          toggle={this.toggleExpireModal}
        />
      );
    }
    return (
      <div className="dashboard-wrapper">
        <div className="dashboard-content">
          {type === "organization" ? (
            <>
              <div className="title-wrap dashboard-title">
                <h2 className="title">Organization Profile</h2>
                <Button color="gradient" onClick={this.toggleImportModal}>
                  Import Details
                </Button>
              </div>
              <div className="profile-wrap">
                <div className="account-form-screen">
                  <div className="text-center upload-icon">
                    {isUploading ? (
                      <div className="doc-content">
                        <span style={{ textAlign: "center" }}>
                          <Loader
                            type="TailSpin"
                            color="#00BFFF"
                            height={60}
                            width={60}
                          />
                          Uploading...
                        </span>
                      </div>
                    ) : (
                      <div>
                        <input
                          accept="image/x-png,image/gif,image/jpeg"
                          type="file"
                          className="d-none"
                          id="f-upload"
                          onChange={(e) => this.handleFileUpload(e, "logo")}
                        />
                        <label htmlFor="f-upload">
                          <div className="camera-icon">
                            <img
                              className="d-block"
                              src={file && file ? file : UploadIcon}
                              style={{
                                width: 100,
                                height: 100,
                                borderRadius: "100%",
                                objectFit: "contain",
                              }}
                              alt="UploadIcon"
                            />
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                  <Row>
                    <Col sm={12}>
                      <h3>Company Details</h3>
                    </Col>
                    <Col sm={12}>
                      <FormGroup>
                        <Label htmlFor="" className="required">
                          Company Name
                        </Label>
                        <Input
                          type="text"
                          name="name"
                          value={name}
                          onChange={(e) => this.onHandelChange(e)}
                          placeholder="Enter Company Name"
                        />
                        {error.name && (
                          <span className="text-danger">{"Name is empty"}</span>
                        )}
                      </FormGroup>
                    </Col>

                    <Col sm={6}>
                      <FormGroup>
                        <Label htmlFor="">Department</Label>
                        <div className="selectContent">
                          {isDepartmentField ? (
                            <Input
                              type="text"
                              autoFocus
                              value={departmentOption.value || ""}
                              onBlur={(e) =>
                                this.addOptionInSelect(e, "department")
                              }
                              onChange={(e) =>
                                this.onChangeHandle(e, "department")
                              }
                              name="department"
                              placeholder="Enter Department"
                            />
                          ) : (
                            <Select
                              // defaultMenuIsOpen={true}
                              value={
                                departmentOption.value
                                  ? {
                                      label: departmentOption.value,
                                      value: departmentOption.value,
                                    }
                                  : { value: "", label: "Add New" }
                              }
                              className="popup-select"
                              classNamePrefix="profile"
                              onChange={(data) => {
                                this.setState({ departmentOption: data });
                              }}
                              name="department"
                              options={this.getFormatedOptions(
                                departmentOptions,
                                "department"
                              )}
                            />
                          )}
                          {isDepartmentField ? (
                            <Button
                              onClick={(e) =>
                                this.addOptionInSelect(e, "department")
                              }
                            >
                              {" "}
                              <img src={TickIcon} alt="tickImg" />{" "}
                            </Button>
                          ) : (
                            <Button
                              onClick={(e) => this.handleClick(e, "department")}
                            >
                              <img src={AddIcon} alt="addIcon" />{" "}
                            </Button>
                          )}
                        </div>
                        {error.departmentOption && (
                          <span className="text-danger">
                            Please select department
                          </span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col sm={6}>
                      <FormGroup>
                        <Label htmlFor="">Designation</Label>
                        <div className="selectContent">
                          {isDesignationField ? (
                            <Input
                              type="text"
                              autoFocus
                              value={designationOption.value || ""}
                              onBlur={(e) =>
                                this.addOptionInSelect(e, "designation")
                              }
                              onChange={(e) =>
                                this.onChangeHandle(e, "designation")
                              }
                              name="designation"
                              placeholder="Enter Designation"
                            />
                          ) : (
                            <Select
                              // defaultMenuIsOpen={true}
                              value={
                                designationOption.value
                                  ? {
                                      label: designationOption.value,
                                      value: designationOption.value,
                                    }
                                  : { value: "", label: "Add New" }
                              }
                              className="popup-select"
                              classNamePrefix="profile"
                              onChange={(data) => {
                                this.setState({ designationOption: data });
                              }}
                              name="designation"
                              options={this.getFormatedOptions(
                                designationOptions,
                                "designation"
                              )}
                            />
                          )}
                          {isDesignationField ? (
                            <Button
                              onClick={(e) =>
                                this.addOptionInSelect(e, "designation")
                              }
                            >
                              {" "}
                              <img src={TickIcon} alt="tickImg" />{" "}
                            </Button>
                          ) : (
                            <Button
                              onClick={(e) =>
                                this.handleClick(e, "designation")
                              }
                            >
                              <img src={AddIcon} alt="addIcon" />{" "}
                            </Button>
                          )}
                        </div>
                        {error.designationOption && (
                          <span className="text-danger">
                            Please select designation
                          </span>
                        )}
                      </FormGroup>
                    </Col>

                    <Col sm={6}>
                      <FormGroup>
                        <Label htmlFor="">Projects</Label>
                        <div className="selectContent">
                          {isProjectField ? (
                            <Input
                              type="text"
                              autoFocus
                              value={projectOption.value || ""}
                              onBlur={(e) =>
                                this.addOptionInSelect(e, "project")
                              }
                              onChange={(e) =>
                                this.onChangeHandle(e, "project")
                              }
                              name="project"
                              placeholder="Enter Project"
                            />
                          ) : (
                            <Select
                              // defaultMenuIsOpen={true}
                              value={
                                projectOption.value
                                  ? {
                                      label: projectOption.value,
                                      value: projectOption.value,
                                    }
                                  : { value: "", label: "Add New" }
                              }
                              className="popup-select"
                              classNamePrefix="profile"
                              onChange={(data) => {
                                this.setState({ projectOption: data });
                              }}
                              name="project"
                              options={this.getFormatedOptions(
                                projectOptions,
                                "project"
                              )}
                            />
                          )}
                          {isProjectField ? (
                            <Button
                              onClick={(e) =>
                                this.addOptionInSelect(e, "project")
                              }
                            >
                              {" "}
                              <img src={TickIcon} alt="tickImg" />{" "}
                            </Button>
                          ) : (
                            <Button
                              onClick={(e) => this.handleClick(e, "project")}
                            >
                              <img src={AddIcon} alt="addIcon" />{" "}
                            </Button>
                          )}
                        </div>
                        {error.projectOption && (
                          <span className="text-danger">
                            Please select project
                          </span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col sm={6}>
                      <FormGroup>
                        <Label htmlFor="">Location</Label>
                        <div className="selectContent">
                          {isLocationField ? (
                            <Input
                              type="text"
                              autoFocus
                              value={locationOption.value || ""}
                              onBlur={(e) =>
                                this.addOptionInSelect(e, "location")
                              }
                              onChange={(e) =>
                                this.onChangeHandle(e, "location")
                              }
                              name="location"
                              placeholder="Enter location"
                            />
                          ) : (
                            <Select
                              // defaultMenuIsOpen={true}
                              value={
                                locationOption.value
                                  ? {
                                      label: locationOption.value,
                                      value: locationOption.value,
                                    }
                                  : { value: "", label: "Add New" }
                              }
                              className="popup-select"
                              classNamePrefix="profile"
                              onChange={(data) => {
                                this.setState({ locationOption: data });
                              }}
                              name="location"
                              options={this.getFormatedOptions(
                                locationOptions,
                                "location"
                              )}
                            />
                          )}
                          {isLocationField ? (
                            <Button
                              onClick={(e) =>
                                this.addOptionInSelect(e, "location")
                              }
                            >
                              {" "}
                              <img src={TickIcon} alt="tickImg" />{" "}
                            </Button>
                          ) : (
                            <Button
                              onClick={(e) => this.handleClick(e, "location")}
                            >
                              <img src={AddIcon} alt="addIcon" />{" "}
                            </Button>
                          )}
                        </div>
                        {error.locationOption && (
                          <span className="text-danger">
                            Please select location
                          </span>
                        )}
                      </FormGroup>
                    </Col>

                    <Col sm={12}>
                      <FormGroup>
                        <Label htmlFor="" className="required">
                          License Key
                        </Label>
                        <div className="key-wrap">
                          <Input
                            type="text"
                            name="license"
                            value={license}
                            onChange={(e) => this.onHandelChange(e)}
                            placeholder="Enter license key"
                            className="license-key"
                          />
                          <img src={KeyIcon} alt="keyIcon" className="key" />
                        </div>
                        {error.license && (
                          <span className="text-danger">
                            {"Invalid license"}
                          </span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col sm={12}>
                      <FormGroup>
                        <Label htmlFor="">Account expires on</Label>
                        <div className="profile-date">
                          <DatePicker
                            selected={
                              LicenseExpireDate
                                ? moment(LicenseExpireDate).toDate()
                                : null
                            }
                            disabled
                            className="form-control date"
                            dateFormat="MM/dd/yyyy"
                            minDate={moment().toDate()}
                            // dateFormat="yyyy/MM/dd"
                          />
                          {/* {LicenseTimeLeft && LicenseTimeLeft.days && LicenseTimeLeft.days > 0 ? <span>{LicenseTimeLeft.days} days</span> : ""}{LicenseTimeLeft && LicenseTimeLeft.hours && LicenseTimeLeft.hours > 0 ? <span> {LicenseTimeLeft.hours} hours left</span> : ""} */}
                          <span>{this.licenseTime(LicenseTimeLeft)}</span>
                        </div>
                        {/* {error.accExpireDate && <span className="text-danger">{"Please select expiry date"}</span>} */}
                      </FormGroup>
                    </Col>
                    <Col sm={12}>
                      <div>
                        <p className="bottom-text text-left mb-0">
                          Extend License?
                          <Link
                            onClick={(e) => this.toggleSubscriptionModal(e)}
                          >
                            Click here
                          </Link>
                        </p>
                      </div>
                    </Col>
                  </Row>
                  <hr />
                  <Row className="mb-5">
                    <Col sm={12}>
                      <h3 className="personal-details">Personal Details</h3>
                    </Col>
                    <div className="text-center upload-icon">
                      {isAdminUploading ? (
                        <div className="doc-content">
                          <span style={{ textAlign: "center" }}>
                            <Loader
                              type="TailSpin"
                              color="#00BFFF"
                              height={60}
                              width={60}
                            />
                            Uploading...
                          </span>
                        </div>
                      ) : (
                        <div>
                          <input
                            accept="image/x-png,image/gif,image/jpeg"
                            type="file"
                            className="d-none"
                            id="profile-upload"
                            onChange={(e) =>
                              this.handleFileUpload(e, "adminFile")
                            }
                          />
                          <label htmlFor="profile-upload">
                            <div className="camera-icon">
                              <img
                                className="d-block"
                                src={
                                  adminFile && adminFile
                                    ? adminFile
                                    : UploadIcon
                                }
                                style={{
                                  width: 100,
                                  height: 100,
                                  borderRadius: "100%",
                                  objectFit: "contain",
                                }}
                                alt="UploadIcon"
                              />
                            </div>
                          </label>
                        </div>
                      )}
                    </div>
                    <Col sm={12}>
                      <FormGroup>
                        <Label htmlFor="" className="required">
                          Name
                        </Label>
                        <Input
                          type="text"
                          name="userName"
                          value={userName}
                          onChange={(e) => this.onHandelChange(e)}
                          placeholder="Enter your name"
                        />
                      </FormGroup>
                    </Col>
                    <Col sm={6}>
                      <FormGroup>
                        <Label htmlFor="">Department</Label>
                        <Select
                          // defaultMenuIsOpen={true}
                          value={
                            userDepartment.value
                              ? {
                                  label: userDepartment.value,
                                  value: userDepartment.value,
                                }
                              : { value: "", label: "Select" }
                          }
                          className="popup-select"
                          classNamePrefix="userDepartment"
                          onChange={(data) => {
                            this.setState({ userDepartment: data });
                          }}
                          name="userDepartment"
                          options={departmentOptions}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm={6}>
                      <FormGroup>
                        <Label htmlFor="">Designation</Label>
                        <Select
                          value={
                            userDesignation.value
                              ? {
                                  label: userDesignation.value,
                                  value: userDesignation.value,
                                }
                              : { value: "", label: "Select" }
                          }
                          className="popup-select"
                          classNamePrefix="userDesignation"
                          onChange={(data) => {
                            this.setState({ userDesignation: data });
                          }}
                          name="userDesignation"
                          options={designationOptions}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm={12}>
                      <FormGroup>
                        <Label htmlFor="" className="required">
                          Email{" "}
                        </Label>
                        <Input
                          type="email"
                          readOnly
                          value={userEmail}
                          onChange={(e) => this.onHandelChange(e)}
                          name="userEmail"
                          placeholder="Enter Email"
                        />
                        {error.email && (
                          <span className="text-danger">
                            {"Please select email"}
                          </span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col sm={12}>
                      <FormGroup>
                        <Label htmlFor="">Preferred Calendar</Label>
                        <Select
                          value={
                            calenderOption.value
                              ? {
                                  label: calenderOption.value,
                                  value: calenderOption.value,
                                }
                              : { value: "", label: "Select" }
                          }
                          className="popup-select"
                          classNamePrefix="calenderOption"
                          onChange={(data) => {
                            this.setState({ calenderOption: data });
                          }}
                          name="calenderOption"
                          options={calenderOptions}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm={12}>
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <span onClick={this.toggle} className="resetPass">
                            Reset Password
                          </span>
                        </div>
                      </div>
                    </Col>
                    <Col sm={12}>
                      <div className="text-center">
                        <Button
                          color="gradient"
                          className="profile-btn"
                          onClick={(e) => this.sendRequest(e, "organization")}
                        >
                          Save
                        </Button>
                      </div>
                      <div className="text-center delete-account">
                        Click
                        <Button
                          className="delete-account-btn"
                          onClick={this.toggleDeleteModal}
                        >
                          here
                        </Button>
                        to delete your account
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>

              <Modal
                isOpen={this.state.importModal}
                toggle={this.toggleImportModal}
                className="user-details-wrapper account-form-screen"
              >
                <ModalHeader toggle={this.toggleImportModal}>
                  Import Company Details
                </ModalHeader>
                <ModalBody>
                  {this.state.dataFromFile.length === 0 && (
                    <FormGroup>
                      <Label for="" className="required">
                        Category
                      </Label>
                      <div className="selectContent">
                        <Select
                          className="popup-select"
                          name="importOption"
                          options={[
                            { value: "department", label: "Department" },
                            { value: "designation", label: "Designation" },
                            { value: "location", label: "Location" },
                            { value: "project", label: "Project" },
                          ]}
                          onChange={(e) => this.handleImportOptionInput(e)}
                          disabled
                        />
                      </div>
                    </FormGroup>
                  )}
                  {this.state.dataFromFile.length === 0 &&
                    this.state.importOption != "" && (
                      <div>
                        <br />
                        <Col sm="12">
                          <div>
                            <CSVReader
                              onDrop={this.handleOnDrop}
                              noDrag
                              addRemoveButton
                            >
                              <span style={{ "font-weight": "bold" }}>
                                Click to upload
                              </span>
                              <br></br>
                              <span style={{ "font-size": "13px" }}>
                                CSV File should be in the following format:
                              </span>
                              {this.state.importOption === "department" && (
                                <span
                                  style={{
                                    "font-size": "13px",
                                    "font-weight": "bold",
                                  }}
                                >
                                  Department
                                </span>
                              )}
                              {this.state.importOption === "designation" && (
                                <span
                                  style={{
                                    "font-size": "13px",
                                    "font-weight": "bold",
                                  }}
                                >
                                  Designation
                                </span>
                              )}
                              {this.state.importOption === "project" && (
                                <span
                                  style={{
                                    "font-size": "13px",
                                    "font-weight": "bold",
                                  }}
                                >
                                  Project
                                </span>
                              )}
                              {this.state.importOption === "location" && (
                                <span
                                  style={{
                                    "font-size": "13px",
                                    "font-weight": "bold",
                                  }}
                                >
                                  Location
                                </span>
                              )}
                            </CSVReader>
                            <div></div>
                          </div>
                        </Col>
                      </div>
                    )}

                  <Row>
                    <Col sm="12">
                      <Label for="">
                        {this.state.dataFromFile.length > 0 && "Imported Data"}
                      </Label>
                      <Table
                        responsive
                        size="sm"
                        style={{ "font-size": "11px" }}
                      >
                        {this.state.dataFromFile.length > 0 && (
                          <thead>
                            <tr>
                              {this.state.importOption == "department" && (
                                <th>Department</th>
                              )}
                              {this.state.importOption == "designation" && (
                                <th>Designation</th>
                              )}
                              {this.state.importOption == "location" && (
                                <th>Location</th>
                              )}
                              {this.state.importOption == "project" && (
                                <th>Project</th>
                              )}
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
                                    style={{
                                      "font-size": "8px",
                                      display: "block",
                                    }}
                                  >
                                    {this.state.dataFromFileError[i]}
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
                            disabled={this.state.csvDataValid}
                          >
                            Send Request
                          </Button>
                        )}
                      </center>
                    </Col>
                  </Row>
                </ModalBody>
              </Modal>
            </>
          ) : (
            <>
              <div className="dashboard-title">
                <h2>User Profile</h2>
              </div>
              <div className="profile-wrap">
                <div className="account-form-screen">
                  <div className="text-center upload-icon">
                    {isUploading ? (
                      <div className="doc-content">
                        <span style={{ textAlign: "center" }}>
                          <Loader
                            type="TailSpin"
                            color="#00BFFF"
                            height={60}
                            width={60}
                          />
                          Uploading...
                        </span>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/x-png,image/gif,image/jpeg"
                          className="d-none"
                          id="f-upload"
                          onChange={(e) => this.handleFileUpload(e, "logo")}
                        />
                        <label htmlFor="f-upload">
                          <div className="camera-icon">
                            <img
                              className="d-block"
                              src={file && file ? file : UploadIcon}
                              style={{
                                width: 100,
                                height: 100,
                                borderRadius: "100%",
                                objectFit: "cover",
                              }}
                              alt="UploadIcon"
                            />
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                  <Row>
                    <Col sm={6}>
                      <FormGroup>
                        <Label htmlFor="" className="required">
                          Name
                        </Label>
                        <Input
                          type="text"
                          name="userName"
                          value={userName}
                          onChange={(e) => this.onHandelChange(e)}
                          placeholder="Enter First Name"
                        />
                        {error.name && (
                          <span className="text-danger">{"Name is empty"}</span>
                        )}
                      </FormGroup>
                    </Col>
                    <Col sm={6}>
                      <FormGroup>
                        <Label htmlFor="" className="required">
                          Email{" "}
                        </Label>
                        <Input
                          type="email"
                          readOnly
                          value={this.props.userDetails.email}
                          onChange={(e) => this.onHandelChange(e)}
                          name="email"
                          placeholder="Enter Email"
                        />
                        {error.email && (
                          <span className="text-danger">
                            {"Please select email"}
                          </span>
                        )}
                      </FormGroup>
                    </Col>
                    {department && designation && (
                      <Col sm={12}>
                        <Row>
                          <Col sm={6}>
                            <FormGroup>
                              <Label htmlFor="">Department</Label>
                              <Input
                                type="text"
                                readOnly
                                value={individualUserReducer.department}
                                onChange={(e) => this.onHandelChange(e)}
                                name="department"
                              />
                              {/* name="department" placeholder="Please select department" /> */}
                              {/* {error.department && <span className="text-danger">{"Please select department"}</span>} */}
                            </FormGroup>
                          </Col>
                          <Col sm={6}>
                            <FormGroup>
                              <Label htmlFor="">Designation</Label>
                              <Input
                                type="text"
                                readOnly
                                value={individualUserReducer.designation}
                                onChange={(e) => this.onHandelChange(e)}
                                name="designation"
                              />
                              {/* } name="designation" placeholder="Please select designation" /> */}
                              {/* {error.designation && <span className="text-danger">{"Please select designation"}</span>} */}
                            </FormGroup>
                          </Col>
                        </Row>
                      </Col>
                    )}
                    {department && designation && (
                      <Col sm={12}>
                        <FormGroup>
                          <Label htmlFor="" className="required">
                            Organization Name{" "}
                          </Label>
                          <Input
                            type="text"
                            readOnly
                            value={organzationName || ""}
                            name="organizationName"
                            // placeholder="Enter Email"
                          />
                          {/* {error.email && (
                          <span className="text-danger">
                            {"Please select email"}
                          </span>
                        )} */}
                        </FormGroup>
                      </Col>
                    )}
                    <Col sm={12}>
                      <FormGroup>
                        <Label htmlFor="">Preferred Calendar</Label>
                        <Select
                          value={
                            calenderOption.value
                              ? {
                                  label: calenderOption.value,
                                  value: calenderOption.value,
                                }
                              : { value: "", label: "Select" }
                          }
                          className="popup-select"
                          classNamePrefix="calenderOption"
                          onChange={(data) => {
                            this.setState({ calenderOption: data });
                          }}
                          name="calenderOption"
                          options={calenderOptions}
                        />
                      </FormGroup>
                    </Col>
                    {individualType === "individual" && (
                      <Col sm={12}>
                        <FormGroup>
                          <Label htmlFor="" className="required">
                            License Key
                          </Label>
                          <div className="key-wrap">
                            <Input
                              type="text"
                              name="license"
                              value={license}
                              onChange={(e) => this.onHandelChange(e)}
                              placeholder="Enter license key"
                              className="license-key"
                            />
                            <img src={KeyIcon} alt="keyIcon" className="key" />
                          </div>
                          {error.license && (
                            <span className="text-danger">
                              {"Invalid license"}
                            </span>
                          )}
                        </FormGroup>
                      </Col>
                    )}
                    <Col sm={12}>
                      <FormGroup>
                        <Label htmlFor="">Account expires on</Label>
                        <div className="profile-date">
                          <DatePicker
                            selected={
                              LicenseExpireDate
                                ? moment(LicenseExpireDate).toDate()
                                : null
                            }
                            disabled
                            className="form-control date"
                            dateFormat="MM/dd/yyyy"
                            minDate={moment().toDate()}
                          />
                          {/* {LicenseTimeLeft && LicenseTimeLeft.days && LicenseTimeLeft.days > 0 ? <span>{LicenseTimeLeft.days} days</span> : ""}{LicenseTimeLeft && LicenseTimeLeft.hours && LicenseTimeLeft.hours > 0 ? <span> {LicenseTimeLeft.hours} hours left</span> : ""} */}
                          <span>{this.licenseTime(LicenseTimeLeft)}</span>
                        </div>
                      </FormGroup>
                    </Col>
                    <Col sm={12}>
                      <div>
                        <p className="bottom-text text-left mb-0">
                          Extend License?
                          <Link
                            onClick={(e) => this.toggleSubscriptionModal(e)}
                          >
                            Click here
                          </Link>
                        </p>
                      </div>
                      <div>
                        <span onClick={this.toggle} className="resetPass">
                          Reset Password
                        </span>
                      </div>
                    </Col>
                    <Col sm={12}>
                      <div className="text-center">
                        <Button
                          color="gradient"
                          className="profile-btn"
                          onClick={(e) => this.sendRequest(e, "user")}
                        >
                          Save
                        </Button>
                      </div>
                      <div className="text-center delete-account">
                        Click
                        <Button
                          className="delete-account-btn"
                          onClick={this.toggleDeleteModal}
                        >
                          here
                        </Button>
                        to delete your account
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </>
          )}
        </div>
        {isSubscriptionModal && (
          <SubscriptionPlansModal
            isOpen={isSubscriptionModal}
            isToggle={this.toggleSubscriptionModal}
          />
        )}
        <ResetPasswordModal
          open={this.state.modal}
          toggle={this.toggle}
          changePassword={changePassword}
          userId={userId}
          userDetails={userDetails}
        />
        {deleteModal && (
          <DeleteAccountModal
            isOpen={deleteModal}
            onToggleModal={this.toggleDeleteModal}
            setAccountStatus={setAccountStatus}
            userDetails={userDetails}
            userId={userId}
            isInvitedUser={department && designation ? true : false}
            isAdmin={department && designation ? false : true}
            setDeleteOrDeactivateAccount={setDeleteOrDeactivateAccount}
            setUserAccountStatus={setUserAccountStatus}
          />
        )}
      </div>
    );
  }
}

export default withRouter(ProfileComponent);
