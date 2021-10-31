import api from "./index";

const authApi = {
  checkEmail: (email) => api.get(`/auth/email/${email}`),
  checkNickname: (nickname) => api.get(`/auth/nickname/${nickname}`),
  signin: (info) => api.post("/auth/signin", info),
  guestSignin: () => api.post("/auth/guestsignin"),
  signout: () => api.get("/auth/signout"),
  signup: (info) => api.post("/auth/signup", info),
  me: () => api.get("/auth/me"),
};

export default authApi;