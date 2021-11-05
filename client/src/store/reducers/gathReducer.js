import { SEARCH_GATH } from "../actions/actionTypes";

const initialState = {
  conditions: {
    sport: "",
    area: "",
    date: "",
    time: "",
    totalNum: null,
  },
  gatherings: [],
};

const gathReducer = (prevState = initialState, action) => {
  let state;
  switch (action.type) {
    case SEARCH_GATH:
      state = {
        conditions: {
          sport: action.payload.conditions?.sportName || "",
          area: action.payload.conditions?.areaName || "",
          date: action.payload.conditions?.date || "",
          time: action.payload.conditions?.time || "",
          totalNum: Number(action.payload.conditions?.totalNum) || null,
          formatedSport:
            `${action.payload.conditions?.sportName}${action.payload.conditions?.sportEmoji}` || "",
          formatedDate:
            `${action.payload.conditions?.date?.split("-")[0]}년 ${
              action.payload.conditions?.date?.split("-")[1]
            }월 ${action.payload.conditions?.date?.split("-")[2]}일` || "",
        },
        gatherings: action.payload.gatherings,
      };
      break;
    default:
      state = { ...prevState };
  }
  return state;
};

export default gathReducer;
