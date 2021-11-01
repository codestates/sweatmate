import { combineReducers } from "redux";
import modalReducer from "./modalReducer";
import authReducer from "./authReducer";

const rootReducer = combineReducers({
  modalReducer,
  authReducer,
  // ...
});

export default rootReducer;
