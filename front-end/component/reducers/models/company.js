import { GET_COMPANY } from "Components/actions/types/model_types";
import { SET_COMPANY } from "Components/actions/types/control_types";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
    case GET_COMPANY:
      return action.payload;
    case SET_COMPANY:
      return action.payload;
  }
}
