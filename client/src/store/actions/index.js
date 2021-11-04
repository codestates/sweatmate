import {
  GATH_CREATE_MODAL_ON,
  GATH_DETAIL_MODAL_ON,
  CONFIRM_MODAL_ON,
  SIGNUP_MODAL_ON,
  SIGNIN_MODAL_ON,
  MODAL_OFF,
  SIGN_IN,
  SIGN_OUT,
  SEARCH_GATH,
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

// Auth
export const signinAction = (data) => ({
  type: SIGN_IN,
  payload: { ...data },
});
export const signoutAction = {
  type: SIGN_OUT,
};

// Modal
export const gathCreateModalOnAction = {
  type: GATH_CREATE_MODAL_ON,
};
export const gathDetailModalOnAction = (gathering) => ({
  type: GATH_DETAIL_MODAL_ON,
  payload: { ...gathering },
});
export const confirmModalOnAction = {
  type: CONFIRM_MODAL_ON,
};
export const signupModalOnAction = {
  type: SIGNUP_MODAL_ON,
};
export const signinModalOnAction = {
  type: SIGNIN_MODAL_ON,
};
export const modalOffAction = {
  type: MODAL_OFF,
};

// Gath
export const searchGathAction = ({ conditions, gatherings }) => ({
  type: SEARCH_GATH,
  payload: { conditions, gatherings },
});
