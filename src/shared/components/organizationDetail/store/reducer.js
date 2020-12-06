import {
  SELECT_ORGANIZATION,
  LOGIN_USER,
  SOCIAL_LOGIN,
  UPDATE_ORGANIZATION_PROFILE,
  GET_USER_OR_ORGANIZATION,
} from "../../../store/actionTypes";
import { composeResetReducer } from "../../../store/reducers/reset-reducer";
import modal from "../../../util/index";
import { SET_USER_TYPE } from "../../accountType/store/types";

const initialState = {
  type: null,
  saveOrganization: false,
  organizationId: null,
  organizationLogo: null,
  organizationName: null,
  organizationEmail: null,
  organizationLicense: null,
  organizationDepartments: [],
  organizationDesignations: [],
  organizationLocations: [],
  organizationProjects: [],
  organizationExpireDate: null,
  organizationLicenceTimeLeft: null,
  userDepartment: "",
  userDesignation: "",
  adminLogo : null
};

const OrganizationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_ORGANIZATION.SUCCESS: {
      const { status, message, data } = action.payload.data;
      modal(status, message);

      if (status === 200) {
        const { organization_id } = data.user;
        const organization = organization_id;
        return {
          ...state,
          saveOrganization: true,
          type: "organization",
          organizationId: organization && organization._id,
          organizationLogo: organization && organization.logo,
          organizationName: organization && organization.name,
          organizationEmail: organization && organization.email,
          organizationLicense:
            organization &&
            organization.license_key,
          organizationExpireDate:
            organization && organization.license_key.expire_date,
          organizationLicenceTimeLeft:
            organization && organization.leftTimeToExpireLicense,
        };
      } else {
        return state;
      }
    }
    case LOGIN_USER.SUCCESS: {
      const { status, data } = action.payload.data;
      if (status === 200) {
        const { type } = data.user;
        let licenseKey = null;
        let typeUser = null;
        let name = null;
        let id = null;
        let email = null;
        let department = [];
        let designation = [];
        let project = [];
        let location = [];
        let expDate = null;
        let timeLeft = null;
        let logo = null;
        let userDepartment = "";
        let userDesignation = "";
        let adminLogo = ""

        if (type === "organization") {
          typeUser = "organization";
          const organization = data.user.organization_id;
          name = organization.name;
          id = organization._id;
          email = organization.email;
          licenseKey = organization.license_key.key
            ? organization.license_key.key
            : null;
          department = organization.department;
          designation = organization.designation;
          location = organization.location;
          project = organization.project;
          expDate = organization.license_key.expiry_date;
          logo = organization.logo;
          adminLogo =  data && data.user && data.user.logo
          userDepartment = data && data.user.department;
          userDesignation = data && data.user.designation;
        } else if (data.user.invited_by_organization) {
          department = data.user.invited_by_organization.department;
          project = data.user.invited_by_organization.project;
        }
        return {
          ...state,
          type: typeUser,
          saveOrganization: true,
          organizationName: name,
          organizationId: id,
          organizationEmail: email,
          organizationLicense: licenseKey,
          organizationDepartments: department,
          organizationDesignations: designation,
          organizationProjects: project,
          organizationLocations: location,
          organizationExpireDate: expDate,
          organizationLicenceTimeLeft: timeLeft,
          organizationLogo: logo,
          userDepartment: userDepartment,
          userDesignation: userDesignation,
          adminLogo
        };
      } else {
        return state;
      }
    }
    case SOCIAL_LOGIN.SUCCESS: {
      const { status, data, exist } = action.payload.data;
      if (status === 200 && exist) {
        const { type } = data.user;
        let licenseKey = null;
        let typeUser = null;
        let name = null;
        let id = null;
        let email = null;
        let department = [];
        let designation = [];
        let project = [];
        let location = [];
        let expDate = null;
        let timeLeft = null;
        let logo = null;
        let userDepartment = "";
        let userDesignation = "";
        if (type === "organization") {
          typeUser = "organization";
          const organization = data.user.organization_id;
          name = organization.name;
          id = organization._id;
          logo = organization.logo;
          email = organization.email;
          licenseKey = organization.license_key && organization.license_key.key;
          department = organization.department;
          designation = organization.designation;
          location = organization.location;
          project = organization.project;
          expDate =
            organization.license_key && organization.license_key.expire_date;
          userDepartment =
            data && data.user && data.user.department
              ? data.user.department
              : "";
          userDesignation =
            data && data.user && data.user.designation
              ? data.user.designation
              : "";
        } else if (data.user.invited_by_organization) {
          department = data.user.invited_by_organization.department;
          project = data.user.invited_by_organization.project;
        }
        return {
          ...state,
          type: typeUser,
          saveOrganization: true,
          organizationName: name,
          organizationId: id,
          organizationEmail: email,
          organizationLicense: licenseKey,
          organizationDepartments: department,
          organizationDesignations: designation,
          organizationProjects: project,
          organizationLocations: location,
          organizationExpireDate: expDate,
          organizationLicenceTimeLeft: timeLeft,
          organizationLogo: logo,
          userDepartment: userDepartment,
          userDesignation: userDesignation,
        };
      } else {
        if (exist === false) {
          return {
            organizationLogo: data.logo,
          };
        } else {
          return state;
        }
      }
    }
    case UPDATE_ORGANIZATION_PROFILE.SUCCESS: {
      const { status, data } = action.payload.data;
      if (status === 200) {
        return {
          ...state,
          organizationId: data && data._id,
          adminLogo : data && data.personalDetails && data.personalDetails.logo,
          organizationLogo: data && data.logo,
          organizationName: data && data.name,
          organizationEmail: data && data.email,
          organizationLicense:
            data && data && data.license_key && data.license_key.key
              ? data.license_key.key
              : null,
          organizationDepartments: data && data.department,
          organizationDesignations: data && data.designation,
          organizationProjects: data && data.project,
          organizationLocations: data && data.location,
          organizationExpireDate: data && data.license_expire_date,
          organizationLicenceTimeLeft: data && data.leftTimeToExpireLicense,
          userDepartment:
            data && data.personalDetails && data.personalDetails.department
              ? data.personalDetails.department
              : "",
          userDesignation:
            data && data.personalDetails && data.personalDetails.designation
              ? data.personalDetails.designation
              : "",
        };
      }
      return {
        ...state,
      };
    }
    case GET_USER_OR_ORGANIZATION.SUCCESS: {
      const { status, details } = action.payload.data;

      if (status === 200) {
        if (details.userType !== "user") {
          const organization = details && details.organization_id;
          return {
            ...state,
            organizationId: organization._id,
            organizationLogo: organization.logo,
            organizationName: organization.name,
            organizationEmail: organization.email,
            organizationLicense:
              details && details.license_key ? details.license_key.key : null,
            organizationDepartments: organization.department,
            organizationDesignations: organization.designation,
            organizationProjects: organization.project,
            organizationLocations: organization.location,
            organizationExpireDate: details && details.license_expire_date,
            adminLogo: details && details.logo
          };
        }
      }
    }
    case SET_USER_TYPE: {
      return {
        ...state,
        type:
          action && action.payload === "organization" ? "organization" : null,
      };
    }
    default:
      return state;
  }
};
export default composeResetReducer(OrganizationReducer, initialState);
