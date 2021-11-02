import api from "./index";

const gatheringApi = {
  upcoming: (userId) => api.get(`/gathering/upcoming/${userId}`),
  passed: (userId) => api.get(`/gathering/passed/${userId}`),
};

export default gatheringApi;
