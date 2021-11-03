import { SEARCH_GATH } from "../actions/actionTypes";

const initialState = {
  sport: "",
  area: "",
  date: "",
  time: "",
  totalNum: null,
};

const gathReducer = (prevState = initialState, action) => {
  let state;
  switch (action.type) {
    case SEARCH_GATH:
      state = {
        ...prevState,
        ...action.payload,
      };
      break;
    default:
      state = { ...prevState };
  }
  return state;
};

export default gathReducer;
