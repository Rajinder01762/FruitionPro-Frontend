import axios from "axios";
axios.interceptors.request.use(async (data) => {
  const config = data;
  config.headers["Content-Type"] = "application/json";
  config.headers["Accept"] = "application/json";
  return config;
});

// Fruition Pro
export const msClientId = "d7f11bf4-b810-41e3-a341-ce18d69756fb"; // Microsoft key
export const gClientId =
  "896062986709-ru94f50rsdh1ab3srriakr0g3r0ef69j.apps.googleusercontent.com"; // Google key

// local
// export const msClientId = "310e9c04-f4c7-42d7-b9e0-054367fce828"; // microsoft key
// export const gClientId = "470448795622-bfgo5jm04ac52qojrkn6kkenqmb80p9d.apps.googleusercontent.com"; // google key
// export const gClientId = "198411914227-ubf8mieiqm1hi2ne1f793gmv1bb6t8ld.apps.googleusercontent.com"; // google key

// axios.defaults.baseURL = "http://13.250.95.37/api/";
// axios.defaults.baseURL = "http://192.168.1.36:5000/api/";
// export const backendUrl = "http://13.250.95.37/api/"

// system config
const systemType = "local";
const backendIP = "localhost";
const frontendIP = "localhost";

// Frontend live AWS url
export const frontendUrl =
  systemType === "local"
    ? `http://${frontendIP}:3000`
    : "https://www.fruitionpro.com";

// Backend live AWS url
export const backendUrl =
  systemType === "local"
    ? `http://${backendIP}:5000/api/`
    : "https://api.fruitionpro.com/api/";

// export const frontendUrl = "http://localhost:3000";
// export const backendUrl = "http://192.168.1.52:5000/api/";

// export const frontendUrl = "https://www.fruitionpro.com";
// export const backendUrl = "https://api.fruitionpro.com/api/";

// export const frontendUrl = window.origin.includes("www") ? "https://www.fruitionpro.com" : "https://fruitionpro.com";
// export const frontendUrl = `https://${window.origin.includes("https://www.") ? "www." : ""}fruitionpro.com`;

axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";
export default axios.create({
  //all axios can be used, shown in axios documentation
  baseURL: backendUrl,
  // baseURL: "http://192.168.1.44:5000/api/",
  // baseURL: "http://13.250.95.37/api/",
  responseType: "json",
});
