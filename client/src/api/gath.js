import api from "./index";

const gathApi = {
  findGath: () => api.get("/gathering"),
  createGath: () => api.post("/gathering"),
  joinGath: (gatheringId) => api.post(`/gathering/${gatheringId}`),
  endGath: (gatheringId) => api.patch(`/gathering/${gatheringId}`),
  leaveGath: (gatheringId) => api.delete(`/gathering/${gatheringId}`),
  getAllGath: () => api.get("/gathering/random"),
  getUpcomingGath: (userId) => api.get(`/gathering/upcoming/${userId}`),
  getPassedGath: (userId) => api.get(`/gathering/passed/${userId}`),
};

export default gathApi;
