import api from "./index";

const userApi = {
  getUserInfo: (userId) => api.get(`/user/${userId}`),
  modifyUserInfo: (userId, formData) => {
    console.log("api요청시 formData", formData);
    return api.put(`/user/${userId}`, formData, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
  },
  deleteUserAccount: (usersId) => api.delete(`/user/${usersId}`),
};

export default userApi;
