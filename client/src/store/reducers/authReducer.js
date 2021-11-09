import { SIGN_IN, SIGN_OUT, UPDATE_INFO } from "../actions/actionTypes";

const initialState = {
  id: "",
  isLogin: false,
  nickname: "",
  email: "",
  area: "",
  image: "",
  gender: "",
  age: "",
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
    case UPDATE_INFO:
      state = {
        ...prevState,
        image: action.payload.data.image,
        nickname: action.payload.data.nickname,
        area: action.payload.data.area,
        gender: action.payload.data.gender,
        age: action.payload.data.age,
      };
      break;
    default:
      state = { ...prevState };
  }
  return state;
};

export default authReducer;
