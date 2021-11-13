import api from "./index";
import { getMainSocketIO } from "../network/socket";

const authApi = {
  checkEmail: (email) => api.get(`/auth/email/${email}`),
  checkNickname: (nickname) => api.get(`/auth/nickname/${nickname}`),
  signin: async (info) => {
    const res = await api.post("/auth/signin", info);
    if (res.status === 200) {
      getMainSocketIO();
    }
    return res;
  },
  guestSignin: async () => {
    const res = await api.post("/auth/guest");
    if (res.status === 200) {
      getMainSocketIO();
    }
    return res;
  },
  signout: async () => {
    const res = await api.get("/auth/signout");
    if (res.status === 200) {
      getMainSocketIO().emit("signout");
    }
    return res;
  },
  signup: (info) => api.post("/auth/signup", info),
  me: async () => {
    const res = await api.get("/auth/me");
    if (res.status === 200) {
      getMainSocketIO();
    }
    return res;
  },
  kakao: (authorizationCode) =>
    api.post(
      "/auth/kakao",
      { authorizationCode },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ),
  google: (authorizationCode) =>
    api.post(
      "/auth/google",
      { authorizationCode },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ),
};

export default authApi;
