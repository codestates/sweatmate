import {
  GATH_CREATE_MODAL_ON,
  GATH_DETAIL_MODAL_ON,
  CONFIRM_MODAL_ON,
  SIGNUP_MODAL_ON,
  SIGNIN_MODAL_ON,
  MODAL_OFF,
} from "./actionTypes";

// // action
// export const exampleAction = {
//   type: EXAMPLE_TYPE,
//   payload: "Example payload",
// };

// // action creator
// export const exampleActionCreator = (payload) => ({
//   type: EXAMPLE_TYPE,
//   payload,
// });

// Modal
export const gathCreateModalOnAction = {
  type: GATH_CREATE_MODAL_ON,
};
export const gathDetailModalOnAction = {
  type: GATH_DETAIL_MODAL_ON,
};
export const confirmModalOnAction = {
  type: CONFIRM_MODAL_ON,
};
export const signupOnAction = {
  type: SIGNUP_MODAL_ON,
};
export const signinOnAction = {
  type: SIGNIN_MODAL_ON,
};
export const modalOffAction = {
  type: MODAL_OFF,
};
