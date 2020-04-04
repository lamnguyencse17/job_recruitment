import {
    SEARCH_TERM
  } from "Components/actions/types/control_types";
  
  const initialState = {};
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case SEARCH_TERM:
        return {
          result: action.payload
        };
      default:
        return state;
    }
  }
  