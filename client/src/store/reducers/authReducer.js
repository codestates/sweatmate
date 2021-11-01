import { SIGN_IN, SIGN_OUT } from "../actions/actionTypes";

const initialState = {
  isLogin: false,
  email: null,
  nickname: "",
  image: null,
  gathering: [],
};

const authReducer = (prevState = initialState, action) => {
  let state;
  switch (action.type) {
    case SIGN_IN:
      state = {
        ...prevState,
        isLogin: true,
        ...action.payload,
      };
      break;
    case SIGN_OUT:
      state = { ...initialState };
      break;
    default:
      state = { ...prevState };
  }
  return state;
};

export default authReducer;
