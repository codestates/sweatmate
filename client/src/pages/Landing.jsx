import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import authApi from "../api/auth";
import { signInAction, signOutAction } from "../store/actions";

const Landing = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const checkValidUser = async () => {
      try {
        const res = await authApi.me();
        if (res.status === 200) {
          dispatch(signInAction(res.data.data));
        } else {
          const err = new Error();
          err.status = res.status;
        }
      } catch (error) {
        if (error.status === 403) {
          dispatch(signOutAction);
          history.push("/");
        }
      }
    };
    checkValidUser();
  }, [dispatch, history]);

  return <div>Landing</div>;
};

export default Landing;
