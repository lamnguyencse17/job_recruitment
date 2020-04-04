import { GET_JOBS } from "Components/actions/types/model_types";
import { SET_JOBS } from "Components/actions/types/control_types";

const initialState = {
  page: [],
  nextPage: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
    case GET_JOBS:
      return {
        ...state,
        page: action.payload
      };
    case SET_JOBS:
      return {
        ...state,
        page: action.payload
      };
  }
}
