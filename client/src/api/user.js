import api from "./index";

const userApi = {
  getUerInfo: (id) => api.get(`/user/${id}`),
};

export default userApi;
