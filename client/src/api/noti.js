import api from "./index";

const notiApi = {
  getNotificationList: () => api.get(`/notification`),
  removeNotification: (id) => api.delete(`/notification/${id}`),
};

export default notiApi;
