import { EXAMPLE_TYPE } from "../actions/actionTypes";

const initialState = "Initial state";

const exampleReducer = (prevState = initialState, action) => {
  let state = prevState;
  switch (action.type) {
    case EXAMPLE_TYPE:
      state = action.payload;
      break;
    default:
      break;
  }
  return state;
};

export default exampleReducer;
