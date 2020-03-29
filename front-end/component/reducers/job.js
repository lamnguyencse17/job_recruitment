import { GET_JOB } from "Components/actions/types/model_types";
import { SET_JOB } from "Components/actions/types/control_types";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
    case GET_JOB:
      return action.payload;
    case SET_JOB:
      return action.payload;
  }
}
