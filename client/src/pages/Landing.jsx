import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import authApi from "../api/auth";
import { signinAction, signoutAction } from "../store/actions";

const Landing = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const getKakaoSignin = async (authorizationCode) => {
      const res = await authApi.kakao(authorizationCode);
      if (res.status === 200 || res.status === 201) {
        dispatch(signinAction(res.data));
        history.push("/home");
      }
    };

    const getGoogleSignin = async (authorizationCode) => {
      const res = await authApi.google(authorizationCode);
      if (res.status === 200 || res.status === 201) {
        dispatch(signinAction(res.data));
        history.push("/home");
      }
    };

    if (code) {
      if (state === "kakao") {
        getKakaoSignin(code);
      } else {
        getGoogleSignin(code);
      }
    } else {
      const checkValidUser = async () => {
        try {
          const res = await authApi.me();
          if (res.status === 200) {
            dispatch(signinAction(res.data));
          }
        } catch (error) {
          if (error.response.status === 403) {
            dispatch(signoutAction);
            history.push("/");
          }
        }
      };
      checkValidUser();
    }
  }, []);

  return <div>Landing!</div>;
};

export default Landing;
