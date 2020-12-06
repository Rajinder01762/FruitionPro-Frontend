import {
  SELECT_USER_TYPE,
  LOGIN_USER,
  SOCIAL_LOGIN,
  UPDATE_USER_PROFILE,
  GET_USER_OR_ORGANIZATION,
} from "../../../store/actionTypes";
import modal from "../../../util/index";
import { composeResetReducer } from "../../../store/reducers/reset-reducer";
import { SET_ACCOUNT_TYPE } from "./types";

const initialState = {
  type: null,
  logo: null,
  license: null,
  department: null,
  designation: null,
  departments: [],
  projects: [],
  locations: [],
  licenseExpireDate: null,
  licenseTimeLeft: null,
  isTypeSet: false,
  organzationName : ''
};

const UserTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_USER_TYPE.SUCCESS: {
      const { status, message, data } = action.payload.data;

      modal(status, message);
      if (status === 200) {
        return {
          ...state,
          type: data && data.type,
          license:
            data &&
            data.license_key &&
            data.license_key.key &&
            data.license_key.key,
          licenseExpireDate: data && data.license_expire_date,
          licenseTimeLeft: data && data.leftTimeToExpireLicense,
          logo: data && data.logo,
        };
      } else {
        return state;
      }
    }
    case LOGIN_USER.SUCCESS: {
      const { status, data } = action.payload.data;

      if (status === 200) {
        const user = data.user;
        // const { type } = data.user;
        let licenseKey = null;
        let typeUser = null;
        let expDate = null;
        let userDepartment = null;
        let userDesignation = null;
        let userLicense = null;
        let userLicenseExpire = null;
        let userLicenseTimeLeft = null;
        let userProjects = null;
        let userLocations = null;
        let userDepartments = null;
        let Department = "";
        let Designation = "";
        let logo = null;
        // const {
        //   department,
        //   designation,
        //   license_key,
        //   license_expire_date,
        //   leftTimeToExpireLicense,
        //   projects,
        //   locations,
        //   departments,
        // } = data.InvitedUser;
        // if (
        //   data.InvitedUser &&
        //   data.InvitedUser.department &&
        //   data.InvitedUser.designation
        // ) {
        //   userDepartment = department ? department : null;
        //   userDesignation = designation ? designation : null;
        //   userLicense = license_key.key ? license_key.key : "";
        //   userLicenseExpire = license_expire_date ? license_expire_date : "";
        //   userProjects = projects.length > 0 ? projects : null;
        //   userLocations = locations.length > 0 ? locations : null;
        //   userDepartments = departments.length > 0 ? departments : null;

        //   return {
        //     ...state,
        //     type: "invitedUser",
        //     license: userLicense,
        //     licenseExpireDate: userLicenseExpire,
        //     department: userDepartment,
        //     designation: userDesignation,
        //     licenseTimeLeft: leftTimeToExpireLicense,
        //     logo: data.logo ? data.logo : logo,
        //     projects: userProjects,
        //     locations: userLocations,
        //     departments: userDepartments,
        //     isTypeSet: Boolean(userLicense),
        //   };
        // }

        let typeSetOrg = false;
        if (user.type === "individual") {
          typeUser = "individual";
          licenseKey = (user.license_key && user.license_key.key) || "";
          expDate =
            data && data.license_expire_date && data.license_expire_date;
          userLicenseTimeLeft =
            data &&
            data.leftTimeToExpireLicense &&
            data.leftTimeToExpireLicense;
          logo = user.logo;
          typeSetOrg = Boolean(licenseKey);
        }

        if (user.type === "organization") {
          licenseKey = user.organization_id.license_key.key;
          typeSetOrg = Boolean(licenseKey);
          Department = null;
          Designation = null;
        }
        // if (user.type === null) {
        //   licenseKey =
        //     data && data.individualUser && data.individualUser.license;
        // }
        // if (
        //   data &&
        //   data.individualUser &&
        //   data.individualUser.license &&
        //   data.individualUser.license
        // ) {
        //   typeSetOrg = true;
        // }

        return {
          ...state,
          type: typeUser,
          license: licenseKey ? licenseKey : null,
          isTypeSet: typeSetOrg,
          licenseExpireDate:
            data && data.license_expire_date ? data.license_expire_date : null,
          department:
            user.type === "organization"
              ? Department
              : data && data.department
              ? data.department
              : null,
          designation:
            user.type === "organization"
              ? Designation
              : data && data.user.designation
              ? data.user.designation
              : null,
          licenseTimeLeft: data.leftTimeToExpireLicense
            ? data.leftTimeToExpireLicense
            : null,
          logo: data && data.logo ? data.logo : logo,
          projects:
            data && data.projects && data.projects.length > 0
              ? data.projects
              : [],
          locations:
            data && data.locations && data.locations.length > 0
              ? data.locations
              : [],
          departments:
            data && data.departments && data.departments.length > 0
              ? data.departments
              : [],
        };
        // return {
        //   ...state,
        //   type: typeUser,
        //   license: licenseKey ? licenseKey : userLicense,
        //   licenseExpireDate: expDate ? expDate : userLicenseExpire,
        //   department: data.department ? data.department : userDepartment,
        //   designation: data.designation ? data.designation : userDesignation
        // }
      } else {
        return state;
      }
    }
    case UPDATE_USER_PROFILE.SUCCESS: {
      const { status, data } = action.payload.data;
      if (status === 200) {
        return {
          ...state,
          department: data && data.department === "" ? null : data.department,
          designation:
            data && data.designation === "" ? null : data.designation,
          license:
            data &&
            data.license_key &&
            data.license_key.key &&
            data.license_key.key,
          // type: 'individual',
          licenseExpireDate: data && data.license_expire_date,
          logo: data && data.logo,
          licenseTimeLeft: data && data && data.leftTimeToExpireLicense,
        };
      } else {
        return {
          ...state,
        };
      }
    }
    case GET_USER_OR_ORGANIZATION.SUCCESS: {
      const { status, details } = action.payload.data;
      if (status === 200) {
        if (details.userType === "user") {
          return {
            ...state,
            logo : details && details.logo,
            department: details && details.department,
            designation: details && details.designation,
            license: details && details.license_key && details.license_key.key,
            licenseExpireDate: details && details.license_expire_date,
            licenseTimeLeft: details && details.leftTimeToExpireLicense,
            organzationName : details && details.invited_by_organization && details.invited_by_organization.name
          };
        } else {
          return state;
        }
      } else {
        return state;
      }
    }
    case SOCIAL_LOGIN.SUCCESS: {
      const { status, data, exist } = action.payload.data;

      if (status === 200) {
        if (exist) {
          const {
            license_key,
            type,
            department,
            designation,
            logo,
          } = data.user;
          if (type === "organization") {
            const {
              license_key,
              type,
              department,
              designation,
              logo,
            } = data.user.organization_id;
            console.log(Boolean(license_key), "Boolean(license_key)");
            return {
              ...state,
              type,
              license: license_key && license_key.key,
              designation:
                designation === "" || designation === [] ? null : designation,
              department:
                department === "" || department === [] ? null : department,
              logo: (data && data.user && data.user.logo) || logo,
              licenseExpireDate: license_key && license_key.expire_date,
              // licenseTimeLeft: leftTimeToExpireLicense,
              isTypeSet: Boolean(license_key),
            };
          } else {
            console.log(Boolean(license_key), "Boolean(license_key)");
            return {
              ...state,
              type,
              license: license_key && license_key.key,
              designation:
                designation === "" || designation === [] ? null : designation,
              department:
                department === "" || department === [] ? null : department,
              logo,
              licenseExpireDate: license_key && license_key.expire_date,
              // licenseTimeLeft: leftTimeToExpireLicense,
              isTypeSet: Boolean(license_key),
            };
          }
        } else {
          return {
            ...state,
            email: data && data.email,
            name: data && data.name,
            logo: data && data.logo,
          };
        }
      } else {
        return state;
      }
    }

    case SET_ACCOUNT_TYPE: {
      return {
        ...state,
        isTypeSet: action.payload,
      };
    }

    default:
      return state;
  }
};
export default composeResetReducer(UserTypeReducer, initialState);
