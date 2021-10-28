import {
  GATH_CREATE_MODAL_ON,
  GATH_DETAIL_MODAL_ON,
  CONFIRM_MODAL_ON,
  MODAL_OFF,
} from "../actions/actionTypes";

const initialState = {
  isGathCreateModal: false,
  isGathDetailModal: false,
  isConfirmModal: false,
};

const modalReducer = (prevState = initialState, action) => {
  let state;
  switch (action.type) {
    case GATH_CREATE_MODAL_ON:
      state = { ...prevState, isGathCreateModal: true };
      break;
    case GATH_DETAIL_MODAL_ON:
      state = { ...prevState, isGathDetailModal: true };
      break;
    case CONFIRM_MODAL_ON:
      state = { ...prevState, isConfirmModal: true };
      break;
    case MODAL_OFF:
      state = { ...initialState };
      break;
    default:
      state = { ...prevState };
  }
  return state;
};

export default modalReducer;
