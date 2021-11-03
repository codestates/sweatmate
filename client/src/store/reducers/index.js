import { combineReducers } from "redux";
import modalReducer from "./modalReducer";
import authReducer from "./authReducer";
import gathReducer from "./gathReducer";

const rootReducer = combineReducers({
  modalReducer,
  authReducer,
  gathReducer,
  // ...
});

export default rootReducer;
