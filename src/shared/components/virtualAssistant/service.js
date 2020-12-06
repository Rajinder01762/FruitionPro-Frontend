import SuperFetch from "../../util/superFetch";

export const serve = {
  testAPICall: async (ids) => {
    return await SuperFetch.get(`albums?ids=${ids}`);
  },
  createMeeting: async (data, token) => {
    console.log("data from service", data, token);
    try {
      const r = await SuperFetch.post("api/meeting/create", data, token);
      console.log(r, "rrrrrrrrrrrrrrrr");
    } catch (err) {
      console.log(err, "error in service");
    }
  },
};
