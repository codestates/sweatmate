import { EXAMPLE_TYPE } from "./actionTypes";

// action
export const exampleAction = {
  type: EXAMPLE_TYPE,
  payload: "Example payload",
};

// action creator
export const exampleActionCreator = (payload) => ({
  type: EXAMPLE_TYPE,
  payload,
});
