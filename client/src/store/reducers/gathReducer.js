import { SEARCH_GATH } from "../actions/actionTypes";

const initialState = {
  filter: {
    sport: "",
    area: "",
    date: "",
    time: "",
    totalNum: null,
  },
  gathList: [],
};

const gathReducer = (prevState = initialState, action) => {
  let state;
  switch (action.type) {
    case SEARCH_GATH:
      state = {
        filter: {
          sport: action.payload.conditions?.sportName || "",
          area: action.payload.conditions?.areaName || "",
          date: action.payload.conditions?.date || "",
          time: action.payload.conditions?.time || "",
          totalNum: action.payload.conditions?.totalNum || null,
        },
        gathList: action.payload.gatherings,
      };
      break;
    default:
      state = { ...prevState };
  }
  return state;
};

export default gathReducer;
