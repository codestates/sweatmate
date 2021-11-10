import api from "./index";

const chatApi = {
  getChatList: () => api.get(`/chat`),
  getChatDetail: (gatheringId) => api.get(`/chat/${gatheringId}`),
};

export default chatApi;
