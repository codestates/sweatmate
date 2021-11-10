import api from "./index";

const gathApi = {
  getSportList: () => api.get("/sportList.json"),
  getAreaList: () => api.get("/areaList.json"),
  findGath: (queries) => {
    let query = `sportName=${queries.sport}&areaName=${queries.area}`;
    if (queries.date) query += `&date=${queries.date}`;
    if (queries.time) query += `&time=${queries.time}`;
    if (queries.totalNum) query += `&totalNum=${queries.totalNum}`;
    return api.get(`/gathering?${query}`);
  },
  createGath: (gath) => api.post("/gathering", gath),
  joinGath: (gatheringId) => api.post(`/gathering/${gatheringId}`),
  endGath: (gatheringId) => api.patch(`/gathering/${gatheringId}`),
  leaveGath: (gatheringId, userId) => api.delete(`/gathering/${gatheringId}/${userId}`),
  getAllGath: () => api.get("/gathering/random"),
  getUpcomingGath: (userId) => api.get(`/gathering/upcoming/${userId}`),
  getPassedGath: (userId) => api.get(`/gathering/passed/${userId}`),
};

export default gathApi;
